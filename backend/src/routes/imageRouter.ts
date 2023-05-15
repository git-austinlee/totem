import express, { Express, Request, Response } from "express";

import {
  getAllOrdered,
  getSingleImage,
  setOrder,
  updateImageBrightness,
  updateImageDuration,
  updateImageVisible,
} from "../controller/imageController.js";

export const imageRouter = express.Router();

imageRouter.get("/getAll", (req: Request, res: Response) => {
  /*
   *   Get all images ordered
   */
  let data = getAllOrdered();
  res.status(200).send(data);
});

imageRouter.get("/get/:id", (req: Request, res: Response) => {
  /*
   *   Get single image by uuid
   */
  const uuid = new Realm.BSON.UUID(req.params.id);
  const data = getSingleImage(uuid);
  res.status(200).send(data);
});

imageRouter.post("/setOrder", (req: Request, res: Response) => {
  /*
   *   Set the order in the realmdb
   */
  const newOrder = req.body.newOrder;
  setOrder(newOrder);
  res.status(200).send();
});

imageRouter.post("/update/duration/:id", (req: Request, res: Response) => {
  /*
   *   Update an image's duration property value
   */
  let uuid = new Realm.BSON.UUID(req.params.id);
  let result = updateImageDuration(uuid, req.body.duration);
  if (result === 1) {
    res.status(400).send({ message: `Image with id ${uuid} was not found` });
  } else {
    res.status(200).send(result);
  }
});

imageRouter.post("/update/brightness/:id", (req: Request, res: Response) => {
  /*
   *   Update an image's brightness property value
   */
  let uuid = new Realm.BSON.UUID(req.params.id);
  let result = updateImageBrightness(uuid, req.body.brightness);
  if (result === 1) {
    res.status(400).send({ message: `Image with id ${uuid} was not found` });
  } else {
    res.status(200).send(result);
  }
});

imageRouter.post("/update/visible/:id", (req: Request, res: Response) => {
  /*
   *   Update an image's visible property value
   */
  let uuid = new Realm.BSON.UUID(req.params.id);
  let result = updateImageVisible(uuid, req.body.visible);
  if (result === 1) {
    res.status(400).send({ message: `Image with id ${uuid} was not found` });
  } else {
    res.status(200).send(result);
  }
});
