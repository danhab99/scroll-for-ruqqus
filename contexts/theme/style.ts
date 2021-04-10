import {StyleSheet, TextStyle, ViewStyle} from 'react-native';
import {ThemeInterface} from './default-theme';

export type ThemeRange = {
  start: number;
  step: number;
  get?: (x: number) => number;
};

export interface Styles {
  view: ViewStyle;
  horizontal: ViewStyle;
  bottomButtons: ViewStyle;
  input: TextStyle;
  inputLabel: TextStyle;
  card: ViewStyle;
  root: ViewStyle;
  iconButton: TextStyle;
}

export const gen = (start: number, skip: number) => (x: number) =>
  start + x * skip;

export function generateStyles(theme: ThemeInterface): Styles {
  const Space = gen(theme?.Space?.start, theme?.Space?.step);
  const FontSize = gen(theme?.FontSize?.start, theme?.FontSize?.step);

  return StyleSheet.create<Styles>({
    view: {
      padding: Space(1),
      backgroundColor: theme.Colors.background,
      height: '100%',
    },
    horizontal: {
      flexDirection: 'row',
      alignContent: 'space-around',
      display: 'flex',
      flexWrap: 'wrap',
    },
    bottomButtons: {
      marginTop: Space(0.3),
      marginBottom: Space(0.3),
    },
    input: {
      borderBottomColor: theme.Colors.primary,
      borderBottomWidth: 2,
      color: theme.Colors.text,
      fontSize: FontSize(1.5),
    },
    inputLabel: {
      color: theme.Colors.muted,
      marginTop: Space(1),
    },
    card: {
      backgroundColor: theme.Colors.backgroundHighlight,
      padding: Space(1),
      borderRadius: 4,
    },
    root: {
      backgroundColor: theme.Colors.background,
      height: '100%',
    },
    iconButton: {
      backgroundColor: theme.Colors.background,
    },
  });
}
