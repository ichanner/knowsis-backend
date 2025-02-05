import { Service, Inject } from 'typedi'
import CollaboratorService from "./collaboratorService"
import LibraryService from "./libraryService"
import HttpError from "../utils/HttpError"
import config from "../config/"
import IInvite from "../interfaces/IInvite"
import generateAlphaNumericCode from "../utils/generateAlphaNumericCode" 
import { INVITE_EXP } from "../constants/expirations"
import { INVITE_LIMIT } from "../constants/limits"
import { v4 as uuid } from "uuid"

@Service()
class InviteService {

	constructor(

		@Inject('inviteModel') private inviteModel,
		@Inject(() => LibraryService) private libraryService: LibraryService,
		@Inject(() => CollaboratorService) private collaboratorService: CollaboratorService

	){}

	public async fetchInvites(library_id: string, offset: number): Promise<{invites: IInvite[], has_next: boolean}>{

		const invites = await this.inviteModel.findAll({ 

			where: { library_id: library_id },

			order: [ ['creation_date', 'DESC'] ] ,

			limit: INVITE_LIMIT,

			offset: offset

		})

		const has_next = invites.length >= INVITE_LIMIT;

		return { invites, has_next }

	}

	public async verifyInvite(invite_code: string, user_id: string): Promise<void> {

		const invite_record = await this.inviteModel.findOne({ where: { code: invite_code } })

		if(!invite_record) {

			throw new HttpError("Forbidden", 403);
		}

		if(invite_record.expiry > Date.now()){

			throw new HttpError("Forbidden", 403);
		}
		
		await this.collaboratorService.createCollaborator(invite_record.library_id, user_id)
	}

	public async invalidateAllInvites(library_id: string, user_id: string): Promise<void> {

		const can_invalidate = await this.libraryService.isOwner(library_id, user_id);

		if(can_invalidate){

			await this.inviteModel.destroy({ where: { library_id: library_id } });
		}
		else{

			throw new HttpError("Forbidden", 403)
		}
	}

	public async invalidateInvite(invite_code: string, library_id: string, user_id: string): Promise<void> {
	
		const can_invalidate = await this.libraryService.isOwner(library_id, user_id);

		if(can_invalidate){

			await this.inviteModel.destroy({ where: { code: invite_code } });
		}
		else{

			throw new HttpError("Forbidden", 403)
		}
	}

	public async createInvite(library_id: string, user_id: string): Promise<string> {

		const can_invite = await this.libraryService.isOwner(library_id, user_id);

		if(can_invite){

			const invite_code = generateAlphaNumericCode();
			const date = Date.now()
			const expiry = date + INVITE_EXP

			await this.inviteModel.create({code: invite_code, creation_date: date, expiry: expiry, library_id: library_id})

			return `${config.INVITE_DOMAIN}/${invite_code}`

		}
		else{

			throw new HttpError("Forbidden", 403)
		}

	}
}

export default InviteService