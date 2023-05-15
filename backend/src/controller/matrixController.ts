import { spawn } from "child_process";
import * as ps from "ps-node";

import { matrix } from "../index.js";

const platform: string = process.platform;
let py: string = platform === "win32" ? "py" : "python3";
const path: string = "/home/diet-pi/totem/service";
const scriptName: string = ""; //TODO

export function isScriptRunning() {
  /*
   *  Checks if script is running in background
   *  Returns pid if true
   *  Returns -1 if not
   */
  let pid: number = -1;
  ps.lookup({ command: py }, function (err, resultList) {
    if (err) console.error(err);

    resultList.forEach((process) => {
      if (process) pid = process.pid;
    });
  });
  return pid;
}

export function startScript() {
  let pid = isScriptRunning();
  if (pid !== -1) {
    const python = spawn(py, [`${path}/${scriptName}`]);
  }
}

export function stopScript() {
  let pid = isScriptRunning();
  if (pid === -1) {
    ps.kill(pid, function (err) {
      if (err) console.error(err);
    });
  }
}

export async function runScript() {}
