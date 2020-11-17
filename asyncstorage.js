import * as FileSystem from 'expo-file-system'
import uuid from 'react-native-uuid'
import isMatch from 'lodash.ismatch'

export default class Collection {
  constructor(collection, triggerOnChange=true) {
    this._filename = `${FileSystem.documentDirectory}${collection}`
    this._trigger = triggerOnChange
  }

  _getItem() {
    return FileSystem.readAsStringAsync(this._filename)
      .then(raw => {
        console.log('READ FROM FILE', this._filename, raw)
        return JSON.parse(raw)
      })
      .catch(e => {
        console.warn('FILE NOT FOUND, CREATING...', this._filename, e)
        return this._setItem([])
          .then(() => this._getItem())
      })
  }

  _setItem(data) {
    console.log('WRITING TO FILE', this._filename, data)
    return FileSystem.writeAsStringAsync(this._filename, JSON.stringify(data)).then(() => this._onChange())
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
        items.push({
          _id: uuid.v1(),
          ...item
        })

        return this._setItem(items)
      })
  }

  find(pattern={}) {
    return this._getItem()
      .then((items=[]) => items.filter(x => isMatch(x, pattern)))
  }

  findOne(pattern) {
    return this.find(pattern).then(d => d[0])
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