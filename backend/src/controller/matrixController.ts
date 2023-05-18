import { GifFrame, GifUtil } from "gifwrap";
import gm from "gm";

import { matrix, realm } from "../index.js";
import { ImageItem } from "../models/ImageSchema.js";
import { matrixOptions } from "../models/matrixOptions.js";
import { getCurrentImage, nextImage } from "./imageController.js";

var running = false;
let interval = null;

export async function startMatrix() {
  running = true;
  let current: ImageItem = getCurrentImage();
  matrix.clear().brightness(current.brightness);
  let currFrame: number = 0;
  let startTime = performance.now();
  let gifData: any = await loadImageAndScale(current.path);

  interval = setInterval(async function () {
    if (performance.now() - startTime >= current.duration * 1000) {
      currFrame = 0;
      current = nextImage();
      gifData = await loadImageAndScale(current.path);
      startTime = performance.now();
    }
    if (gifData.frames.length > 1) ++currFrame;
    let frame = gifData.frames[currFrame];
    let newBuffer = removeAlpha(frame);
    matrix
      .drawBuffer(
        newBuffer,
        matrixOptions.cols * matrixOptions.chainLength,
        matrixOptions.rows * matrixOptions.parallel
      )
      .sync();
    if (currFrame >= gifData.frames.length) {
      currFrame = 0;
    }
  }, 50);
}

export function stopMatrix() {
  matrix.clear().brightness(0).sync();
  clearInterval(interval);
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
          .catch((err) => resolve(err));
      });
  });
}

function removeAlpha(frame: GifFrame) {
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
  return newBuffer;
}
