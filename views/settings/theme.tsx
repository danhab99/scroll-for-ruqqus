import React from "react";
import { ScrollView } from "react-native";
import { useStyle } from "@contexts";
import { SettingsInput } from "./settingsInput";

export function ThemeSettings() {
  const style = useStyle();

  return (
    <ScrollView style={style?.view}>
      <SettingsInput
        title="Primary color"
        description="The color for important things"
        address={["theme", "Colors", "primary"]}
        type={{ type: "color" }}
        iconName="color-lens"
        default="#693ccd"
      />

      <SettingsInput
        title="Text color"
        description="Any text's color"
        address={["theme", "Colors", "text"]}
        type={{ type: "color" }}
        iconName="color-lens"
        default="#fff"
      />

      <SettingsInput
        title="Background color"
        description="The color of the backdrop"
        address={["theme", "Colors", "background"]}
        type={{ type: "color" }}
        iconName="color-lens"
        default="#fff"
      />
    </ScrollView>
  );
}
