import { Gif, GifFrame, GifUtil } from "gifwrap";
import gm from "gm";

import { matrix, realm } from "../index.js";
import { ImageItem } from "../models/ImageSchema.js";
import { matrixOptions } from "../models/matrixOptions.js";
import {
  getCurrentImage,
  nextImage,
  setCurrentByName,
} from "./imageController.js";

var running = false;
var interval = null;
var currFrame: number = 0;
var frame: GifFrame | Buffer;
var newBuffer: Uint8Array;

function resetVars() {
  currFrame = 0;
  frame = null;
  newBuffer = null;
}

export async function startMatrix() {
  running = true;
  let current: ImageItem = getCurrentImage();
  matrix.clear();

  let gifData: any = await loadImageAndScale(current.path);

  let t0 = Date.now();

  interval = setInterval(async function () {
    await run(t0, current, gifData);
  }, 80);
}

export function stopMatrix() {
  clearInterval(interval);
  resetVars();
  matrix.clear().brightness(0).sync();
  running = false;
}

export function isPlaying() {
  return running;
}

function loadImageAndScale(path: string) {
  return new Promise((resolve, reject) => {
    gm(path)
      .resize(128, 96, "!")
      .toBuffer((err, buffer) => {
        GifUtil.read(buffer)
          .then(function (imageGif) {
            resolve(imageGif);
          })
          .catch((err) => {
            resolve(buffer);
          });
      });
  });
}

function removeAlpha(frame: GifFrame | Buffer) {
  let height: number;
  let width: number;
  let newBuffer: Uint8Array;
  let buf: Buffer;
  if (frame instanceof GifFrame) {
    height = frame.bitmap.height;
    width = frame.bitmap.width;
    newBuffer = new Uint8Array(width * 2 * height * 3);
    buf = frame.bitmap.data;
  } else {
    height = matrixOptions.rows * 3;
    width = matrixOptions.cols * 2;
    newBuffer = new Uint8Array(width * 2 * height * 3);
    buf = frame;
  }

  let x = 0;
  let y = 0;
  let row = [];
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

async function run(startTime, current, gifData) {
  let t1 = Date.now();
  if ((t1 - startTime) / 1000 > current.duration) {
    resetVars();
    current = nextImage();
    if (current == null) {
      stopMatrix();
      return;
    }
    console.log(
      `showing image ${current.title} for ${current.duration} seconds`
    );
    gifData = await loadImageAndScale(current.path);
    startTime = Date.now();
  }

  if (gifData instanceof Gif) {
    frame = gifData.frames[currFrame++];
    if (currFrame >= gifData.frames.length) {
      currFrame = 0;
    }
    newBuffer = removeAlpha(frame);
  } else {
    frame = gifData;
    if (newBuffer == null) {
      newBuffer = removeAlpha(frame);
    }
  }

  try {
    matrix
      .brightness(current.brightness)
      .drawBuffer(
        newBuffer,
        matrixOptions.cols * matrixOptions.chainLength,
        matrixOptions.rows * matrixOptions.parallel
      )
      .sync();
  } catch {
    (err) => console.log(err);
  }
}
