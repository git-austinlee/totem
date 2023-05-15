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
  gm(current.path).identify(function (err, data: any) {
    this.resize(128, 96);
    let frames_count = data.Scene.length;
    for (let i = 0; i < frames_count; i++) {
      this.selectFrame(i).buffer(function (error, buffer) {
        if (error) {
          console.log(`fs readfile err: ${error}`);
        }
        matrix.afterSync(() => {
          matrix.drawBuffer(buffer);
          setTimeout(() => matrix.sync(), 17);
        });
        matrix.sync();
        running = true;
      });
    }
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
