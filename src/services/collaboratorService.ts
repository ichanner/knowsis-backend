import 'reflect-metadata'
import { Service, Inject } from 'typedi'
import { COLLABORATORS_LIMIT } from "../constants/limits"
import sequelize, { Op, Model } from "sequelize"
import LibraryService from "./libraryService"
import HttpError from "../utils/HttpError"
import ICollaborator from "../interfaces/ICollaborator"
import buildSearchQuery from "../utils/buildSearchQuery"

@Service()
class CollaboratorService{


	constructor(

		@Inject('libraryModel') private libraryModel,
		@Inject('userModel') private userModel,
		@Inject('collaboratorModel') private collaboratorModel,
		@Inject(() => LibraryService) private libraryService: LibraryService
	){}

	public async exists(library_id: string, user_id: string): Promise<boolean>{

		const count = await this.collaboratorModel.count( { where: { library_id: library_id, user_id: user_id } })

		return (count > 0)
	}

	public async createCollaborator(library_id: string, user_id: string): Promise<void>{

		await this.collaboratorModel.create({ user_id: user_id, library_id: library_id })
	}

	public async addCollaborator(library_id: string, adder_id: string, added_id: string): Promise<void> {

		const can_add = await this.libraryService.isOwner(library_id, adder_id);

		if(can_add){

			if(adder_id == added_id){

				throw new HttpError("Bad Request", 400)
			}

			await this.createCollaborator(library_id, added_id);
		}
		else{

			throw new HttpError("Forbidden", 403)
		}
	}

	public async removeCollaborator(library_id: string, remover_id: string, removed_id: string): Promise<void> {

		const can_remove = await this.libraryService.isOwner(library_id, remover_id);

		if(can_remove){

			if(removed_id == remover_id){

				throw new HttpError("Bad Request", 400)
			}

			await this.collaboratorModel.destroy({ where: { library_id: library_id, user_id: removed_id } })
		}
		else{

			throw new HttpError("Forbidden", 403)
		}
	}

	public async fetchCollaborators(library_id: string, offset: number): Promise<{ collaborators: ICollaborator[] | [], has_next: boolean }> {

		const collaborators = await this.userModel.findAll({

			include: {

				model: this.libraryModel,

				where: {

					id: library_id
				},

				attributes: []
			},

			offset: offset,

			order: [['name', 'DESC']],

			attributes: ['name', 'id', 'avatar_url', 'bio'],

			limit: COLLABORATORS_LIMIT
		})

		const has_next = collaborators.length >= COLLABORATORS_LIMIT;

		return { collaborators, has_next }
	}

}


export default CollaboratorService