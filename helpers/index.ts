import mongoose from "mongoose";

export type Id =
  | string
  | number
  | Uint8Array
  | mongoose.mongo.BSON.ObjectId
  | mongoose.mongo.BSON.ObjectIdLike;

export const isValidID = (id: Id): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};
