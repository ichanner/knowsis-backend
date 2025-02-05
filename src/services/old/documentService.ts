import 'reflect-metadata'

import { Service, Inject } from 'typedi'
import { v4 as uuid } from "uuid"
import HttpError from "../utils/HttpError"
import ILibrary from "../interfaces/ILibrary"
import IDocument from "../interfaces/IDocument"
import cleanObject from "../utils/cleanObject" 
import CollaboratorService from "./collaboratorService"
import { DOCUMENT_LIMIT } from '../constants/limits'

/**
	
	Document Service 

	...

**/

@Service()
class DocumentService {

	constructor(

		@Inject('documentModel') private documentModel,
		@Inject(() => CollaboratorService) private collaboratorService,

	){}

	public async fetchDocuments(library_id: string, offset: number, sort_by: string | null, sort_order: number | null, keyword?: string | null){

		if(!sort_by){

			sort_by = 'creation_date'
		}

		if(!sort_order){

			sort_order = -1
		}

		const match_query = keyword ? 
		{ library_id: library_id, $text: { $search: keyword } } 
		: { library_id: library_id }

		const sort_query = keyword ? 
		{ score: { $meta: 'textScore' }, [sort_by]: sort_order } 
		: { [sort_by]: sort_order }


		const documents = await this.documentModel.aggregate([

			/* do perms check */

			{ $match: match_query },

			{ $sort: sort_query },

			{ $skip: offset },

			{ $limit: DOCUMENT_LIMIT },

			/* Get reading progress */

		])
	
		const has_next = documents.length >= DOCUMENT_LIMIT

		return { documents, has_next }
	}

	public async createDocument(library_id: string, document_url: string | null, user_id: string){

		const document_id = uuid()
		const date = Date.now()
		const can_create = await this.collaboratorService.exists(library_id, user_id)

		if(can_create){

			return await this.documentModel.create({

				id: document_id,
				library_id: library_id,
				url: document_url,
				owner_id: user_id,
				creation_date: date
			})

		}
		else{

			throw new HttpError("Forbidden", 403)
		}
	}

	public async updateDocument(library_id: string, document_id: string, updates: { title: string | null, author: string | null, description: string | null, cover_url: string | null }, user_id: string){

		const can_update = await this.collaboratorService.exists(library_id, user_id)

		if(can_update){

			const cleaned_updates = cleanObject(updates)

		 	await this.documentModel.updateOne({id: document_id, library_id: library_id}, cleaned_updates)

		 	return cleaned_updates
		}
		else{

			throw new HttpError("Forbidden", 303)
		}
	}

	public async deleteDocument(library_id: string, document_id: string, user_id: string){

		const can_delete = await this.collaboratorService.exists(library_id, user_id)

		if(can_delete){

			 await this.documentModel.deleteOne({id: document_id, library_id: library_id})
		}
		else{

			throw new HttpError("Forbidden", 303)
		}

	}

}


export default DocumentService 