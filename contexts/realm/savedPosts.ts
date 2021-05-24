import { ISchema } from "./schema";
import { IRealmAccount } from "./account";

export interface IRealmSavedPost {
  postID: string;
  savedAt: number;
  // owner: IRealmAccount;
}

export const RealmSavedPost: ISchema<IRealmSavedPost> = {
  name: "saved",
  properties: {
    postID: "string",
    savedAt: "int",
    // owner: "account",
    _id: "string",
  },
  primaryKey: "_id",
};
