import * as RNFS from 'react-native-fs';
import uuid from 'react-native-uuid';
import isMatch from 'lodash.ismatch';

export class Value {
  static getValue(name: string): Promise<any> {
    let filename = `${RNFS.DocumentDirectoryPath}${name}`;

    return RNFS.readFile(filename, 'utf8')
      .then((raw) => JSON.parse(raw))
      .catch((e) => {
        return this.setValue(name, null).then(() => this.getValue(name));
      });
  }

  static setValue(name: string, data: any): Promise<void> {
    let filename = `${RNFS.DocumentDirectoryPath}${name}`;
    return RNFS.writeFile(filename, JSON.stringify(data), 'utf8');
  }
}

type ChangeHandler = (() => void) | undefined;
export default class Collection<T> {
  collection: string;
  _changeHandler: ChangeHandler;

  constructor(collection: string) {
    this.collection = collection;
    this._changeHandler = undefined;
  }

  _getItem() {
    return Value.getValue(this.collection);
  }

  _setItem(data: any) {
    return Value.setValue(this.collection, data).then(() => this._onChange());
  }

  _onChange() {
    this._changeHandler && this._changeHandler();
  }

  onChange(handler: ChangeHandler, trigger = false) {
    this._changeHandler = handler;
    if (trigger) {
      this._onChange();
    }
  }

  create(item: T): Promise<T> {
    return this._getItem().then((items: T[]) => {
      let t = {
        _id: uuid.v1(),
        ...item,
      };
      items = items || [];
      items.push(t);

      return this._setItem(items).then(() => t);
    });
  }

  find(pattern = {}): Promise<T[]> {
    return this._getItem().then((items: any) =>
      [].concat(items).filter((x) => isMatch(x, pattern)),
    );
  }

  findOne(pattern: Object) {
    return this.find(pattern).then((d) => d[0] || null);
  }

  findById(id: string) {
    return this.findOne({_id: id});
  }

  update(pattern: Object, change: T) {
    return this.find(pattern).then((items) => {
      items = items.map((x) => Object.assign(x, change));
      return this._getItem()
        .then((original: T[]) => Object.assign(original, items))
        .then(this._setItem);
    });
  }

  delete(pattern: Object) {
    return this._getItem().then((all: T[]) => {
      let clensed = all.filter((i: any) => !isMatch(i, pattern));
      return this._setItem(clensed);
    });
  }
}
