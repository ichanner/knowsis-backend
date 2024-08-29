import { Request, Response, NextFunction } from "express"

const parse = (data: object) =>{

	const parsed_data = {...data};

	for(let key in parsed_data){

		if(parsed_data[key] == 'null'){ //parse null

			parsed_data[key] = null
		}
		else if(!isNaN(parsed_data[key])){ //parse numbers

			parsed_data[key] = Number(parsed_data[key])
		}
		else if(parsed_data[key] == 'false' || parsed_data[key] == 'true'){ //parse boolean

			parsed_data[key] = (parsed_data[key] === 'true')
		}
	}

	return parsed_data;
} 


export default ((req: Request, res: Response, next: NextFunction) =>{

	if(req.query){

		req.query = parse(req.query)
	}

	if(req.body){

		req.body = parse(req.body)
	}

	next()
})

