/**
 * @format
 */

import React from "react";
import { AppRegistry } from "react-native";

import App from "./App";
import { name as appName } from "./app.json";
import { ValueProvider } from "./contexts/storage-context";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import { ThemeProvider } from "./contexts/theme-context";

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
