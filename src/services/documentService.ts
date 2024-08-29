import 'reflect-metadata'

import { Service, Inject } from 'typedi'
import { v4 as uuid } from "uuid"
import HttpError from "../utils/HttpError"
import ILibrary from "../interfaces/ILibrary"
import IDocument from "../interfaces/IDocument"
import cleanObject from "../utils/cleanObject" 
import LibraryService from "./libraryService"
import { DOCUMENT_LIMIT } from '../constants/limits'

/**
	
	Document Service 

	...

**/

@Service()
class DocumentService {

	constructor(

		@Inject('documentModel') private documentModel,
		@Inject(() => LibraryService) private libraryService

	){}

	private async fetchDocument(library_id: string, document_id: string){

		return await this.documentModel.findOne({id: document_id, library_id: library_id})
	}

	public async fetchDocuments(library_id: string, offset: number, sort_by: string = 'creation_date', sort_order: number = -1, keyword?: string){

		const match_query = keyword ? 
		{ library_id: library_id, $text: { $search: keyword } } 
		: { library_id: library_id }

		const sort_query = keyword ? 
		{ score: { $meta: 'textScore' }, [sort_by]: sort_order } 
		: { [sort_by]: sort_order }


		const documents = await this.documentModel.find(match_query).sort(sort_query)
		.skip(offset)
		.limit(DOCUMENT_LIMIT)
	
		const has_next = documents.length >= DOCUMENT_LIMIT

		return { documents, has_next }
	}

	public async createDocument(library_id: string, document_url: string, user_id: string){

		const document_id = uuid()
		const date = Date.now()

		const library: ILibrary = await this.libraryService.fetchLibrary(library_id)

		if(library.owner_id == user_id){

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

	public async updateDocument(library_id: string, document_id: string, updates: { title?: string, author?: string, description?: string, cover_url?: string }, user_id: string){

		const document: IDocument = await this.fetchDocument(library_id, document_id)

		if(document.owner_id == user_id){

			const cleaned_updates = cleanObject(updates)

		 	await this.documentModel.updateOne({id: document_id, library_id: library_id}, cleaned_updates)
		}
		else{

			throw new HttpError("Forbidden", 303)
		}
	}

	public async deleteDocument(library_id: string, document_id: string, user_id: string){

		const document: IDocument = await this.fetchDocument(library_id, document_id)

		if(document.owner_id == user_id){

			 await this.documentModel.deleteOne({id: document_id, library_id: library_id})
		}
		else{

			throw new HttpError("Forbidden", 303)
		}

	}

}


export default DocumentService 