import React, {useState, createContext, useEffect, useContext} from 'react';
import {StyleSheet, TextStyle, ViewStyle} from 'react-native';
import * as RNFS from 'react-native-fs';
import {ContextChildrenProps} from './ContextChildrenProps';
import {useSetValue, useValue} from './storage-context';
import * as _ from 'lodash';

type ThemeValue = string | number;

type ThemeRange = {
  start: number;
  step: number;
  get?: (x: number) => number;
};

interface ThemeInterface {
  Colors: {
    text: string;
    background: string;
    backgroundHighlight: string;
    backgroundDark: string;
    primary: string;
    muted: string;
  };
  LineHeight: {
    body: ThemeValue;
    heading: ThemeValue;
  };
  LetterSpace: {
    body: ThemeValue;
    caps: ThemeValue;
  };
  FontWeight: {
    body: ThemeValue;
    heading: ThemeValue;
    bold: ThemeValue;
  };
  Fonts: {
    body: string;
    heading: string;
    monospace: string;
  };
  Space: ThemeRange;
  FontSize: ThemeRange;
}

const DEFAULT_THEME: ThemeInterface = {
  Colors: {
    text: '#fff',
    background: '#181818',
    backgroundHighlight: '#1f2023',
    backgroundDark: '#0f0f0f',
    primary: '#693ccd',
    muted: '#aaa',
  },
  Fonts: {
    body: '',
    heading: '"Avenir Next", sans-serif',
    monospace: 'Menlo, monospace',
  },
  FontSize: {
    start: 12,
    step: 4,
  },
  Space: {
    start: 0,
    step: 14,
  },
  LetterSpace: {
    body: 'normal',
    caps: '0.2em',
  },
  FontWeight: {
    body: 'normal',
    heading: 700,
    bold: 700,
  },
  LineHeight: {
    body: 1.5,
    heading: 1.125,
  },
};

interface Styles {
  view: ViewStyle;
  horizontal: ViewStyle;
  bottomButtons: ViewStyle;
  input: TextStyle;
  inputLabel: TextStyle;
  card: ViewStyle;
  root: ViewStyle;
  iconButton: TextStyle;
}

export type ThemeContextType =
  | {theme?: ThemeInterface; style?: Styles}
  | undefined;
const ThemeContext = createContext<ThemeContextType>(undefined);

const gen = (start: number, skip: number) => (x: number) => start + x * skip;

function generateStyles(theme: ThemeInterface): Styles {
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

export function ThemeProvider(props: ContextChildrenProps) {
  var theme = useValue<ThemeInterface>('theme');
  theme = _.defaultsDeep(theme, DEFAULT_THEME);
  let style = theme ? generateStyles(theme) : undefined;

  theme = _.set(
    theme,
    ['Space', 'get'],
    gen(theme?.Space?.start, theme?.Space?.step),
  );
  theme = _.set(
    theme,
    ['FontSize', 'get'],
    gen(theme?.FontSize?.start, theme?.FontSize?.step),
  );

  return (
    <ThemeContext.Provider value={{theme, style}}>
      {props.children}
    </ThemeContext.Provider>
  );
}

type ThemeConsumerChildren = {
  children: (themeState: ThemeContextType) => Element;
};

export function ThemeConsumer(props: ThemeConsumerChildren) {
  return (
    <ThemeContext.Consumer>
      {(value) =>
        props.children({
          style: value?.style,
          theme: value?.theme,
        })
      }
    </ThemeContext.Consumer>
  );
}

export function useTheme() {
  const t = useContext(ThemeContext);
  return t?.theme;
}

export function useStyle() {
  const t = useContext(ThemeContext);
  return t?.style;
}
