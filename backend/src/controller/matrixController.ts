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

const m = gm.subClass({ imageMagick: "7+" });

export async function startMatrix() {
  setCurrentByName("dance-mario");
  let current: ImageItem = getCurrentImage();
  /*
  let current = {
    path: "C:\\Users\\austn\\Desktop\\Projects\\totem\\resources\\imgs\\dance-mario.gif",
    brightness: 80,
  };
  */
  console.log(current.path);
  matrix.clear().brightness(current.brightness);
  const gifData: any = await loadImageAndScale(current.path);
  matrix.afterSync((mat, dt, t) => {
    gifData.frames.forEach((frame) => {
      const newBuffer = removeAlpha(frame);
      matrix.drawBuffer(newBuffer);
    });
    setTimeout(() => matrix.sync(), 20);
  });
  matrix.sync();

  /*
  console.log("gifframes");
  let frameCount = await gifFrames({
    url: current.path,
    frames: "all",
    cumulative: true,
  }).then(function (data) {
    console.log(`gif frames: ${data.length}`);
    for (let i = 0; i < data.length; i++) {
      streamToBuffer(data[i].getImage()).then(function (buffer: Buffer) {
        console.log(
          `buffer stats ${buffer.length} ${buffer.BYTES_PER_ELEMENT} ${buffer.byteLength} ${buffer.byteOffset}`
        );
      });
    }
  });
  //console.log(`frames: ${frameCount}`);

  /*
  console.time("gm");
  let frameCount = await gm(current.path).identify(function (err, value: any) {
    let frameCount;
    try {
      return value.Scene.length;
      console.log(`gm frames: ${value.Scene.length}`);
      console.timeEnd("gm");
    } catch {
      frameCount = 1;
      console.log(1);
    }
  }).Scene.length;
 
  console.time("gm buffer");
  for (let i = 0; i < frameCount; i++) {
    gm(current.path)
      .selectFrame(i)
      .out("+matte", "-coalesce", "-layers", "optimize")
      .toBuffer(function (err: Error, buffer: Buffer) {
        console.log(
          `buffer stats ${buffer.length} ${buffer.BYTES_PER_ELEMENT} ${buffer.byteLength} ${buffer.byteOffset}`
        );
        console.log(`buffer json stats ${Array.from(buffer.entries()).length}`);
        if (i === 38 - 1) {
          console.timeEnd("gm buffer");
        }
      });
  }
  */
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
  const newBuffer = new Uint8Array(width * height * 3);

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
