import mongoose from 'mongoose'
import config from "../config/"

export default async() =>{

	const options: object = { useNewUrlParser: true, useUnifiedTopology: true }
	const connection_url: string = config.DB_CONN_URL;	
	
	const { connection } = await mongoose.connect(connection_url, options)

	return connection

}