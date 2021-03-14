import React from 'react'
import { COLORS } from '../../theme'

export default function Delimiter(props) {
  return (<View>
    <Text style={{
      color: COLORS.text,
      marginRight: SPACE(0.5),
      marginLeft: SPACE(0.5)
    }}>
      •
    </Text>
  </View>)
}