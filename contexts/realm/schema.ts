import { RealmSchemaNames } from "contexts/RealmContext";

export type ISchema<T extends Object> = {
  name: RealmSchemaNames;
  properties: Record<keyof T, string | Object> & { _id: "int" };
  primaryKey: "_id";
};

export type RealmResult<T> = Realm.Results<T & Realm.Object>;
