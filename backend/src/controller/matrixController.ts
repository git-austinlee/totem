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
  let frames_count = 0;
  gm(current.path)
    .resize(128, 96)
    .identify(function (err, data: any) {
      frames_count = data.Scene.length;
      console.log(`frames_count ${frames_count}`);
    });
  for (let i = 0; i < frames_count; i++) {
    console.log(`on frame ${i}`);
    gm(current.path)
      .selectFrame(i)
      .toBuffer(function (error, buffer) {
        if (error) {
          console.log(`gm toBuffer err: ${error}`);
        }
        matrix.afterSync(() => {
          matrix.drawBuffer(buffer);
          setTimeout(() => matrix.sync(), 50);
        });
        matrix.sync();
        running = true;
      });
  }
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
