//@ts-nocheck
import { Service, Inject } from 'typedi'
import { v4 as uuid } from "uuid"
import sequelize  from "sequelize"
import HttpError from "../utils/HttpError"
import bcrypt from "bcrypt"
import crypto from "crypto"
import jwt from "jsonwebtoken"
import ILoginPayload from "../interfaces/ILoginPayload"
import IRefreshPayload from "../interfaces/IRefreshPayload"
import { REFRESH_TOKEN_EXP, ACCESS_TOKEN_EXP } from "../constants/expirations"
import { recoveryEmailText, recoveryEmailHTML } from "../utils/recoverEmail"


@Service()
class AuthService {

	constructor(

		@Inject('userModel') private userModel,
		@Inject('recoveryModel') private recoveryModel,
		@Inject('ses') private ses,
		@Inject('sns') private sns,
		@Inject('refreshTokenModel') private refreshTokenModel

	){}

	private getLoginField(login: string): Promise<string> {

		const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	    const phone_pattern = /^\+?[1-9]\d{1,14}$/; // Basic international format for phone numbers, e.g., +123456789 or 123456789
	    
	    if (email_pattern.test(login)) {

	        return 'email';
	    } 
	    else if (phone_pattern.test(login)) {
	        
	        return 'phone';
	    } 

	    return null;
	    
	}

	private async getPasswordHash(plain_password: string): Promise<string> {

		const salt = await bcrypt.genSalt(SALT_ROUNDS);
		const hash = await bcrypt.hash(plain_password, salt);

		return hash
	}

	public async login(login: string, password: string): Promise<ILoginPayload>{

		const login_field = this.getLoginField(login);

		if(!login_field) {

			throw new HttpError("Bad Input", 401)
		}

		const user = this.userModel.findOne({ where: { [login_field]: login } });

		if(!user) {

			throw new HttpError("User Not Found", 401)

		}

		const match = await bcrypt.compare(password, user.hash);

		if(match){

			const access_token = await jwt.sign({ user_id: user.id }, JWT_KEY, { expiresIn: ACCESS_TOKEN_EXP })
			const refresh_token = uuid();
			const issued_at = Date.now()
			const refresh_token_expiry = issued_at + REFRESH_TOKEN_EXP

			await this.refreshTokenModel.create({

				token: refresh_token,
				user_id: user.id,
				issued_at: issued_at,
				expiry: refresh_token_expiry

			})

			return { access_token, refresh_token }

		}
		else{

			throw new HttpError("Forbidden", 403)
		}

	} 

	public async register(login: string, password: string, name: string): Promise<string>{

		const hash = await this.getPasswordHash(password);
		const creation_date = Date.now();
		
		const new_user = await this.userModel.create({ [login_field]: login, creation_date, hash, name})

		return JSON.stringify(new_user, null, 2)
	}

	public async invalidateRefreshTokens(user_id: string): Promise<void>{

		await this.refreshTokenModel.destroy({ where: { user_id: user_id } })
	} 

	public async generateNewAccessToken(refresh_token: string): Promise<IRefreshPayload>{

		const token_record = this.refreshTokenModel.findOne({ token: refresh_token });

		if (!token_record) {

			throw new HttpError("Forbidden", 403)
		}

		const { expiry, user_id } = token_record;

		if(Date.now() >= expiry) { 

			throw new HttpError("Forbidden", 403)
		}

		const access_token = await jwt.sign({ user_id: user_id }, JWT_KEY, { expiresIn: ACCESS_TOKEN_EXP } )

		return { access_token, user_id }
	} 

	public async verifyAccessToken(access_token: string, refresh_token: string): Promise<string | IRefreshPayload>{

		return await new Promise((resolve, reject) => {

			jwt.verify(access_token, JWT_KEY, async (err, decoded) => {
				
				if(err){
		
					try {

						const access_payload: IRefreshPayload = await this.generateNewAccessToken(refresh_token);

						resolve(access_payload)

					}
					catch(refresh_err){

						reject(new HttpError("Forbidden", 403))
					}
					
				}

				resolve(decoded.user_id);
			})
		})

	} 

	public async requestPasswordReset(login: string): Promise<void> {

		const login_field = this.getLoginField(login);

		if(login_field == 'phone'){

			const code = crypto.randomInt(100000, 1000000)

			await this.recoveryModel.create({ key: code, login: login })

			await this.sns.publish({

				Message: `Your 6 digit verification code is ${code}`,
				
				PhoneNumber: login

			}).promise()

		}
		else if(login_field == 'email'){

			const reset_key = uuid();

			await this.recoveryModel.create({ key: reset_key, login: login })

			await this.ses.sendEmail({

				Destination: {

					ToAddresses: [login]
				},

				Message: {

					Body: {

						Html: {

							Data: recoveryEmailHTML(reset_key)
						},

						Text: {

							Data: recoveryEmtailText(reset_key)
						}

					}
				},

				Subject: {

					Data: 'Password Recovery'
				}

			})
		}
		else {

			throw new HttpError("Bad Input", 400)
		}


	}

	public async resetPassword(reset_key: string, new_password: string): Promise<ILoginPayload>{

		const recovery_record = await this.recoveryModel.findOne({ where: { key: reset_key }})

		if(!recovery_record){

			throw new HttpError("Forbidden", 403)
		}

		const transaction = await sequelize.transaction();
		const new_hash = await this.getPasswordHash(new_password);

		try{

			const login_field = this.getLoginField(recovery_record.login);

			await Promise.all([

				this.userModel.updateOne( { hash: new_hash },  { where: { [login_field]: recovery_record.login } }, { transaction }),
				
				this.recoveryModel.destroy( { where: { key: reset_key } }, { transaction } ),
				
				this.refreshTokenModel.destroy( { where: { user_id: recovery.user_id } }, { transaction } ),
			])


			await transaction.commit()

			const { access_token, refresh_token } = await this.login(recovery_record.login, new_password)

			return { access_token, refresh_token }

		}
		catch(err){

			await transaction.rollback();

			throw err;
		}

	}

}

export default AuthService
