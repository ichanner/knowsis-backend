//@ts-nocheck

import { Router, Response, NextFunction } from "express"
import { Container } from "typedi"
import { uploadCover } from "../../middleware/upload"
import {
  getLibraries,
  updateLibrary,
  deleteLibrary
} from "../../middleware/validators/libraries"
import LibraryService from "../../../services/libraryService"
import isAuth from "../../middleware/isAuth"
import validateRequest from "../../middleware/validateRequest"
import registerDocuments from "./documents"
import registerCollaborators from "./collaborators"
import registerInvites from "./invites"

const router = Router()

export default (app: Router) => {

  app.use("/libraries", router)

  const libraryService = Container.get(LibraryService)
  const s3Instance = Container.get('s3')

  // Get libraries
  router.get("/", isAuth, validateRequest(getLibraries), async(req: Request, res: Response, next: NextFunction) => {
    try {
      const { offset, keyword } = req.query;
      const { user } = req;
      const { user_libraries, has_next } = await libraryService.fetchLibraries(offset, user.id, keyword);
      res.json({user_libraries, has_next}).end()
    } catch(err) {
      next(err)
    }
  })

  // Create library
  router.post("/", isAuth, async(req: Request, res: Response, next: NextFunction) => {
    try {
      const created_library = await libraryService.createLibrary(req.user.id);
      res.set('Content-Type', 'text/json')
      res.send(created_library).end();
    } catch(err) {
      next(err)
    }
  })

  // Edit library (name and/or cover)
  router.patch("/:library_id", isAuth, validateRequest(updateLibrary), uploadCover(s3Instance).single("library_cover"), async(req: Request, res: Response, next: NextFunction) => {
    try {
      const { cover_url, user } = req;
      const { library_id } = req.params; 
      const { name, description } = req.body;
      const updated_fields = await libraryService.updateLibrary(library_id, { name, description, cover_url }, user.id);
      res.json(updated_fields).end();
    } catch(err) {
      next(err)
    }
  })

  // Delete library
  router.delete("/:library_id", isAuth, validateRequest(deleteLibrary), async(req: Request, res: Response, next: NextFunction) => {
    try {
      const { library_id } = req.params;
      const { user } = req;
      await libraryService.deleteLibrary(library_id, user.id);
      res.end()
    } catch(err) {
      next(err)
    }
  })

  registerDocuments(router);
  registerCollaborators(router);
  registerInvites(router);

}