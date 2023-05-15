import express, { Express, Request, Response } from "express";

export const scriptRouter = express.Router();

scriptRouter.get("/status", (req: Request, res: Response) => {
  res.status(200).send();
});

scriptRouter.post("/stopScript", (req: Request, res: Response) => {
  res.status(200).send();
});

scriptRouter.post("/startScript", (req: Request, res: Response) => {
  res.status(200).send();
});
