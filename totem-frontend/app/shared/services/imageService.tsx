import axios from "axios";

import { localhost } from "../utils/utils";

/*
 *   Get image properties without the ArrayBuffer
 */
export async function getImageList() {
  const url = `${localhost}/image/getAll`;
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

export async function updateImageOptions(
  imageId: string,
  duration?: number,
  visible?: boolean,
  brightness?: number
) {
  const url = `${localhost}/image/update/${imageId}`;

  try {
    const response = await axios.post(
      url,
      {
        duration: duration,
        visible: visible,
        brightness: brightness,
      },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getImageOrder() {
  const url = `${localhost}/image/getOrder`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function setImageOrder(arr: string[]) {
  const url = `${localhost}/image/setOrder`;

  try {
    const response = await axios({
      method: "post",
      url: url,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        newOrder: arr,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.log(error.message);
  }
}
