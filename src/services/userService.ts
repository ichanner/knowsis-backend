import 'reflect-metadata'

import cleanUpdateObject from "../utils/cleanUpdateObject"
import { Service, Inject } from 'typedi'
import HttpError from "./utils/HttpError"

//adding collabs
//finding new owners

@Service()
class UserService {

	constructor(

		@Inject('userModel') private userModel,
		@Inject('libraryModel') private libraryModel


	){}

	public async updateUser(user_id: string, updates: IUserUpdate[]): Promise<{[key: string]: string | null}>{

		const cleaned_updates = cleanUpdateObject(updates)

		await this.userModel.update(cleaned_updates, { where: { id: user_id }});

		return cleaned_updates;
	}

	public async getUser(user_id: string): Promise<string | null> {

		const user = await this.userModel.findOne({ where: { id: user_id }});

		if(!user){

			return null;
		}

		return JSON.stringify(user, null, 2)
	}

	public async deleteUser(user_id: string){

		const library_count = await this.libraryModel.count({ where: { owner_id: user_id } })

		if(library_count > 0){

			throw new HttpError("Forbidden", 403);
		}


		await this.userModel.destroy({ where: { id: user_id }})
	}
}