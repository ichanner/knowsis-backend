import 'reflect-metadata'
import { Service, Inject } from 'typedi'

@Service()
class CollaboratorService{


	constructor(

		@Inject('collaboratorModel') private collaboratorModel
	){}

	public async exists(library_id: string, user_id: string){

		return this.collaboratorModel.findOne({library_id: library_id, user_id: user_id})

	}
}

export default CollaboratorService