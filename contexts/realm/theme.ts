import { ISchema } from "./schema";

export type ThemeValue = string | number;

export type ThemeRange = {
  start: number;
  step: number;
  get?: (x: number) => number;
};

export interface IRealmTheme {
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

export const RealmTheme: ISchema<IRealmTheme> = {
  name: "theme",
  properties: {
    Colors: {
      background: "string",
      backgroundDark: "string",
      backgroundHighlight: "string",
      muted: "string",
      primary: "string",
      primaryDark: "string",
      primaryLight: "string",
    },
    FontSize: {
      start: "int",
      step: "int",
    },
    FontWeight: {
      body: "string",
      heading: "string",
    },
    Fonts: {
      body: "string",
      heading: "string",
      monospace: "string",
    },
    Space: {
      start: "number",
      step: "number",
    },
    LetterSpace: {
      body: "number",
      caps: "number",
    },
    LineHeight: {
      body: "number",
      heading: "number",
    },
    _id: "int",
  },
  primaryKey: "_id",
};
