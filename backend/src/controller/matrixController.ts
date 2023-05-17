import { exec } from "child_process";
import gifFrames from "gif-frames";
import { Gif, GifFrame, GifUtil } from "gifwrap";
import gm from "gm";
import * as fs from "node:fs";
import path from "path";
import toArray from "stream-to-array";
import util from "util";

import { matrix, realm } from "../index.js";
import { ImageItem } from "../models/ImageSchema.js";
import { matrixOptions } from "../models/matrixOptions.js";
import { resizeByAspectRatio, servicePath } from "../utils/utils.js";
import {
  getCurrentImage,
  setCurrentByName,
  updateCurrentImage,
} from "./imageController.js";

var running: boolean = false;
let interval = null;

export async function startMatrix() {
  setCurrentByName("dance-mario");
  let current: ImageItem = getCurrentImage();
  console.log(current.path);
  matrix.clear().brightness(current.brightness);
  const gifData: any = await loadImageAndScale(current.path);
  let currFrame = 0;
  interval = setInterval(function () {
    const frame = gifData.frames[currFrame++];
    const newBuffer = removeAlpha(frame);
    matrix.drawBuffer(newBuffer, 128 * 2, 94).sync();
    if (currFrame >= gifData.frames.length) {
      currFrame = 0;
    }
  }, 50);
}

export function stopMatrix() {
  matrix.clear().sync();
  running = false;
}

export function isPlaying() {
  return running;
}

async function loadImageAndScale(path: string) {
  return new Promise((resolve, reject) => {
    gm(path)
      .resize(128, 92, "!")
      .toBuffer((err, buffer) => {
        if (err) reject(err);
        GifUtil.read(buffer)
          .then(function (imageGif) {
            resolve(imageGif);
          })
          .catch((err) => reject(err));
      });
  });
}

function removeAlpha(frame: GifFrame) {
  console.time("removeAlpha");
  const height = frame.bitmap.height;
  const width = frame.bitmap.width;
  const newBuffer = new Uint8Array(width * 2 * height * 3);

  let x = 0;
  let y = 0;
  let row = [];
  let buf = frame.bitmap.data;
  for (let bi = 0; bi < buf.length; bi += 4) {
    const r = buf[bi];
    const g = buf[bi + 1];
    const b = buf[bi + 2];
    row.push(r, g, b);
    if (++x === width) {
      row.push.apply(row, row);
      newBuffer.set(row, y * row.length);
      x = 0;
      ++y;
      row = [];
    }
  }
  console.timeEnd("removeAlpha");
  return newBuffer;
}

function copyImageToCanvas(frame: GifFrame) {}

function showAnimatedImage() {}

function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    stream.on("data", (chunk) => {
      chunks.push(chunk);
    });

    stream.on("end", () => {
      const buffer = Buffer.concat(chunks);
      resolve(buffer);
    });

    stream.on("error", (error) => {
      reject(error);
    });
  });
}
