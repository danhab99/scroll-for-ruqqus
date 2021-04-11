import React, {createContext, useContext} from 'react';
import {ContextChildrenProps} from './ContextChildrenProps';
import {useValue} from './storage-context';
import * as _ from 'lodash';
import {ThemeInterface, DEFAULT_THEME} from './theme/default-theme';
import {generateStyles, gen} from './theme/style';
import {Styles} from './theme/style';
export type ThemeValue = string | number;

export type ThemeContextType =
  | {theme: ThemeInterface; style?: Styles}
  | undefined;
const ThemeContext = createContext<ThemeContextType>(undefined);

export function ThemeProvider(props: ContextChildrenProps) {
  var [theme] = useValue<ThemeInterface>('theme');
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
