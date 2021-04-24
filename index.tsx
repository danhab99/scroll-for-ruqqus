/**
 * @format
 */

import React from "react";
import { AppRegistry } from "react-native";

import App from "./App";
import { name as appName } from "./app.json";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import { ValueProvider, ThemeProvider } from "@contexts";

function ContextComposite() {
  return (
    <ValueProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ValueProvider>
  );
}

AppRegistry.registerComponent(appName, () =>
  gestureHandlerRootHOC(ContextComposite),
);
