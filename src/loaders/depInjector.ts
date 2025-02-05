import { Container } from "typedi"
import { S3, SNS, SES } from "aws-sdk"
import { Sequelize } from "sequelize"
import IModel from "../interfaces/IModel"

export default async(sequelize: Sequelize, models: [IModel], s3: S3, sns: SNS, ses: SES) =>{

	Container.set('sequelize', sequelize)	
	Container.set('s3', s3)
	Container.set('ses', ses)
	Container.set('sns', sns)

	for(let model of models){

		Container.set(model.name, model.initialize(sequelize))
	}
	
	
}