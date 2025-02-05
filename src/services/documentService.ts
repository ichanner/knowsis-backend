
import { Service, Inject } from 'typedi'
import { v4 as uuid } from "uuid"
import { DOCUMENT_LIMIT } from '../constants/limits'
import sequelize, { Op } from "sequelize"
import HttpError from "../utils/HttpError"
import ILibrary from "../interfaces/ILibrary"
import IDocumentUpdate from "../interfaces/IDocumentUpdate"
import IDocument from "../interfaces/IDocument"
import cleanUpdateObject from "../utils/cleanUpdateObject" 
import buildSearchQuery from "../utils/buildSearchQuery"
import CollaboratorService from "./collaboratorService"

/**
	
	Document Service 

	...

**/

@Service()
class DocumentService {

	constructor(

		@Inject('documentModel') private documentModel,
		@Inject('progressModel') private progressModel,
		@Inject(() => CollaboratorService) private collaboratorService,

	){}


	public async fetchDocuments(library_id: string, user_id: string, offset: number, sort_by: string | null, sort_order: string | null, keyword?: string | null): Promise<{documents: IDocument[] | [], has_next: boolean}> {

		const vectors = [ 'title_vector', 'tags', 'author_vector', 'description_vector' ]

		const { keyword_ranking, sort_query, keyword_query } = buildSearchQuery(vectors, keyword);
		
		sort_query.push([sort_by, sort_order])
		
		const documents = await this.documentModel.findAll({

			where:{

				[Op.and]: [ { library_id: library_id }, keyword_query ]
			},

			attributes: {

				include: keyword_ranking
			},

			include: {

				model: this.progressModel,

				where: {

					user_id: user_id
				},

				required: false
			},

			order: sort_query,

			offset: offset,

			limit: DOCUMENT_LIMIT,

		})


		const has_next = documents.length >= DOCUMENT_LIMIT;

		return { documents, has_next }
	} 


	public async createDocument(library_id: string, document_url: string | null, user_id: string): Promise<string> {

		const can_create = await this.collaboratorService.exists(library_id, user_id)

		if(can_create){

			const document_id = uuid()
			const date = Date.now()

			const created_doc = await this.documentModel.create({

				id: document_id,
				library_id: library_id,
				content_url: document_url,
				owner_id: user_id,
				creation_date: date
			})

			return JSON.stringify(created_doc, null, 2)
		}
		else{

			throw new HttpError("Forbidden", 403)
		}


	}

	public async updateDocument(library_id: string, document_id: string, updates: IDocumentUpdate, user_id: string): Promise<{ [key: string]: string | null }> {

		const can_update = await this.collaboratorService.exists(library_id, user_id)

		if(can_update){

			const cleaned_updates = cleanUpdateObject(updates)

		//	for(let [key, value] of Object.entries(cleaned_updates)){

		///		cleaned_updates[`${key}_vector`] = sequelize.fn('to_tsvector', 'english', value);
		//	}

		 	await this.documentModel.update(cleaned_updates, { where: { id: document_id, library_id: library_id } })

		 	return cleaned_updates
		}
		else{

			throw new HttpError("Forbidden", 403)
		}
	}

	public async deleteDocument(library_id: string, document_id: string, user_id: string): Promise<void> {

		const can_delete = await this.collaboratorService.exists(library_id, user_id)

		if(can_delete){

			 await this.documentModel.destroy({ where: { id: document_id, library_id: library_id } })
		}
		else{

			throw new HttpError("Forbidden", 403)
		}
	}


}

export default DocumentService