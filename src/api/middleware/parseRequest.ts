const parse = (data) =>{

	for(let key in data){

		if(data[key] == 'null'){

			data[key] = null
		}
		else if(!isNaN(data[key])){

			data[key] = Number(data[key])
		}
		else if(data[key] == 'false' || data[key] == 'true'){

			data[key] = (data[key] === 'true')
		}
	}

	return data;
} 


export default ((req, res, next) =>{

	if(req.query){

		parse(req.query)
	}

	if(req.body){

		parse(req.body)
	}

	if(req.param){

		parse(req.param)
	}

	next()
})

