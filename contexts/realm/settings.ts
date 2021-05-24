import { ISchema } from "./schema";

export interface IRealmSettings {}

export const RealmSettings: ISchema<IRealmSettings> = {
  name: "settings",
  properties: {},
};
