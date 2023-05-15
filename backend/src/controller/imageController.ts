import Realm from "realm";

import { realm } from "../index.js";
import { ImageItem, ImageOrder } from "../models/ImageSchema.js";

export function setOrder(newOrder: string[]) {
  let temp: Realm.BSON.UUID[] = [];
  newOrder.forEach((id: string) => {
    temp.push(new Realm.BSON.UUID(id));
  });
  const order = realm.objects(ImageOrder);
  realm.write(() => {
    order[0].order = temp;
  });
}

export function getOrder() {
  const order: Realm.Results<ImageOrder> = realm.objects(ImageOrder);
  return order[0].order;
}

export function getAll() {
  const images: Realm.Results<ImageItem> = realm.objects(ImageItem);
  let json = images.toJSON();
  json.forEach((image) => {
    delete image.path;
  });
  return json;
}

export function getAllOrdered() {
  const allImages = getAll();
  const order: any = getOrder();

  const itemPositions = {};
  for (const [index, _id] of order.entries()) {
    itemPositions[_id] = index;
  }
  allImages.sort(
    (a: any, b: any) => itemPositions[a._id] - itemPositions[b._id]
  );
  return allImages;
}

export function getSingleImage(uuid: Realm.BSON.UUID) {
  const image: ImageItem = realm.objectForPrimaryKey(ImageItem, uuid);
  return image.toJSON();
}

export function updateImage(uuid: Realm.BSON.UUID, params: Object) {
  const image: ImageItem = realm.objectForPrimaryKey(ImageItem, uuid);
  if (image) {
    realm.write(() => {
      for (const [key, value] of Object.entries(params)) {
        if (key === "brightness") {
          image.brightness = value;
          console.log(
            `updated image ${uuid} ${image.title} brightness to ${value}`
          );
        } else if (key == "duration") {
          image.duration = value;
          console.log(
            `updated image ${uuid} ${image.title} duration to ${value}`
          );
        } else if (key == "visible") {
          image.visible = value;
          console.log(
            `updated image ${uuid} ${image.title} visible to ${value}`
          );
        }
      }
    });
    return image.toJSON();
  }
  return 1;
}
