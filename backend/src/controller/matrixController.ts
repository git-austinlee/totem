import { Gif, GifFrame, GifUtil } from "gifwrap";
import gm from "gm";
import path from "path";

import { matrix, realm } from "../index.js";
import { ImageItem } from "../models/ImageSchema.js";
import { matrixOptions } from "../models/matrixOptions.js";
import {
  getCurrentImage,
  nextImage,
  setCurrentByName,
} from "./imageController.js";

var running = false;
var loopInterval = null;
var currFrame: number = 0;
var frame: GifFrame | Buffer;
var newBuffer: Uint8Array;
var nextImageInterval = null;

function resetVars() {
  currFrame = 0;
  frame = null;
  newBuffer = null;
}

export async function startMatrix() {
  if (!running) {
    running = true;
    let current: ImageItem = getCurrentImage();
    matrix.clear();

    let gifData: any = await loadImageAndScale(current.path);

    nextImageInterval = setInterval(async () => {
      current = nextImage();
      if (current === undefined || current === null) {
        stopMatrix();
      }
      console.log(
        `showing image ${current.title} for ${current.duration} seconds`
      );
      gifData = await loadImageAndScale(current.path);
      resetVars();
    }, current.duration * 1000);

    loopInterval = setInterval(function () {
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
    }, 80);
  }
}

export function stopMatrix() {
  clearInterval(loopInterval);
  clearInterval(nextImageInterval);
  matrix.clear().brightness(0).sync();
  resetVars();
  running = false;
}

export function isPlaying() {
  return running;
}

function loadImageAndScale(p: string) {
  const exts = [".jpg", ".jpeg", ".png"]
  return new Promise((resolve, reject) => {
    gm(path)
      .resize(128, 96, "!")
      .toBuffer((err, buffer) => {
        let ext = path.extname(p);
        exts.forEach(element => {
          if (element === ext) resolve(buffer);
        });

        GifUtil.read(buffer)
          .then(function (imageGif) {
            console.log(`in loadImageAndScale then ${p}`);
            resolve(imageGif);
          })
          .catch((err) => {
            console.log(`in loadImageAndScale catch ${p}`);
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
  let interval: number;
  if (frame instanceof GifFrame) {
    height = frame.bitmap.height;
    width = frame.bitmap.width;
    newBuffer = new Uint8Array(width * 2 * height * 3);
    buf = frame.bitmap.data;
    interval = 4
  } else {
    height = matrixOptions.rows * 3;
    width = matrixOptions.cols * 2;
    newBuffer = new Uint8Array(width * 2 * height * 3);
    buf = frame;
    if (frame.length <= height * width * 3) {
      interval = 3;
    } else {
      interval = 4;
    }
  }

  let x = 0;
  let y = 0;
  let row = [];
  for (let bi = 0; bi < buf.length; bi += interval) {
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
