//@ts-nocheck
import express, { Router, Response, NextFunction } from "express";
import { Container } from "typedi";
import {
  createInvite,
  invalidateAllInvites,
  getInvites,
  invalidateInvite
} from "../../middleware/validators/invites"; // Validators for invites
import InviteService from "../../../services/inviteService"; // Invite service to handle business logic
import isAuth from "../../middleware/isAuth";
import validateRequest from "../../middleware/validateRequest";

const router = Router();

export default (library_router: Router) => {

  library_router.use('/', router);

  const inviteService = Container.get(InviteService);

  // Create an invite link for a library
  router.post("/:library_id/invites", isAuth, validateRequest(createInvite), async(req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = req;
      const { library_id } = req.params;
      const inviteLink = await inviteService.createInvite(library_id, user.id);
      res.json({ inviteLink }).end();
    } catch (err) {
      next(err);
    }
  });

  router.get("/:library_id/invites", isAuth, validateRequest(getInvites), async(req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = req;
      const { offset } = req.query
      const { library_id } = req.params;
      const { invites, has_next } = await inviteService.fetchInvites(library_id, offset);
      res.set('Content-Type', 'text/json')
      res.send({ invites, has_next  }).end();
    } catch (err) {
      next(err);
    }
  });

  router.delete('/:library_id/invites/:invite_code', isAuth, validateRequest(invalidateInvite), async(req: Request, res: Response, next: NextFunction) => {
    try{
      const { invite_code, library_id } = req.params;
      const { user } = req;
      await inviteService.invalidateInvite(invite_code, library_id, user.id);
      res.status(200).end()
    }
    catch(err){
      next(err)
    }
  });

  router.delete("/:library_id/invites", isAuth, validateRequest(invalidateAllInvites), async(req: Request, res: Response, next: NextFunction) => {
    try {
      const { library_id } = req.params;
      const { user } = req;
      await inviteService.invalidateAllInvites(library_id, user.id);
      res.status(200).end();
    } catch (err) {
      next(err);
    }
  });
}