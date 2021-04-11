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

const ValueContext = createContext<ValueContextProps>({} as ValueContextProps);

export function ValueProvider(props: ContextChildrenProps) {
  const [value, setValue] = useState<UnboundObject>({});

  const write = () => {
    console.log('VALUE WRITE', value);
    Object.entries(value).forEach(([file, content]) =>
      writeFile(
        `${DocumentDirectoryPath}/vars/${file}.json`,
        JSON.stringify(content),
      ),
    );
  };

  const read = () => {
    readdir(DocumentDirectoryPath)
      .then((files: string[]) => files.filter((x) => x.includes('json')))
      .then((files: string[]) => {
        console.log('VALUE READ', files);
        return Promise.all(
          files.map((file) =>
            readFile(DocumentDirectoryPath + '/vars/' + file).then((data) => ({
              file,
              data: JSON.parse(data),
            })),
          ),
        );
      })
      .then((files: {file: string; data: any}[]) => {
        console.log('VALUE READ FILES', files);
        let o = files.reduce(
          (prev, curr) =>
            Object.assign(prev, {[curr.file.slice(0, -5)]: curr.data}),
          {},
        );

        setValue(o);
      });
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

type ValueSetter<T> = (prev: T) => T | T;

export function useValue<T>(
  ...path: string[]
): [T, (incoming: ValueSetter<T>) => void] {
  const {value, setValue} = useContext(ValueContext);
  const getV = _.get(value, path, {});

  const setV = (incoming: ValueSetter<T>) => {
    let next =
      typeof incoming === 'function'
        ? incoming(_.get(value, path) as T)
        : incoming;
    let o = _.set(value, path, next);
    o = Object.assign({}, o);
    setValue(o);
  };

  return [getV, setV];
}
