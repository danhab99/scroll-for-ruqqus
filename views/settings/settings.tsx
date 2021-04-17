import React from "react";
import { View, Text } from "react-native";
import { useValue, useTheme, useStyle } from "@contexts";
import { SettingsInput } from "./settingsInput";

export function Settings() {
  const style = useStyle();

  return (
    <View style={style?.view}>
      <SettingsInput
        title="Right handed mode"
        description="Switch the order or horizontal elements"
        iconName="switch-right"
        default={false}
        address={["general", "rightHanded"]}
        type={{ type: "checkbox" }}
      />

      <SettingsInput
        title="Primary color"
        address={["general", "primaryColor"]}
        type={{ type: "color" }}
        iconName="color-lens"
        default="#693ccd"
      />

      <SettingsInput
        title="Example choice"
        address={["test", "choice"]}
        type={{
          type: "choice",
          choices: ["option1", "option2", "option3"],
        }}
        default="option1"
        iconName="menu"
        description="Test choice"
      />
    </View>
  );
}
