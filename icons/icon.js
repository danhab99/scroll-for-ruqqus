import React from 'react'

import Add from './add-black-24dp.svg'
import ArrowDown from './arrow_downward-black-24dp.svg'
import ArrowUp from './arrow_upward-black-24dp.svg'
import Block from './block-black-24dp.svg'
import Flag from './flag-black-24dp.svg'
import Comment from './insert_comment-black-24dp.svg'
import Menu from './menu-black-24dp.svg'
import MoreVert from './more_vert-black-24dp.svg'
import OpenInBrowser from './open_in_browser-black-24dp.svg'
import Person from './person-black-24dp.svg'
import Refresh from './refresh-black-24dp.svg'
import Save from './save-black-24dp.svg'
import Search from './search-black-24dp.svg'
import Share from './share-black-24dp.svg'
import Sort from './sort-black-24dp.svg'
import Close from './close-black-24dp.svg'
import Delete from './delete-black-24dp.svg'

const ICONMAP = {
  'menu': Menu,
  'refresh': Refresh,
  'sort': Sort,
  'search': Search,
  'arrow-upward': ArrowUp,
  'arrow-downward': ArrowDown,
  'save': Save,
  'comment': Comment,
  'more-vert': MoreVert,
  'close': Close,
  'share': Share,
  'person': Person,
  'add': Add,
  'open-in-browser': OpenInBrowser,
  'flag': Flag,
  'block': Block,
  'delete': Delete
}

const DEFAULTSIZE = 28

export default function Icon(props) {
  var ThisIcon = ICONMAP[props.name]

  if (!ThisIcon) {
    throw new Error(`${props.name} is not an existing icon`)
  }

  return <ThisIcon 
    width={props.size || DEFAULTSIZE} 
    height={props.size || DEFAULTSIZE}
    fill={props.color}
  />
}