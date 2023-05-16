import gifFrames from "gif-frames";
import gm from "gm";
import * as fs from "node:fs";
import toArray from "stream-to-array";
import util from "util";

import { matrix, realm } from "../index.js";
import { ImageItem } from "../models/ImageSchema.js";
import { resizeByAspectRatio } from "../utils/utils.js";
import { getCurrentImage } from "./imageController.js";

var running: boolean = false;

export async function startMatrix() {
  let current: ImageItem = getCurrentImage();
  matrix.clear().brightness(current.brightness);
  gm(current.path).resize(128, 96);

  let frames_count = await gifFrames({ url: current.path, frames: "all" }).then(
    function (frameData) {
      let stream = frameData[0].getImage();
      let buffer: Buffer = toArray(stream).then(function (parts) {
        const buffers = parts.map((part) =>
          util.isBuffer(part) ? part : Buffer.from(part)
        );
        return Buffer.concat(buffers);
      });
      console.log(`buffer ${buffer.length}`);
      return frameData.length;
    }
  );
  running = true;
  let frame = 0;
  let interval = setInterval(function () {
    if (frame === frames_count) {
      clearInterval(interval);
    }
    gm(current.path)
      .selectFrame(frame++)
      .toBuffer(function (error, buffer) {
        if (error) {
          console.log(`gm toBuffer err: ${error}`);
        }
        console.log(`buffersize ${buffer.length}`);
        matrix.drawBuffer(buffer, 128, 96).sync();
      });
  }, 200);

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
