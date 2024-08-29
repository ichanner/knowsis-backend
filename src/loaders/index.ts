//@ts-nocheck
import express from "express"
import http from "http"
import initExpress from "./express"
import initMongoose from "./mongoose"
import initAws from "./aws"
import dependencyInjector from "./depInjector"
import Model from "../utils/Model"

export default async(app: express.Application, server: http.Server)=> {
	
	console.log("Starting Initializers")
	
	const models = 	[ 

		Model("documentModel"),
		Model("libraryModel"),
		Model("savedLibraryModel")
	]

	const conn = await initMongoose();
	const s3 = await initAws();
	
	await dependencyInjector(conn, models, s3);
	await initExpress(app);

}