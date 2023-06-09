import * as fs from "node:fs";
import path, { dirname } from "path";
import Realm from "realm";
import { fileURLToPath } from "url";

import { realm } from "../index.js";
import { ImageItem, ImageOrder } from "../models/ImageSchema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const imgsDir = path.join(__dirname, "../../../resources/imgs");
export const servicePath = path.join(
  __dirname,
  "../../../service/rpi-rgb-led-matrix/examples-api-use/image-example"
);

export function initRealm() {
  const images = realm.objects(ImageItem);
  const newOrder = [];
  // Search img dir for new images to populate
  fs.readdirSync(imgsDir).forEach((file) => {
    const match = images.filtered(`title == '${file}'`);
    if (match.length === 0) {
      let data = {
        _id: new Realm.BSON.UUID(),
        title: file,
        visible: true,
        duration: 10,
        brightness: 80,
        path: path.join(imgsDir, file),
        current: false,
      };
      newOrder.push(data._id);
      realm.write(() => {
        realm.create(ImageItem, data);
      });
    }
  });
  // Create img order if it doesn't exist
  realm.write(() => {
    const existingOrder = realm.objects(ImageOrder);
    if (existingOrder.isEmpty()) {
      realm.create(ImageOrder, { order: newOrder });
    }
  });
  // Create current img if it doesn't exist
  realm.write(() => {});
}
