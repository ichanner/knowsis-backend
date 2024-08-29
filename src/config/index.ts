import dotenv from 'dotenv'

const env = dotenv.config()

if(env.error){

	throw new Error("Unable to load ENV!")
}

export default{

	PORT: process.env.PORT || 3002,
	DB_CONN_URL: process.env.DB_CONN_URL || "mongodb://localhost:27017",
	API_PREFIX: process.env.API_PREFIX || "/api",
	AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
	AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
	AWS_REGION: process.env.AWS_REGION,
	AWS_ACCOUNT_ID: process.env.AWS_ACCOUNT_ID,
	COVER_BUCKET: 'knowsis-covers',
	DOCUMENT_BUCKET: 'knowsis-documents'
}
