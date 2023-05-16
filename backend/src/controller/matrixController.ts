import { exec } from "child_process";
import gifFrames from "gif-frames";
import gm from "gm";
import * as fs from "node:fs";
import path from "path";
import toArray from "stream-to-array";
import util from "util";

import { matrix, realm } from "../index.js";
import { ImageItem } from "../models/ImageSchema.js";
import { matrixOptions } from "../models/matrixOptions.js";
import { resizeByAspectRatio, servicePath } from "../utils/utils.js";
import { getCurrentImage, updateCurrentImage } from "./imageController.js";

var running: boolean = false;
let interval = null;

export async function startMatrix() {
  let current: ImageItem = getCurrentImage();
  matrix.clear().brightness(current.brightness);
  gm(current.path)
    .selectFrame(1)
    .toBuffer(function (err: Error, buffer: Buffer) {
      matrix.afterSync(() => {
        matrix.drawBuffer(buffer);
        setTimeout(() => matrix.sync(), 17);
      });
    });
  matrix.sync();
}

export function stopMatrix() {
  matrix.clear().sync();
  running = false;
}

export function isPlaying() {
  return running;
}

function loop(current: ImageItem) {}
