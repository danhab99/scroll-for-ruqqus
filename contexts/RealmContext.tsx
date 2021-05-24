import React, { useState, useEffect, createContext, useContext } from "react";
import Realm from "realm";
import _ from "lodash";

import { ISchema, RealmResult } from "./realm/schema";
import { IRealmAccount, RealmAccount } from "./realm/account";
import { IRealmSettings, RealmSettings } from "./realm/settings";
import { IRealmTheme, RealmTheme } from "./realm/theme";
import { IRealmSavedPost, RealmSavedPost } from "./realm/savedPosts";
import uuid from "react-native-uuid";

export type RealmSchemaNames = "theme" | "settings" | "account" | "saved";
export type RealmSchemaInterfaces =
  | IRealmAccount
  | IRealmSettings
  | IRealmTheme
  | IRealmSavedPost;

const RealmContext = createContext<Realm>({} as Realm);

export function RealmContextProvider(props: React.PropsWithChildren<{}>) {
  const [realm, setRealm] = useState<Realm>();

  useEffect(() => {
    Realm.open({
      path: "realm",
      schema: [RealmSavedPost, RealmAccount],
    }).then((r) => {
      setRealm(r);
    });
  }, []);

  if (realm) {
    return (
      <RealmContext.Provider value={realm}>
        {props.children}
      </RealmContext.Provider>
    );
  } else {
    return <></>;
  }
}

export function useRealm() {
  return useContext(RealmContext);
}

function useRealmState<T>() {
  return useState<RealmResult<T>>();
}

export function useGetter<T extends RealmSchemaInterfaces>(
  schema: RealmSchemaNames,
  postProcess?: (obj: RealmResult<T>) => RealmResult<T>,
  dependencies: Array<any> = [],
) {
  const realm = useRealm();
  const [res, setRes] = useRealmState<T>();

  useEffect(() => {
    let o = realm.objects<T>(schema);

    const handler: Realm.CollectionChangeCallback<T & Realm.Object> = (
      prev,
      change,
    ) => {
      let objs = realm.objects<T>(schema);
      console.log("REALM GET", { schema, objs });
      setRes(postProcess ? postProcess(objs) : objs);
    };

    handler(o, undefined);

    o.addListener(handler);
    return () => {
      o.removeListener(handler);
    };
  }, [realm, schema, ...dependencies]);

  return res;
}

export function useCreator<T extends RealmSchemaInterfaces>(
  schema: RealmSchemaNames,
) {
  const realm = useRealm();

  return (newObj: T) => {
    return new Promise<T & Realm.Object>((resolve) => {
      realm.write(() => {
        let o = realm.create<T>(schema, {
          _id: uuid.v4(),
          ...newObj,
        });
        console.log("REALM CREATE", { schema, newObj, o });
        resolve(o);
      });
    });
  };
}

export function useFilter<T extends RealmSchemaInterfaces>(
  schema: RealmSchemaNames,
  predicate: string,
) {
  const objs = useGetter<T>(schema);
  const [res, setRes] = useRealmState<T>();

  useEffect(() => {
    setRes(objs?.filtered(predicate));
  }, [objs, predicate]);

  return res;
}

export function useModifier<T extends RealmSchemaInterfaces>(
  schema: RealmSchemaNames,
) {
  const realm = useRealm();
  const objs = useGetter<T>(schema);

  return (predicate: string, inject: Partial<T>) => {
    realm.write(() => {
      let f = objs?.filtered(predicate);
      console.log("REALM MODIFY", { schema, predicate, inject, f });
      f?.forEach((x) => _.defaultsDeep(x, inject));
    });
  };
}

export function useDestroyer<T extends RealmSchemaInterfaces>(
  schema: RealmSchemaNames,
) {
  const realm = useRealm();
  const objs = useGetter<T>(schema);

  return (predicate: string) => {
    realm.write(() => {
      const o = objs?.filtered(predicate);
      console.log("REALM DESTROY", { schema, predicate, o });
      realm.delete(o);
    });
  };
}
