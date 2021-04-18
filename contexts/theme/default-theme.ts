import { ThemeValue } from "../theme-context";
import Color from "color";

export type ThemeRange = {
  start: number;
  step: number;
  get?: (x: number) => number;
};

export interface ThemeInterface {
  Colors: {
    text: string;
    background: string;
    backgroundHighlight: string;
    backgroundDark: string;
    primary: string;
    primaryLight: string;
    primaryDark: string;
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

export const DEFAULT_THEME: ThemeInterface = {
  Colors: {
    text: "#fff",
    background: "#181818",
    backgroundHighlight: "#1f2023",
    backgroundDark: "#0f0f0f",
    primary: "#693ccd",
    muted: "#aaa",
    primaryDark: "#693ccd",
    primaryLight: "#693ccd",
  },
  Fonts: {
    body: "",
    heading: '"Avenir Next", sans-serif',
    monospace: "Menlo, monospace",
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
    body: "normal",
    caps: "0.2em",
  },
  FontWeight: {
    body: "normal",
    heading: 700,
    bold: 700,
  },
  LineHeight: {
    body: 1.5,
    heading: 1.125,
  },
};
