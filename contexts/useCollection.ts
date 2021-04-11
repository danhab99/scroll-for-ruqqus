import {useState, useEffect} from 'react';
import {
  DocumentDirectoryPath,
  CachesDirectoryPath,
  readFile,
  writeFile,
} from 'react-native-fs';
import * as _ from 'lodash';

interface ColletcionOpts<T> {
  initial?: T[];
  take?: number;
}

type CollectionHooks<T> = [
  T[],
  {
    add: (next: T[]) => void;
    nextPage: (page?: number) => void;
    remove: (predicate: (x: T) => boolean) => void;
  },
];

const MAX_COUNT = 1e5;

const useMassStore = (head: string) => <T>(
  name: string,
  opts?: ColletcionOpts<T>,
): CollectionHooks<T> => {
  const [collection, setCollection] = useState(opts?.initial);
  const [page, setPage] = useState(0);

  const read = () => {
    let take = opts?.take || 100;
    let start = page * take;
    let filei = Math.floor(start / MAX_COUNT);

    readFile(`${head}/col/${name}.${filei}.json`).then((raw) => {
      let j = JSON.parse(raw);
      let l: T[] = _.slice(j, start, start + take);

      setCollection((prev) => (page > 0 ? prev?.concat(l) : l));
    });
  };

  const write = () => {
    let chunks = _.chunk(collection, MAX_COUNT);
    chunks.forEach((chunk, i) => {
      writeFile(`${head}/col/${name}.${i}.json`, JSON.stringify(chunk));
    });
  };

  useEffect(() => {
    write();
  }, [collection]);

  useEffect(() => {
    read();
  }, [page]);

  useEffect(() => {
    read();
    return () => {
      write();
    };
  }, []);

  return [
    collection || [],
    {
      add: (next: T[] | T) =>
        setCollection((prev) => {
          let a = Array.isArray(next) ? next : [next];
          return prev ? prev.concat(a) : a;
        }),
      nextPage: (page?: number) => setPage(page ? page : (x) => x + 1),
      remove: (predicate: (x: T) => boolean) =>
        setCollection((prev) => prev?.filter(predicate)),
    },
  ];
};

export const useCollection = useMassStore(DocumentDirectoryPath);
export const useCache = useMassStore(CachesDirectoryPath);
