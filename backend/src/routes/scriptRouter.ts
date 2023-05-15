import express, { Express, Request, Response } from "express";

import {
  isScriptRunning,
  startScript,
  stopScript,
} from "../controller/matrixController.js";

export const scriptRouter = express.Router();

scriptRouter.get("/status", (req: Request, res: Response) => {
  let running: number = isScriptRunning();
  let status: string = running === -1 ? "not running" : "running";

  res.status(200).send(`Script is ${status}`);
});

scriptRouter.post("/stopScript", (req: Request, res: Response) => {
  stopScript();
});

scriptRouter.post("/startScript", (req: Request, res: Response) => {
  startScript();
});
