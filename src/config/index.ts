import dotenv from 'dotenv'

const env = dotenv.config()

if(env.error){

	throw new Error("Unable to load ENV!")
}

export default{

	PORT: process.env.PORT || 3002,
	API_PREFIX: process.env.API_PREFIX || "/api"
}
