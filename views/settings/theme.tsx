import React from "react";
import { ScrollView } from "react-native";
import { useStyle } from "@contexts";
import { SettingsInput, SettingsSection } from "./settingsInput";

export function ThemeSettings() {
  const style = useStyle();

  return (
    <ScrollView style={style?.view}>
      <SettingsSection title="Colors">
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

        <SettingsInput
          title="Muted color"
          description="The color for minor texts"
          address={["theme", "Colors", "muted"]}
          type={{ type: "color" }}
          iconName="color-lens"
          default="#fff"
        />
      </SettingsSection>

      <SettingsSection title="Font">
        <SettingsInput
          title="Font family"
          description="What font to use"
          type={{ type: "choice", choices: ["Regular"] }}
          address={["theme", "Fonts", "body"]}
          iconName="font-download"
          default="Regular"
        />

        <SettingsInput
          iconName="format-size"
          title="Font size"
          description="Set the font size"
          address={["theme", "FontSize", "start"]}
          default={12}
          type={{ type: "number", min: 8, max: 20, steps: 1 }}
        />
      </SettingsSection>
    </ScrollView>
  );
}
