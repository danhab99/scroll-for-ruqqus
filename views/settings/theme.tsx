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
        address={["theme", "Colors", "primary"]}
        type={{ type: "color" }}
        iconName="color-lens"
        default="#693ccd"
      />
    </ScrollView>
  );
}
