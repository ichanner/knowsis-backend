//@ts-nocheck

import express, { Router, Response, NextFunction } from "express"
import { Container } from "typedi"
import {
  addCollaborator,
  getCollaborators,
  removeCollaborator
} from "../../middleware/validators/collaborators"
import CollaboratorService from "../../../services/collaboratorService"
import isAuth from "../../middleware/isAuth"
import validateRequest from "../../middleware/validateRequest"

const router = Router()

export default (library_router: Router) => {

  library_router.use('/', router);

  const collaboratorService = Container.get(CollaboratorService)

  // Get collaborators
  router.get("/:library_id/collaborators", isAuth, validateRequest(getCollaborators), async(req: Request, res: Response, next: NextFunction) => {
    try{
      const { library_id } = req.params;
      const { offset } = req.query;
      const { collaborators, has_next } = await collaboratorService.fetchCollaborators(library_id, offset);
      res.json({ collaborators, has_next }).end();
    }
    catch(err){
      next(err);
    }
  })

  router.post("/:library_id/collaborators", validateRequest(addCollaborator), isAuth, async(req: Request, res: Response, next: NextFunction) => {
    try{
      const { user } = req;
      const { library_id } = req.params;
      const { added_id } = req.body;
      await collaboratorService.addCollaborator(library_id, user.id, added_id);
      res.end();
    }
    catch(err){
      next(err);
    }
  })

  // Remove collaborator
  router.delete("/:library_id/collaborators", isAuth, validateRequest(removeCollaborator), async(req: Request, res: Response, next: NextFunction) => {
    try{
      const { user } = req;
      const { library_id } = req.params;
      const { removed_id } = req.body;
      await collaboratorService.removeCollaborator(library_id, user.id, removed_id);
      res.end();
    }
    catch(err){
      next(err);
    }
  })
}