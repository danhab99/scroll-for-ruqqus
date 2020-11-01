import { StyleSheet } from 'react-native';
import Color from 'color'

const gen = (start, skip) => x => start + (x * skip)

export const COLORS = {
  text: '#fff',
  background: '#181818',
  backgroundHighlight: '#1f2023',
  primary: '#693ccd',
}

const ChangeVal = dir => (c, d=(1/3)) => Color(c)[dir](d).hex().toString()
export const Darken = ChangeVal('darken')
export const Lighten = ChangeVal('lighten')

export const FONTS = {
  body: '',
  heading: '"Avenir Next", sans-serif',
  monospace: 'Menlo, monospace',
}

export const FONTSIZE = gen(12, 4)

export const SPACE = gen(0, 14)

export const LINEHIGHT = {
  body: 1.5,
  heading: 1.125,
}

export const LETTERSPACING = {
  body: 'normal',
  caps: '0.2em',
}

export const FONTWEIGHT = {
  body: "normal",
  heading: 700,
  bold: 700
}

export const BODYTEXT = {
  color: COLORS.text,
  fontFamily: FONTS.body,
  fontWeight: FONTWEIGHT.body
}

const Style = StyleSheet.create({
  view: {
    padding: SPACE(1),
    backgroundColor: COLORS.background,
    height: '100%'
  }
})

export default Style