import React, { useState, useEffect } from "react";
import Slider from "@react-native-community/slider";
import { View, ViewStyle } from "react-native";
import Color from "color";
import Input from "./Input";
import { useTheme } from "@contexts";

interface ColorSliderProps {
  initialColor: string;
  onColorChange: (color: string) => void;
  style?: ViewStyle;
}

export function ColorPicker(props: ColorSliderProps) {
  const theme = useTheme();

  var initialColor;
  try {
    initialColor = Color(props.initialColor);
  } catch (e) {
    initialColor = Color([200, 200, 200]);
  }

  const [red, setRed] = useState(initialColor.red());
  const [green, setGreen] = useState(initialColor.green());
  const [blue, setBlue] = useState(initialColor.blue());
  const [hexValue, setHexValue] = useState("");

  useEffect(() => {
    try {
      var c = Color({ r: red, g: green, b: blue });
      let h = c.hex().toString();
      setHexValue(h);
      props.onColorChange(h);
    } catch (e) {}
  }, [red, green, blue]);

  return (
    <View style={props.style}>
      <View
        style={{
          backgroundColor: `rgb(${red}, ${green}, ${blue})`,
          width: "100%",
          height: 70,
        }}></View>

      <View>
        <Input
          label="hex"
          onChangeText={(t) => setHexValue(t)}
          value={hexValue}
        />

        <Slider
          value={red}
          onValueChange={(e) => setRed(e)}
          minimumValue={0}
          maximumValue={255}
          minimumTrackTintColor="#f00"
          style={{ marginBottom: theme?.Space.get?.(1) }}
          step={1}
        />

        <Slider
          value={green}
          onValueChange={(e) => setGreen(e)}
          minimumValue={0}
          maximumValue={255}
          minimumTrackTintColor="#0f0"
          style={{ marginBottom: theme?.Space.get?.(1) }}
          step={1}
        />

        <Slider
          value={blue}
          onValueChange={(e) => setBlue(e)}
          minimumValue={0}
          maximumValue={255}
          minimumTrackTintColor="#00f"
          style={{ marginBottom: theme?.Space.get?.(1) }}
          step={1}
        />
      </View>
    </View>
  );
}
