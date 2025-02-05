import 'reflect-metadata'
import { Service, Inject } from 'typedi'

@Service()
class ProgressService{

	constructor(

		@Inject('progressModel') private progressModel
	){}
}