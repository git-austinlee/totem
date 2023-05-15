import Realm from "realm";

export class ImageItem extends Realm.Object<ImageItem> {
  _id!: Realm.BSON.UUID;
  title!: string;
  visible!: boolean;
  duration!: number;
  brightness!: number;
  path!: string;
  current!: boolean;

  static primaryKey = "_id";

  public static schema: Realm.ObjectSchema = {
    name: "ImageItem",
    primaryKey: "_id",
    properties: {
      _id: "uuid",
      title: "string",
      visible: "bool",
      duration: "int",
      brightness: "int",
      path: "string",
      current: "bool",
    },
  };
}

export class ImageOrder extends Realm.Object<ImageOrder> {
  order: Array<Realm.BSON.UUID>;

  public static schema: Realm.ObjectSchema = {
    name: "ImageOrder",
    properties: {
      order: {
        type: "list",
        objectType: "uuid",
        optional: false,
      },
    },
  };
}
