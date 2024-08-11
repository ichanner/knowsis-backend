import express from "express"
import cors from 'cors'
import config from "../config/index"
import routes from "../api/index"
import sanitizeRequest from '../api/middleware/parseRequest'

export default (app : express.Application) =>{

	app.enable('proxy');

	app.use(cors())
	app.use(express.urlencoded({ extended: true }));
	app.use(express.json());
	app.use(sanitizeRequest);
	app.use(config.API_PREFIX, routes());

	app.get('/', (req, res)=>{

		res.send("<b> Knowsis Backend </b>").end()
	})

	app.get("/status", (req, res)=>{

		res.status(200).send()
	})

	app.head("/status", (req, res)=>{

		res.status(200).send()
	})

	//error 404
	app.use((req, res, next)=>{

		const error = new Error('Not Found')

		error['status'] = 404

		next(error)
	})

	app.use((err, req, res, next)=>{

		if(err.message == "Unauthorized"){

			err['status'] = 403
		}
		else if(err.message == 'Invalid Request'){

			err['status'] = 400
		}
		
		next(err)
	})

	app.use((err, req, res, next)=>{

		res.status(err.status || 500)

		res.json({
			
			message: err.message || "An Error Occured"
		
		}).end()

	})

}