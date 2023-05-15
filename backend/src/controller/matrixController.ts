import { spawn } from "child_process";
import * as ps from "ps-node";

import { matrix, realm } from "../index.js";
import { ImageItem } from "../models/ImageSchema.js";
import { resizeByAspectRatio } from "../utils/utils.js";
import { getCurrentImage } from "./imageController.js";

var running: boolean = false;

export function startMatrix() {
  let current: ImageItem = getCurrentImage();
  let image: any = resizeByAspectRatio(current.path);
  matrix.brightness(current.brightness).drawBuffer(image).sync();
  running = true;
}

export function stopMatrix() {
  matrix.sync();
  running = false;
}

export function isPlaying() {
  return running;
}

function loop(current: ImageItem) {}
