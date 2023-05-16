import bodyParser from "body-parser";
import cors from "cors";
import express, { Express, Request, Response } from "express";
import http from "http";
import * as path from "path";
import Realm from "realm";
import { LedMatrix } from "rpi-led-matrix";

import { getCurrentImage } from "./controller/imageController.js";
import { startMatrix } from "./controller/matrixController.js";
import { ImageItem, ImageOrder } from "./models/ImageSchema.js";
import { matrixOptions, runtimeOptions } from "./models/matrixOptions.js";
import { imageRouter } from "./routes/imageRouter.js";
import { matrixRouter } from "./routes/matrixRouter.js";
import { imgsDir, initRealm, resizeByAspectRatio } from "./utils/utils.js";

const app: Express = express();
const port: number = 3000;

/*
 * Database
 */
export const realm = await Realm.open({
  schema: [ImageItem, ImageOrder],
  path: "./local.realm",
});
initRealm();

/*
 * Matrix
 */
export const matrix = null;
startMatrix();
//export const matrix = new LedMatrix(matrixOptions, runtimeOptions);

app.use(bodyParser.json());
app.use(express.urlencoded());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use("/matrix", matrixRouter);
app.use("/image", imageRouter);
app.use("/images", express.static(imgsDir));

app.listen(port, "0.0.0.0", () =>
  console.log(`listening on http://localhost:${port}`)
);
