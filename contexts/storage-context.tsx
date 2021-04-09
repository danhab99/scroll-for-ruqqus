import React, {createContext, useContext, useState, useEffect} from 'react';
import {ContextChildrenProps} from './ContextChildrenProps';
import {
  DocumentDirectoryPath,
  writeFile,
  readFile,
  readdir,
} from 'react-native-fs';
import * as _ from 'lodash';

type UnboundObject = {
  [key: string]: any;
};

interface ValueContextProps {
  value: UnboundObject;
  setValue: React.Dispatch<React.SetStateAction<UnboundObject>>;
}

const ValueContext = createContext<ValueContextProps>({
  value: {},
  setValue: (x) => {},
});

export function ValueProvider(props: ContextChildrenProps) {
  const [value, setValue] = useState<UnboundObject>({});

  const write = async () => {
    for (let [file, content] of Object.entries(value)) {
      await writeFile(
        `${DocumentDirectoryPath}/${file}.json`,
        JSON.stringify(content),
      );
    }
  };

  const read = async () => {
    let files = await readdir(DocumentDirectoryPath);
    let v: UnboundObject = {};
    for (const file of files) {
      let d = await readFile(file);
      let p = JSON.parse(d);
      v[file] = p;
    }

    setValue(v);
  };

  useEffect(() => {
    write();
  }, [value]);

  useEffect(() => {
    read();

    return () => {
      write();
    };
  }, []);

  return (
    <ValueContext.Provider value={{value, setValue}}>
      {props.children}
    </ValueContext.Provider>
  );
}

export function useSetValue<T>(...path: string[]) {
  const {value, setValue} = useContext(ValueContext);

  return (v: T) => {
    let o = _.set(value, path, v);
    setValue(o);
  };
}

export function useValue(...path: string[]) {
  const {value} = useContext(ValueContext);
  return _.get(value, path);
}
