import axios from "axios";

import { localhost } from "../utils/utils";

export async function startMatrix() {
  const url = `${localhost}/matrix/start`;
  try {
    const response = await axios({
      method: "post",
      url: url,
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.log(error.message);
  }
}

export async function stopMatrix() {
  const url = `${localhost}/matrix/stop`;
  try {
    const response = await axios({
      method: "post",
      url: url,
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.log(error.message);
  }
}

export async function matrixStatus() {
  const url = `${localhost}/matrix/status`;
  try {
    const response = await axios({
      method: "get",
      url: url,
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.log(error.message);
  }
}
