import React from "react";
import { ScrollView } from "react-native";
import { useStyle } from "@contexts";
import { SettingsInput } from "./settingsInput";

export function GeneralSettings() {
  const style = useStyle();

  return (
    <ScrollView style={style?.view}>
      <SettingsInput
        title="Card style"
        description="Pick which card gets used"
        iconName="filter-none"
        default="Default"
        address={["general", "cardStyle"]}
        type={{
          type: "choice",
          choices: ["Default", "Ruqques-like", "RuqES-like"],
        }}
      />

      <SettingsInput
        title="Right handed mode"
        description="Switch the order or horizontal elements"
        iconName="switch-right"
        default={false}
        address={["general", "rightHanded"]}
        type={{ type: "checkbox" }}
      />

      <SettingsInput
        title="Comments view warning"
        description="Show that appology for using the webapp for comments"
        iconName="chat"
        default={true}
        address={["general", "appologise"]}
        type={{ type: "checkbox" }}
      />
    </ScrollView>
  );
}
