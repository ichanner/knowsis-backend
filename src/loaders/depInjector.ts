import { Container } from "typedi"
import { S3 } from "aws-sdk"
import Agenda from "agenda"
import IModel from "../interfaces/IModel"

export default async(connection, models: {name : string, model: IModel}[], s3: S3) =>{

	for(let model of models){

		console.log(model)

		Container.set(model.name, model.model)
	}

	const agenda: Agenda = new Agenda({mongo: connection.db})
	
	Container.set('mongo-client', connection.client)
	Container.set('mongo-database', connection.db)
	Container.set('agenda', agenda)
	Container.set('s3', s3)

	return agenda;
	
}