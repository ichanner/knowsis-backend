import 'reflect-metadata'

import { Service, Inject } from "typedi"
import { LIBRARY_LIMIT } from "../constants/limits"
import { v4 as uuid } from "uuid"
import sequelize, { Op, Model } from "sequelize"
import LibraryModel from "../models/libraryModel"
import ILibrary from "../interfaces/ILibrary"
import ILibraryUpdate from "../interfaces/ILibraryUpdate"
import HttpError from "../utils/HttpError"
import cleanUpdateObject from "../utils/cleanUpdateObject"

@Service()
class LibraryService {

	constructor( 

		@Inject('libraryModel') private libraryModel,
		@Inject('userLibraryModel') private userLibraryModel,
		@Inject('userModel') private userModel,
		@Inject('sequelize') private sequelize

	) {}


	public async isOwner(library_id: string, user_id: string): Promise<boolean> { 

		const library = await this.libraryModel.findOne({ where: { id: library_id } });

		if(library && library.owner_id == user_id){

			return true;
		}
		
		return false;
	}


	public async fetchLibraries(offset: number, user_id: string, keyword: string | null): Promise<{ user_libraries: ILibrary[] | [], has_next: boolean }>{

		const document_query = keyword ? { name: { [Op.substring]: `%${keyword}%` } } : {}
		
		const user_libraries = await this.libraryModel.findAll({
			
			include: [

			    {
			      	model: this.userModel,
			      	
			      	as: "users",

			      	through:{

			      		attributes: []
			      	},
			      	
			      	where: {
			        	
			        	id: user_id,
			      	},
			      	
			      	attributes: ['name', 'id', 'avatar_url', 'bio'],
			    },

		  	],
	    	
	    	where: document_query,

	    	order: [['creation_date', 'DESC']],
	    	
	    	offset: offset,
	   		
	   		limit: LIBRARY_LIMIT		
		});


		const has_next = user_libraries.length >= LIBRARY_LIMIT

		return { user_libraries, has_next }
	}

	public async createLibrary(user_id: string): Promise<string>{

		const library_id = uuid();
		const creation_date = Date.now()

		const library_count = await this.userLibraryModel.count({ where: { user_id: user_id } });
		const library_name = `Library #${library_count}`

		const created_library = await this.libraryModel.create(

			{
				id: library_id, 
				name: library_name,
				owner_id: user_id, 
				creation_date: creation_date
			}		
		)

		return JSON.stringify(created_library, null, 2);

	}

	public async deleteLibrary(library_id: string, user_id: string): Promise<void>{

		const can_delete = await this.isOwner(library_id, user_id)

		if(can_delete){

			await this.libraryModel.destroy({

				where: {

					id: library_id
				}
			})

		}
		else{

			throw new HttpError("Forbidden", 403)
		}
	}

	public async updateLibrary(library_id: string, updates: ILibraryUpdate, user_id: string): Promise<{ [key: string]: string | null }>{

		const can_update = await this.isOwner(library_id, user_id)

		if(can_update){

			const cleaned_updates = cleanUpdateObject(updates);

			await this.libraryModel.update(cleaned_updates, { where: { id: library_id } })

			return cleaned_updates

		}
		else{

			throw new HttpError("Forbidden", 403)
		}

	}
}

export default LibraryService
