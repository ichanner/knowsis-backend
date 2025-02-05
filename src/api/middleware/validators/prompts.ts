import { body } from "express-validator";

export const analyzeConnections = [
  body("selection").isString().notEmpty(),
  body("library_id").isString().notEmpty(),
];

export const generateCourseContent = [
  body("library_id").isString().notEmpty(),
];

export const summarizeText = [
  body("text").isString().notEmpty(),
];