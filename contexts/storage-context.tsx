import React, { createContext, useContext, useState, useEffect } from "react";
import { ContextChildrenProps } from "./ContextChildrenProps";
import {
  DocumentDirectoryPath,
  writeFile,
  readFile,
  unlink,
} from "react-native-fs";
import * as _ from "lodash";

type UnboundObject = {
  [key: string]: any;
};

interface ValueContextProps {
  value: UnboundObject;
  setValue: React.Dispatch<React.SetStateAction<UnboundObject>>;
}

const ValueContext = createContext<ValueContextProps>({} as ValueContextProps);

const ValuesFile = DocumentDirectoryPath + "/values.json";

export function ValueProvider(props: ContextChildrenProps) {
  const [value, setValue] = useState<UnboundObject>({});

  const write = () => {
    console.log("VALUE WRITE", value);
    writeFile(ValuesFile, JSON.stringify(value), "utf8");
  };

  const read = () => {
    readFile(ValuesFile, "utf8").then((raw) => {
      try {
        let p = JSON.parse(raw);
        console.log("VALUE READ", p);
        setValue(p);
      } catch (e) {
        unlink(ValuesFile);
        console.error("values.json broken", e, raw);
      }
    });
  };

  useEffect(() => {
    if (!_.isEmpty(value)) {
      write();
    }
  }, [value]);

  useEffect(() => {
    read();

    return () => {
      write();
    };
  }, []);

  return (
    <ValueContext.Provider value={{ value, setValue }}>
      {props.children}
    </ValueContext.Provider>
  );
}

type ValueSetter<T> = T & ((prev: T) => T);

export function useValue<T>(
  ...path: string[]
): [T, (incoming: ValueSetter<T>) => void] {
  const { value, setValue } = useContext(ValueContext);

  const getV = _.get(value, path, {});

  const setV = (incoming: ValueSetter<T>) => {
    let next =
      typeof incoming === "function"
        ? incoming(_.get(value, path) as T)
        : incoming;

    let o = _.set(value, path, next);
    o = Object.assign({}, o);
    setValue(o);
  };

  return [getV, setV];
}
