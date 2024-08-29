//@ts-nocheck

import { Router, Response, NextFunction } from "express"
import { Container } from "typedi"
import { uploadCover, uploadDocument } from "../middleware/upload"

import LibraryService from "../../services/libraryService"
import DocumentService from "../../services/DocumentService"
import isAuth from "../middleware/isAuth"


const router = Router()

export default (app: Router) => {

	app.use("/libraries", router)

	const libraryService = Container.get(LibraryService)
	const documentService = Container.get(DocumentService)
	const s3Instance = Container.get('s3')

	//Get libraries
	router.get("/", isAuth, async(req: Request, res: Response, next: NextFunction) => {

		try{

			const { keyword, offset } = req.query
			const { id: user_id } = req.user;
			const { libraries, has_next } = await libraryService.fetchLibraries(offset, user_id, keyword);
		
			res.json({libraries, has_next}).end()
		}
		catch(err){

			next(err)
		}
	})

	//Create library
	router.post("/", isAuth, uploadCover(s3Instance).single("library_cover"), async(req: Request, res: Response, next: NextFunction) => {


		try{

			const { cover_url } = req;
			const { name } = req.body;
			const { id: user_id } = req.user;

			const created_library = await libraryService.createLibrary(name, cover_url, user_id);

			res.json(created_library).end();

		}
		catch(err){
  
			next(err)
		}
	})

	//Edit library (name and/or cover)
	router.patch("/:library_id", isAuth, uploadCover(s3Instance).single("library_cover"), async(req: Request, res: Response, next: NextFunction) => {
		
		try{

			const { cover_url } = req;
			const { name } = req.body;
			const { library_id } = req.params; 
			const { id: user_id } = req.user;

			await libraryService.updateLibrary(library_id, {name, cover_url}, user_id);

			res.end();
		}
		catch(err){

			next(err)
		}

	})

	//Delete library 
	router.delete("/:library_id", isAuth, async(req: Request, res: Response, next: NextFunction) => {

		try{

			const { library_id } = req.params;
			const { id: user_id } = req.user;

			await libraryService.deleteLibrary(library_id, user_id);

			res.end()

		}
		catch(err){

			next(err)
		}

	})

	//Get documents in given library 
	router.get("/:library_id/documents", isAuth, async(req: Request, res: Response, next: NextFunction) => {

		try{

			const { library_id } = req.params;
			const { offset, keyword, sort_by, sort_order } = req.query;
			const { documents, has_next } = await documentService.fetchDocuments(library_id, offset, sort_by, sort_order, keyword)

			res.json({documents, has_next}).end()

		}
		catch(err){

			next(err)
		}

	})

	//Create documents in given library 
	router.post("/:library_id/documents", isAuth, uploadDocument(s3Instance).single("document"), async(req: Request, res: Response, next: NextFunction) => {

		try{

			const { library_id } = req.params;
			const { document_url } = req
			const { id: user_id } = req.user;

			const created_doc = await documentService.createDocument(library_id, document_url, user_id);

			res.json(created_doc).end()

		}
		catch(err){

			next(err)
		}
	})

	//Edit document in given library
	router.patch("/:library_id/documents/:document_id", isAuth, uploadCover(s3Instance).single("document_cover"), async(req: Request, res: Response, next: NextFunction) => {

		try{

			const { library_id, document_id } = req.params;
			const { title, author, description } = req.body;
			const { id: user_id } = req.user;
			const { cover_url } = req;

			await documentService.updateDocument(library_id, document_id, { title, author, description, cover_url }, user_id)

			res.end()
		}
		catch(err){

			next(err)
		}
	})

	//Delete document in given library
	router.delete("/:library_id/documents/:document_id", isAuth, async(req: Request, res: Response, next: NextFunction) => {

		try{

			const { document_id, library_id } = req.params;
			const { id: user_id } = req.user;

			await documentService.deleteDocument(library_id, document_id, user_id);

			res.end()

		}
		catch(err){

			next(err)
		}
	})

}		