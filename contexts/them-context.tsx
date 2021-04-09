import React, {useState, createContext, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import * as RNFS from 'react-native-fs';

type ThemeValue = string | number;

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
  Space: {
    start: number;
    step: number;
  };
  FontSize: {
    start: number;
    step: number;
  };
}

type ThemeContextType =
  | {theme: ThemeInterface | undefined}
  | {style: Object | undefined}
  | undefined;
const ThemeContext = createContext<ThemeContextType>(undefined);
const ThemeSetterContext = createContext<
  React.Dispatch<React.SetStateAction<ThemeInterface | undefined>>
>((v) => {
  throw new Error();
});

interface ThemeProviderProps {
  children: React.ReactNode[];
  // theme: ThemeInterface;
}

const gen = (start: number, skip: number) => (x: number) => start + x * skip;

function generateStyles(theme: ThemeInterface) {
  const Space = gen(theme.Space.start, theme.Space.step);
  const FontSize = gen(theme.FontSize.start, theme?.FontSize.step);
  return StyleSheet.create({
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
  });
}

export function ThemeProvider(props: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeInterface | undefined>();
  const [style, setStyle] = useState<Object | undefined>();

  useEffect(() => {
    RNFS.readFile(RNFS.DocumentDirectoryPath + '/theme.json').then((raw) => {
      setTheme(JSON.parse(raw));
    });
  }, []);

  useEffect(() => {
    RNFS.writeFile(
      RNFS.DocumentDirectoryPath + '/theme.json',
      JSON.stringify(theme),
    );
  }, [theme]);

  if (theme) {
    let style = generateStyles(theme);
    setStyle(style);
  }

  return (
    <ThemeSetterContext.Provider value={setTheme}>
      <ThemeContext.Provider value={{theme, style}}>
        {props.children}
      </ThemeContext.Provider>
    </ThemeSetterContext.Provider>
  );
}
