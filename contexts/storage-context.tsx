import React, {createContext, useContext, useState, useEffect} from 'react';
import {DocumentDirectoryPath, writeFile, readFile} from 'react-native-fs';

const ValueContext = createContext();

const ValuesFile = DocumentDirectoryPath + 'values.json';

export function ValueProvider(props) {
  const [value, setValue] = useState({});

  const write = () => {
    writeFile(ValuesFile, JSON.stringify(value));
  };

  useEffect(() => write(), [value]);

  useEffect(() => {
    readFile(ValuesFile, 'utf8')
      .then((raw) => JSON.parse(raw))
      .then((data) => setValue(data));

    return write;
  }, []);

  return (
    <ValueContext.Provider value={{value, setValue}}>
      {props.children}
    </ValueContext.Provider>
  );
}

export function useSetValue() {
  const sv = useContext(ValueContext).setValue;
  return (value, ...path) => sv({[path.join('.')]: value});
}

export function useValue(...path) {
  const v = useContext(ValueContext).value;
  return v[path.join('.')];
}
