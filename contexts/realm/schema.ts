import { RealmSchemas } from "contexts/RealmContext";

export type ISchema<T extends Object> = {
  name: RealmSchemas;
  properties: Record<keyof T, string | Object> & { _id: "int" };
  primaryKey: "_id";
};

export type RealmResult<T> = Realm.Results<T & Realm.Object>;
