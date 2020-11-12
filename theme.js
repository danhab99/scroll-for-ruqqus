import { StyleSheet } from 'react-native';
import Color from 'color'

const gen = (start, skip) => x => start + (x * skip)

export const COLORS = {
  text: '#fff',
  background: '#181818',
  backgroundHighlight: '#1f2023',
  backgroundDark: '#0f0f0f',
  primary: '#693ccd',
  muted: '#aaa'
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
  },
  horizontal: {
    flexDirection: 'row',
    alignContent: 'space-around',
    display: "flex",
    flexWrap: 'wrap'
  },
  bottomButtons: {
    marginTop: SPACE(0.3),
    marginBottom: SPACE(0.3),
  },
  input: {
    borderBottomColor: COLORS.primary,
    borderBottomWidth: 2,
    color: COLORS.text,
    fontSize: FONTSIZE(1.5)
  },
  inputLabel: {
    color: COLORS.muted,
    marginTop: SPACE(1)
  },
  card: {
    backgroundColor: COLORS.backgroundHighlight,
    padding: SPACE(1),
    borderRadius: 4,
  },
  root: {
    backgroundColor: COLORS.background,
    height: '100%'
  }
})

export const MarkdownStyle = StyleSheet.create({
  p: {
    color: COLORS.text,
    fontSize: FONTSIZE(1),
    marginBottom: SPACE(1/3)
  },
  a: {
    color: COLORS.primary,
    fontSize: FONTSIZE(1)
  },
  ul: {
    marginRight: SPACE(1/4),
    color: COLORS.primary
  },
  li: {
    color: COLORS.text,
    fontSize: FONTSIZE(1),
  }
})

export default Style