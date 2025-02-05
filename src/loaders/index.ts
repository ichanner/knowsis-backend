//@ts-nocheck
import express from "express"
import http from "http"
import initExpress from "./express"
import initMongoose from "./mongoose"
import initSequelize from "./sequelize"
import initAws from "./aws"
import dependencyInjector from "./depInjector"
import initAssociations from "./associations"

const Model = (name: string) => {

	return { name, initialize: require(`../models/${name}.ts`).default }
}

export default async(app: express.Application, server: http.Server)=> {
	
	console.log("Starting Initializers")

	const models = [ 

		Model("userModel"),
		Model("libraryModel"),
		Model("documentModel"),
		Model("userLibraryModel"),
		Model("collaboratorModel"),
		Model("progressModel"),
		Model("refreshTokenModel"),
		Model("recoveryModel"),
		Model("inviteModel")
	]


	const { s3, sns, ses } = await initAws();
	const sequelize = await initSequelize();	

	await dependencyInjector(sequelize, models, s3, sns, ses);
	await initAssociations(sequelize)

	await initExpress(app);


}