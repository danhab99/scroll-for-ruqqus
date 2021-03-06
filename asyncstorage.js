import * as RNFS from 'react-native-fs'
import uuid from 'react-native-uuid'
import isMatch from 'lodash.ismatch'

export class Value {
  static getValue(name) {
    let filename = `${RNFS.DocumentDirectoryPath}${name}`
    
    return RNFS.readFile(filename, 'utf8')
      .then(raw => JSON.parse(raw))
      .catch(e => {
        return this.setValue(name, null)
          .then(() => this.getValue(name))
      })
  }

  static setValue(name, data) {
    let filename = `${RNFS.DocumentDirectoryPath}${name}`
    return RNFS.writeFile(filename, JSON.stringify(data), 'utf8')
  }
}
export default class Collection {
  constructor(collection, triggerOnChange=true) {
    this.collection = collection
    this._trigger = triggerOnChange
  }

  _getItem() {
    return Value.getValue(this.collection)
  }

  _setItem(data) {
    return Value.setValue(this.collection, data).then(() => this._onChange())
  }

  _onChange() {
    this._changeHandler && this._changeHandler()
  }

  onChange(handler) {
    this._changeHandler = handler
    if (this._trigger) {
      this._onChange()
    }
  }

  create(item) {
    return this._getItem()
      .then(items => {
        let t = {
          _id: uuid.v1(),
          ...item
        }
        items = items || []
        items.push(t)

        return this._setItem(items).then(() => t)
      })
  }

  find(pattern={}) {
    return this._getItem()
      .then((items) => [].concat(items).filter(x => isMatch(x, pattern)))
  }

  findOne(pattern) {
    return this.find(pattern).then(d => d[0] || null)
  }

  findById(id) {
    return this.findOne({_id: id})
  }

  update(pattern, change) {
    return this.find(pattern)
      .then(items => {
        items = items.map(x => Object.assign(x, change))
        return this._getItem().then(original => Object.assign(original, items))
          .then(this._setItem)
      })
  }

  delete(pattern) {
    return this._getItem()
      .then(all => {
        let clensed = all.filter(i => !isMatch(i, pattern))
        return this._setItem(clensed)
      })
  }
}