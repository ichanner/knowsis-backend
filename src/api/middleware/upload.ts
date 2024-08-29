import multer from 'multer'
import multerS3 from "multer-s3"
import config from "../../config/index"
import path  from 'path'
import { v4 as uuid } from "uuid"

const coverStorage  = (aws_s3_instance) => { 

	return multerS3({

		s3: aws_s3_instance,

		bucket: config.COVER_BUCKET,

		key: (req, file, cb) => {

			try{

				let filepath;

				const cover_id = uuid()
				const fieldname = file.fieldname;
				const filename = file.originalname
				
				if(fieldname == 'document_cover'){

					filepath = path.join("documents", cover_id, filename)
				}
				else if(fieldname == 'library_cover'){

					filepath = path.join("libraries", cover_id, filename)
				}

				req.cover_url = filepath

		        cb(null, filepath);

		    }
		    catch(err){

		    	cb(err, null)
		    }
		}
	})
}


const documentStorage  = (aws_s3_instance) => { 

	return multerS3({

		s3: aws_s3_instance,
		
		bucket: config.DOCUMENT_BUCKET,

		key: (req, file, cb) => {

			try{

		        const filename = file.originalname
		        const document_id = uuid()
		        const filepath = path.join('temp', document_id, filename)

		        req.document_url = filepath;
		       
		        cb(null, filepath);

		    }
		    catch(err){

		    	cb(err, null)
		    }
		}
	})
}


export const uploadCover = (s3) => multer({storage: coverStorage(s3)})
export const uploadDocument = (s3) => multer({storage: documentStorage(s3)})