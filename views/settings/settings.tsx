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
    </View>
  );
}
