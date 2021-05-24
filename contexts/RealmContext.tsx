import React, { useState, useEffect, createContext, useContext } from "react";
import Realm from "realm";
import _ from "lodash";

import { RealmResult } from "./realm/schema";
import { IRealmAccount } from "./realm/account";
import { IRealmSettings } from "./realm/settings";
import { IRealmTheme } from "./realm/theme";

export type RealmSchemaNames = "theme" | "settings" | "account" | "post";
export type RealmSchemaInterfaces =
  | IRealmAccount
  | IRealmSettings
  | IRealmTheme;

const RealmContext = createContext<Realm>({} as Realm);

export function RealmContextProvider(props: React.PropsWithChildren<{}>) {
  const [realm, setRealm] = useState<Realm>();

  useEffect(() => {
    Realm.open({
      path: "realm",
      schema: [],
    }).then((r) => setRealm(r));
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
  query?: (obj: RealmResult<T>) => RealmResult<T>,
  dependencies: Array<any> = [],
) {
  const realm = useRealm();
  const [res, setRes] = useRealmState<T>();

  useEffect(() => {
    let o = realm.objects<T>(schema);
    setRes(query ? query(o) : o);
  }, [realm, schema, query, ...dependencies]);

  return res;
}

export function useCreator<T extends RealmSchemaInterfaces>(
  schema: RealmSchemaNames,
) {
  const realm = useRealm();

  return (newObj: T) => {
    return new Promise<T & Realm.Object>((resolve) => {
      realm.write(() => {
        let o = realm.create<T>(schema, newObj);
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
    const handler: Realm.CollectionChangeCallback<T & Realm.Object> = (
      prev,
      changes,
    ) => {
      let o = objs?.filtered(predicate);
      console.log("REALM FILTER", { schema, predicate, o });
      setRes(o);
    };

    handler(null, null);
    objs?.addListener(handler);

    return () => {
      objs?.removeListener(handler);
    };
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
      realm.delete(o);
    });
  };
}
