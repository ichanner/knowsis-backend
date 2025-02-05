//@ts-nocheck

import { Router, Response, NextFunction } from "express"
import { Container } from "typedi"
import { uploadCover, uploadDocument } from "../../middleware/upload"
import {
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument 
} from "../../middleware/validators/documents"
import DocumentService from "../../../services/documentService"
import isAuth from "../../middleware/isAuth"
import validateRequest from "../../middleware/validateRequest"

const router = Router()

export default (library_router: Router) => {

  library_router.use('/', router)

  const documentService = Container.get(DocumentService)
  const s3Instance = Container.get('s3')

  // Get documents in given library 
  router.get("/:library_id/documents", isAuth, validateRequest(getDocuments), async(req: Request, res: Response, next: NextFunction) => {
    try {
      const { library_id } = req.params;
      const { offset, keyword, sort_by, sort_order } = req.query;
      const { user } = req;
      const { documents, has_next } = await documentService.fetchDocuments(library_id, user.id, offset, sort_by, sort_order, keyword)
      res.json({ documents, has_next }).end()
    } catch (err) {
      next(err)
    }
  })

  // Create documents in given library 
  router.post("/:library_id/documents", isAuth, validateRequest(createDocument), uploadDocument(s3Instance).single("document"), async(req: Request, res: Response, next: NextFunction) => {
    try {
      const { library_id } = req.params;
      const { document_url, user } = req
      const created_doc = await documentService.createDocument(library_id, document_url, user.id);
      res.set('Content-Type', 'text/json')
      res.send(created_doc).end()
    } catch (err) {
      next(err)
    }
  })

  // Edit document in given library
  router.patch("/:library_id/documents/:document_id", isAuth, validateRequest(updateDocument), uploadCover(s3Instance).single("document_cover"), async(req: Request, res: Response, next: NextFunction) => {
    try {
      const { library_id, document_id } = req.params;
      const { title, author, description } = req.body;
      const { cover_url, user } = req
      const updated_fields = await documentService.updateDocument(library_id, document_id, { title, author, description, cover_url }, user.id)
      res.json(updated_fields).end()
    } catch (err) {
      next(err)
    }
  })

  // Delete document in given library
  router.delete("/:library_id/documents/:document_id", isAuth, validateRequest(deleteDocument), async(req: Request, res: Response, next: NextFunction) => {
    try {
      const { document_id, library_id } = req.params;
      await documentService.deleteDocument(library_id, document_id, req.user.id);
      res.end()
    } catch (err) {
      next(err)
    }
  })
}