import { StyleSheet, TextStyle, ViewStyle } from "react-native";
import { ThemeInterface } from "./default-theme";
import { useValue } from "@contexts";

export interface Styles {
  view: ViewStyle;
  horizontal: ViewStyle;
  bottomButtons: ViewStyle;
  input: TextStyle;
  inputLabel: TextStyle;
  card: ViewStyle;
  root: ViewStyle;
  headText: TextStyle;
  primaryHeadText: TextStyle;
  headBullet: TextStyle;
  title: TextStyle;
  upvotes: TextStyle;
  downvotes: TextStyle;
  controlrow: ViewStyle;
  settingsInput: ViewStyle;
  settingsPartition: ViewStyle;
}

export const gen = (start: number, skip: number) => (x: number) =>
  start + x * skip;

export function generateStyles(theme: ThemeInterface): Styles {
  const Space = gen(theme?.Space?.start, theme?.Space?.step);
  const FontSize = gen(theme?.FontSize?.start, theme?.FontSize?.step);
  const [rightHanded] = useValue<boolean>("general", "rightHanded");

  return StyleSheet.create<Styles>({
    view: {
      padding: Space(1),
      backgroundColor: theme.Colors.background,
      height: "100%",
    },
    horizontal: {
      flexDirection: "row",
      alignContent: "space-around",
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
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
      // padding: Space(1),
      borderRadius: 4,
    },
    root: {
      backgroundColor: theme.Colors.background,
      height: "100%",
    },
    headText: {
      color: theme.Colors.muted,
      fontSize: theme?.FontSize?.get?.(1),
    },
    primaryHeadText: {
      color: theme.Colors.primary,
      fontSize: theme?.FontSize?.get?.(1),
    },
    headBullet: {
      color: theme.Colors.text,
      fontSize: FontSize(1),
    },
    title: {
      fontSize: FontSize(2),
      color: theme.Colors.text,
    },
    upvotes: {
      fontSize: FontSize(1),
      color: theme.Colors.primaryLight,
    },
    downvotes: {
      fontSize: FontSize(1),
      color: theme.Colors.primaryDark,
    },
    controlrow: {
      flexDirection: (typeof rightHanded === "boolean" ? rightHanded : false)
        ? "row-reverse"
        : "row",
      alignContent: "space-around",
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "space-evenly",
    },
    settingsInput: {},
    settingsPartition: {},
  });
}
