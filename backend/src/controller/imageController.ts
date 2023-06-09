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

export function updateImageBrightness(
  uuid: Realm.BSON.UUID,
  brightness: number
) {
  const image: ImageItem = realm.objectForPrimaryKey(ImageItem, uuid);
  if (image.isValid()) {
    realm.write(() => {
      image.brightness = brightness;
      console.log(
        `updated image ${uuid} ${image.title} brightness to ${brightness}`
      );
    });
    return image.toJSON();
  } else {
    console.log(`could not update image ${uuid} to brightness ${brightness}`);
    return 1;
  }
}

export function updateImageDuration(uuid: Realm.BSON.UUID, duration: number) {
  const image: ImageItem = realm.objectForPrimaryKey(ImageItem, uuid);
  if (image.isValid()) {
    realm.write(() => {
      image.duration = duration;
      console.log(
        `updated image ${uuid} ${image.title} duration to ${duration}`
      );
    });
    return image.toJSON();
  } else {
    console.log(`could not update image ${uuid} to duration ${duration}`);
    return 1;
  }
}

export function updateImageVisible(uuid: Realm.BSON.UUID, visible: boolean) {
  const image: ImageItem = realm.objectForPrimaryKey(ImageItem, uuid);
  if (image.isValid()) {
    realm.write(() => {
      image.visible = visible;
      console.log(`updated image ${uuid} ${image.title} visible to ${visible}`);
    });
    return image.toJSON();
  } else {
    console.log(`could not update image ${uuid} to visible ${visible}`);
    return 1;
  }
}

export function setCurrentImage(uuid: Realm.BSON.UUID) {
  const images = realm.objects(ImageItem);
  let curr: ImageItem;
  realm.write(() => {
    const prev = images.filtered("current == true");
    prev.forEach((image) => {
      image.current = false;
    });
    curr = realm.objectForPrimaryKey(ImageItem, uuid);
    curr.current = true;
  });
  return curr;
}

export function getCurrentImage() {
  const images = realm.objects(ImageItem);
  const query = images.filtered("current == true");
  if (query.isEmpty()) {
    const order = getOrder();
    const firstImage = realm.objectForPrimaryKey(ImageItem, order[0]);
    realm.write(() => {
      firstImage.current = true;
    });
    return firstImage;
  }
  return query[0];
}

export function setCurrentByName(name: string) {
  const images = realm.objects(ImageItem);
  const query = images.filtered("title CONTAINS $0", name);
  if (!query.isEmpty()) setCurrentImage(query[0]._id);
}

export function nextImage() {
  let curr = getCurrentImage();
  const order = getOrder();
  let currIndex = order.findIndex((uuid) => uuid.equals(curr._id));
  // loop to find the next visible image
  for (let i = 0; i < order.length; i++) {
    if (++currIndex >= order.length) currIndex = 0;
    let next = realm.objectForPrimaryKey(ImageItem, order[currIndex]);
    if (next.visible) {
      return setCurrentImage(next._id);
    }
  }
  return;
}
