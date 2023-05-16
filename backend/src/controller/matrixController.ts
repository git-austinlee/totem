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

const m = gm.subClass({ imageMagick: "7+" });

export async function startMatrix() {
  let current: ImageItem = getCurrentImage();
  /*
  let current = {
    path: "C:\\Users\\austn\\Desktop\\Projects\\totem\\resources\\imgs\\spiderman.jpg",
  };*/
  //console.log(current.path);

  matrix.clear().brightness(current.brightness);

  gifFrames({ url: current.path, frames: "all" }).then(function (data) {
    console.log(`gif frames: ${data.length}`);
    for (let i = 0; i < data.length; i++) {
      streamToBuffer(data[i].getImage()).then(function (buffer: Buffer) {
        console.log(
          `buffer stats ${buffer.length} ${buffer.BYTES_PER_ELEMENT} ${buffer.byteLength} ${buffer.byteOffset}`
        );
        matrix.afterSync((mat, dt, t) => {
          matrix.drawBuffer(buffer);
          setTimeout(() => matrix.sync(), 0);
        });
        matrix.sync();
      });
    }
  });

  /*
  var frameCount = 0;
  try {
    console.time("gm");
    gm(current.path)
      .resize(128, 92, "!")
      .identify(function (err, value: any) {
        let frameCount;
        try {
          frameCount = value.Scene.length;
          console.log(`gm frames: ${value.Scene.length}`);
          console.timeEnd("gm");
        } catch {
          frameCount = 1;
          console.log(1);
        }
        console.time("gm buffer");
        for (let i = 0; i < frameCount; i++) {
          this.selectFrame(i).toBuffer(function (err: Error, buffer: Buffer) {
            console.log(`frame count ${frameCount}`);
            console.log(
              `buffer stats ${buffer.length} ${buffer.BYTES_PER_ELEMENT} ${buffer.byteLength} ${buffer.byteOffset}`
            );
            console.log(
              `buffer json stats ${Array.from(buffer.entries()).length}`
            );
            if (i === 38 - 1) {
              console.timeEnd("gm buffer");
            }
          });
        }
      });
      
  } catch (err) {
    console.log(`gm error ${err}`);
  }*/
}

export function stopMatrix() {
  matrix.clear().sync();
  running = false;
}

export function isPlaying() {
  return running;
}

function loadImageAndScale() {}

function copyImageToCanvas() {}

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
