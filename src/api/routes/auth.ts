//@ts-nocheck

import { Router, Response, NextFunction } from "express"
import { Container } from "typedi"
import AuthService from "../../services/authService"
import validateRequest from "../middleware/validateRequest"
import {
  loginValidator,
  registerValidator,
  requestPasswordResetValidator,
  resetPasswordValidator
} from "../middleware/validators/auth"
import isAuth from "../middleware/isAuth"

const router = Router()

export default (app: Router) => {

  app.use("/auth", router)

  const authService = Container.get(AuthService)

  // Login route
  router.post("/login", validateRequest(loginValidator), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { login, password } = req.body;
      const tokens = await authService.login(login, password);
      res.json(tokens).end();
    } catch (err) {
      next(err);
    }
  });

  // Register route
  router.post("/register", validateRequest(registerValidator), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { login, password, name } = req.body;
      const user = await authService.register(login, password, name);
      res.set('Content-Type', 'text/json')
      res.send(user).end();
    } catch (err) {
      next(err);
    }
  });

  // Request password reset
  router.post("/password-reset", validateRequest(requestPasswordResetValidator), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { login } = req.body;
      await authService.requestPasswordReset(login);
      res.end();
    } catch (err) {
      next(err);
    }
  });

  // Reset password
  router.post("/reset-password", validateRequest(resetPasswordValidator), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { reset_key, new_password } = req.body;
      const tokens = await authService.resetPassword(reset_key, new_password);
      res.json(tokens).end();
    } catch (err) {
      next(err);
    }
  });

  // Token refresh
  router.post("/refresh-token", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refresh_token } = req.body;
      const tokens = await authService.generateNewAccessToken(refresh_token);
      res.json(tokens).end();
    } catch (err) {
      next(err);
    }
  });

}