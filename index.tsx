/**
 * @format
 */

import React from "react";
import { AppRegistry } from "react-native";

import App from "./App";
import { name as appName } from "./app.json";
import { ValueProvider } from "./contexts/storage-context";
import { RuqqusClientProvider } from "@react-ruqqus";
import { ThemeProvider } from "./contexts/theme-context";

const RUQQUS_CLIENT_CONFIG = {
  domain: "ruqqus.com",
  authserver: "sfroa.danhab99.xyz",
};

function ContextComposite() {
  return (
    <ValueProvider>
      <RuqqusClientProvider config={RUQQUS_CLIENT_CONFIG}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </RuqqusClientProvider>
    </ValueProvider>
  );
}

AppRegistry.registerComponent(appName, () => ContextComposite);
