import 'reflect-metadata'

import { Service, Inject } from "typedi"
import { Document } from "mongoose"
import { LIBRARY_LIMIT } from "../constants/limits"
import { v4 as uuid } from "uuid"

import ILibrary from "../interfaces/ILibrary"
import HttpError from "../utils/HttpError"
import cleanObject from "../utils/cleanObject"
import mongoose from "mongoose"



/**

	Library Service Class
	
	...
**/

@Service()
class LibraryService {

	constructor(

		@Inject('libraryModel') private libraryModel,
		@Inject('userLibraryModel') private userLibraryModel

	){}

	private async fetchLibrary(library_id: string) {

		return await this.libraryModel.findOne({ id: library_id }).lean()
	}

	public async fetchLibraries(offset: number, user_id: string, keyword: string | null){

		const match_query = keyword ? { name: { $regex: keyword, $options: 'i' } } : {};
		
		const libraries = await this.userLibraryModel.aggregate([

			{ $match: { user_id: user_id } },

			{
				$lookup:{

					from: 'Libraries',

					localField: 'library_id',

					foreignField: 'id',

					as: 'libraries'
				}
			},

			{ $unwind: '$libraries' },

			{ $replaceRoot: { newRoot: '$libraries' } },

			{ $match: match_query }, 

			{ $sort: { creation_date: -1 } },

			{ $skip: offset },

			{ $limit: LIBRARY_LIMIT },
			
			{
				$lookup:{

					from: 'Users',

					localField: 'owner_id',

					foreignField: 'id',

					as: 'owner' 
				}
			},

			{
				$addFields:{

					owner: { $arrayElemAt:[ '$owner', 0 ] }
				}
			}
			

		])

		const has_next = libraries.length >= LIBRARY_LIMIT;

		return { has_next, libraries };
	}

	public async createLibrary(user_id: string){

		const library_id = uuid()
		const creation_date = Date.now()
		const library_count = await this.userLibraryModel.count({user_id: user_id})
		const initial_name = `Library #${library_count + 1}`
		const session = await mongoose.startSession()

		session.startTransaction()

		try{

			await this.userLibraryModel.create([{

				library_id: library_id,
				user_id: user_id

			}], {session})


			const library = await this.libraryModel.create([{
				
				id: library_id, 
				name: initial_name,
				owner_id: user_id, 
				creation_date: creation_date
			
			}], {session})

			await session.commitTransaction()

			return library;

		}
		catch(err){

			await session.abortTransaction()

			throw err;
		}
		finally{

			session.endSession()
		}
	}

	public async deleteLibrary(library_id: string, user_id: string){

		const library: ILibrary = await this.fetchLibrary(library_id);
		const session = await mongoose.startSession()

		if(user_id == library.owner_id){

			session.startTransaction();

			try{


				await this.userLibraryModel.deleteMany({library_id: library_id}, {session})
				await this.libraryModel.deleteOne({id: library_id}, {session})
			
				await session.commitTransaction()

			}
			catch(err){

				await session.abortTransaction()

				throw err;
			}
			finally{

				session.endSession()
			}
		}
		else{

			throw new HttpError("Forbidden", 403)
		}
	}

	public async updateLibrary(library_id: string, updates: { name: string | null, description: string | null, cover_url: string | null }, user_id: string){

		const library: ILibrary = await this.fetchLibrary(library_id)

		if(user_id == library.owner_id){

			const cleaned_updates = cleanObject(updates);

			await this.libraryModel.updateOne({id: library_id}, cleaned_updates)

			return cleaned_updates;
		}
		else{

			throw new HttpError("Forbidden", 403)
		}

	}

}


export default LibraryService