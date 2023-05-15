import { spawn } from "child_process";
import * as fs from "node:fs";
import * as ps from "ps-node";

import { matrix, realm } from "../index.js";
import { ImageItem } from "../models/ImageSchema.js";
import { resizeByAspectRatio } from "../utils/utils.js";
import { getCurrentImage } from "./imageController.js";

var running: boolean = false;

export function startMatrix() {
  matrix.clear().brightness(50).fgColor(0x0000ff).afterSync.sync();
  /*
  let current: ImageItem = getCurrentImage();
  resizeByAspectRatio(current.path);
  fs.readFile(current.path, (err, data) => {
    if (err) {
      console.log(`fs readfile err: ${err}`);
    }
    matrix.brightness(current.brightness).drawBuffer(data).sync();
    running = true;
  });
  */
}

export function stopMatrix() {
  matrix.sync();
  running = false;
}

export function isPlaying() {
  return running;
}

function loop(current: ImageItem) {}
