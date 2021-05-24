import { ISchema } from "./schema";

export interface IRealmAccount {
  siteID: string;
  username: string;
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export const RealmAccount: ISchema<IRealmAccount> = {
  name: "account",
  properties: {
    _id: "int",
    access_token: "string",
    expires_at: "number",
    refresh_token: "string",
    siteID: "string",
    username: "string",
  },
  primaryKey: "_id",
};
