//@ts-nocheck
import express, { Router, Response, NextFunction } from "express";
import { Container } from "typedi";
import { validateInvite } from "../middleware/validators/invites"; // Validators for invites
import InviteService from "../../services/inviteService"; // Invite service to handle business logic
import isAuth from "../middleware/isAuth";
import validateRequest from "../middleware/validateRequest";

const router = Router();

export default (app: Router) => {

  app.use('/invites', router);

  const inviteService = Container.get(InviteService)

  router.get('/:invite_code', isAuth, validateRequest(validateInvite), async(req: Request, res: Response, next: NextFunction) => {
    try{
      const { invite_code } = req.params;
      const { user } = req;
      await inviteService.validateInvite(invite_code, user.id)
      res.status(200).end();
    }
    catch(err){
      next(err)
    }
  })
}