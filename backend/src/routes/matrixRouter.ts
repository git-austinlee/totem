import express, { Express, Request, Response } from "express";

import {
  isPlaying,
  startMatrix,
  stopMatrix,
} from "../controller/matrixController.js";

export const matrixRouter = express.Router();

matrixRouter.get("/status", (req: Request, res: Response) => {
  const status = isPlaying();
  res.status(200).send(status);
});

matrixRouter.post("/stop", (req: Request, res: Response) => {
  stopMatrix();
  const status = isPlaying();
  res.status(200).send(status);
});

matrixRouter.post("/start", (req: Request, res: Response) => {
  startMatrix();
  const status = isPlaying();
  res.status(200).send(status);
});
