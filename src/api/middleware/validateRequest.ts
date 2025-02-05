import { Request, Response, NextFunction } from "express"
import { ObjectSchema } from "joi"

export default (schema: ObjectSchema) => {

	return ((req: Request, res: Response, next: NextFunction) =>{

		const { error, value } = schema.validate(

			{ body: req.body, query: req.query, params: req.params }, 
			{ abortEarly: false, allowUnknown: true, stripUnknown: true }
		);

		if(error){

			return res.status(401).json({ error: error.details[0].message }).end();
		}

		req.body = value.body || req.body;
		req.params = value.params || req.params
		req.query = value.query || req.query 

		next()
	})

}

