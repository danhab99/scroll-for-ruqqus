import React, { createContext, useContext } from "react";
import { useValue } from "./StorageContext";
import * as _ from "lodash";
import { ThemeInterface, DEFAULT_THEME } from "./theme/default-theme";
import { generateStyles, gen } from "./theme/style";
import { Styles } from "./theme/style";
import Color from "color";
export type ThemeValue = string | number;

export type ThemeContextType =
  | { theme: ThemeInterface; style?: Styles }
  | undefined;
const ThemeContext = createContext<ThemeContextType>(undefined);

const Darken = (c: string) =>
  Color(c)
    .darken(1 / 3)
    .hex();
const Lighten = (c: string) =>
  Color(c)
    .lighten(1 / 3)
    .hex();

export function ThemeProvider(props: React.PropsWithChildren<{}>) {
  var [theme] = useValue<ThemeInterface>("theme");
  theme = _.defaultsDeep(theme, DEFAULT_THEME);
  let style = theme ? generateStyles(theme) : undefined;

  const deepSet = (value: any, ...address: string[]) =>
    (theme = _.set(theme, address, value));

  deepSet(gen(theme?.Space?.start, theme?.Space?.step), "Space", "get");
  deepSet(
    gen(theme?.FontSize?.start, theme?.FontSize?.step),
    "FontSize",
    "get",
  );
  deepSet(Darken(theme.Colors.primary), "Colors", "primaryDark");
  deepSet(Lighten(theme.Colors.primary), "Colors", "primaryLight");
  deepSet(Darken(theme.Colors.background), "Colors", "backgroundDark");
  deepSet(Lighten(theme.Colors.background), "Colors", "backgroundHighlight");

  return (
    <ThemeContext.Provider value={{ theme, style }}>
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
