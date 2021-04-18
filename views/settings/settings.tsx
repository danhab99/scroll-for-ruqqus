import React from "react";
import { ScrollView, Text } from "react-native";
import { useValue, useTheme, useStyle } from "@contexts";
import { SettingsInput, SettingsSection } from "./settingsInput";

export function Settings() {
  const style = useStyle();

  return (
    <ScrollView style={style?.view}>
      <SettingsInput
        iconName="apps"
        title="General"
        description="General options about the user interface"
        address={[]}
        default=""
        type={{
          type: "navigate",
          screen: "General Settings",
        }}
      />

      <SettingsInput
        iconName="edit"
        title="Theme"
        description="Colors and fonts"
        address={[]}
        default=""
        type={{
          type: "navigate",
          screen: "Theme Settings",
        }}
      />
    </ScrollView>
  );
}
