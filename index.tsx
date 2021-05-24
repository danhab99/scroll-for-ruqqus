/**
 * @format
 */

import React from "react";
import { AppRegistry } from "react-native";

import App from "./App";
import { name as appName } from "./app.json";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import { ValueProvider, ThemeProvider, RealmContextProvider } from "@contexts";

function ContextComposite() {
  return (
    <ValueProvider>
      <ThemeProvider>
        <RealmContextProvider>
          <App />
        </RealmContextProvider>
      </ThemeProvider>
    </ValueProvider>
  );
}

AppRegistry.registerComponent(appName, () =>
  gestureHandlerRootHOC(ContextComposite),
);
