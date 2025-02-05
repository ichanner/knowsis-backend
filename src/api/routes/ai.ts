//@ts-nocheck
import { Router, Response, NextFunction } from "express";
import { Container } from "typedi";
import PromptService from "../../services/promptService";
import isAuth from "../middleware/isAuth";
import validateRequest from "../../middleware/validateRequest";
import {
  analyzeConnections,
  generateCourseContent,
  summarizeText,
} from "../../middleware/validators/prompts";

const router = Router();

export default (app: Router) => {
  app.use("/prompts", router);

  const promptService = Container.get(PromptService);

  router.post(
    "/connections",
    isAuth,
    validateRequest(analyzeConnections),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { selection, library_id } = req.body;
        const { user } = req;
        const result = await promptService.analyzeConnections(selection, library_id, user.id);
        res.json(result).end();
      } catch (err) {
        next(err);
      }
    }
  );

  router.post(
    "/course",
    isAuth,
    validateRequest(generateCourseContent),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { library_id } = req.body;
        const { user } = req;
        const result = await promptService.generateCourseContent(library_id, user.id);
        res.json(result).end();
      } catch (err) {
        next(err);
      }
    }
  );

  router.post(
    "/summary",
    isAuth,
    validateRequest(summarizeText),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { text } = req.body;
        const result = await promptService.summarizeText(text);
        res.json(result).end();
      } catch (err) {
        next(err);
      }
    }
  );
};