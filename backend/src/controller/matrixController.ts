import gm from "gm";
import * as fs from "node:fs";

import { matrix, realm } from "../index.js";
import { ImageItem } from "../models/ImageSchema.js";
import { resizeByAspectRatio } from "../utils/utils.js";
import { getCurrentImage } from "./imageController.js";

var running: boolean = false;

export function startMatrix() {
  let current: ImageItem = getCurrentImage();
  matrix.clear().brightness(current.brightness);
  gm(current.path).identify(function (err, val) {
    console.log(val);
    console.log(JSON.stringify(val));
  });
  fs.readFile(current.path, (err, data) => {
    if (err) {
      console.log(`fs readfile err: ${err}`);
    }
    matrix.afterSync(() => {
      matrix.drawBuffer(data);
      setTimeout(() => matrix.sync(), 17);
    });
    matrix.sync();
    running = true;
  });
}

export function stopMatrix() {
  matrix.clear().sync();
  running = false;
}

export function isPlaying() {
  return running;
}

function loop(current: ImageItem) {}
