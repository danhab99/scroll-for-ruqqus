import {
  DrawerActions,
  NavigationContainer,
  NavigationContainerRef,
  useNavigation,
} from "@react-navigation/native";
import {
  createStackNavigator,
  HeaderBackButton,
  StackHeaderTitleProps,
} from "@react-navigation/stack";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentOptions,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { StatusBar } from "expo-status-bar";
import React, { useRef } from "react";
import { View, Text } from "react-native";

import { IconButton } from "./components/Buttons";
import Feed from "./views/feed";
import Comments from "./views/comments";
import Submit from "./views/submit";
import ROALogin from "./views/roa_login";

import { useStyle, useTheme } from "@contexts";
import { Saved } from "./views/saved";
import { Settings } from "./views/settings/settings";
import { ThemeSettings } from "views/settings/theme";
import { GeneralSettings } from "./views/settings/general";
import { useRuqqusClient } from "./react-ruqqus/useRuqqusClient";
import { RuqqusClientProvider } from "@react-ruqqus";

type ChildrenOnly = {
  children: React.ReactNode;
};

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(
  props: DrawerContentComponentProps<DrawerContentOptions>,
) {
  const theme = useTheme();

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList
        activeTintColor="white"
        inactiveTintColor="lightgray"
        activeBackgroundColor={theme?.Colors?.primary}
        {...props}
      />
    </DrawerContentScrollView>
  );
}

function StackTitle(props: StackHeaderTitleProps) {
  const theme = useTheme();
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        width: "100%",
      }}>
      <Text
        style={{
          color: theme?.Colors?.text,
          fontSize: theme?.FontSize?.get?.(3),
          fontWeight: "bold",
        }}
        numberOfLines={1}
        ellipsizeMode="middle">
        {props.children}
      </Text>
    </View>
  );
}

function StackNavigator(props: ChildrenOnly) {
  const navigation = useNavigation();
  const theme = useTheme();

  const toggle = () => navigation.dispatch(DrawerActions.toggleDrawer());

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme?.Colors?.backgroundHighlight,
        },
        headerTitle: (ps) => <StackTitle {...ps} />,
        headerLeft: () => (
          <IconButton
            name="menu"
            onPress={() => toggle()}
            style={{
              marginLeft: theme?.Space.get?.(1) || 1,
            }}
          />
        ),
      }}>
      {props.children}
    </Stack.Navigator>
  );
}

function FrontpageStackNavigator(props: ChildrenOnly) {
  return (
    <StackNavigator {...props}>
      <Stack.Screen
        name="Frontpage"
        component={Feed}
        initialParams={{
          feed: "front",
        }}
      />
      <Stack.Screen name="Comments" component={Comments} />
    </StackNavigator>
  );
}

function AllStackNavigator(props: ChildrenOnly) {
  return (
    <StackNavigator {...props}>
      <Stack.Screen
        name="All"
        component={Feed}
        initialParams={{
          feed: "all",
        }}
      />
      <Stack.Screen name="Comments" component={Comments} />
    </StackNavigator>
  );
}

function UserStackNavigator(props: ChildrenOnly) {
  const client = useRuqqusClient();

  return (
    <StackNavigator {...props}>
      <Stack.Screen
        name="All"
        component={Feed}
        initialParams={{
          feed: { user: client.username || "" },
        }}
      />
      <Stack.Screen name="Comments" component={Comments} />
    </StackNavigator>
  );
}
1;
function SavedStackNavigator(props: ChildrenOnly) {
  return (
    <StackNavigator {...props}>
      <Stack.Screen name="Saved" component={Saved} />
      <Stack.Screen name="Comments" component={Comments} />
    </StackNavigator>
  );
}

function LoginStackNavigator(props: ChildrenOnly) {
  return (
    <StackNavigator {...props}>
      <Stack.Screen name="Login" component={ROALogin} />
    </StackNavigator>
  );
}

function SubmitStackNavigator(props: ChildrenOnly) {
  return (
    <StackNavigator {...props}>
      <Stack.Screen name="Submit" component={Submit} />
    </StackNavigator>
  );
}

function SettingsStackNavigator(props: ChildrenOnly) {
  return (
    <StackNavigator {...props}>
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="General Settings" component={GeneralSettings} />
      <Stack.Screen name="Theme Settings" component={ThemeSettings} />
    </StackNavigator>
  );
}

const RUQQUS_CLIENT_CONFIG = {
  domain: "ruqqus.com",
  authserver: "sfroa.danhab99.xyz",
};

export default function App() {
  const theme = useTheme();
  const style = useStyle();

  const navRef = useRef<NavigationContainerRef | null>();

  return (
    <RuqqusClientProvider
      config={RUQQUS_CLIENT_CONFIG}
      onLoginError={() => navRef.current?.navigate("Login")}>
      <View style={style?.root}>
        <StatusBar />
        <NavigationContainer ref={(r) => (navRef.current = r)}>
          <StatusBar style="light" />

          <Drawer.Navigator
            drawerStyle={{
              backgroundColor: theme?.Colors?.backgroundHighlight,
            }}
            drawerContent={(ps) => <CustomDrawerContent {...ps} />}>
            <Drawer.Screen
              name="Frontpage"
              component={FrontpageStackNavigator}
            />
            <Drawer.Screen name="All" component={AllStackNavigator} />
            <Drawer.Screen name="Saved" component={SavedStackNavigator} />
            <Drawer.Screen name="Me" component={UserStackNavigator} />
            <Drawer.Screen name="Login" component={LoginStackNavigator} />
            <Drawer.Screen name="Submit" component={SubmitStackNavigator} />
            <Drawer.Screen name="Settings" component={SettingsStackNavigator} />
          </Drawer.Navigator>
        </NavigationContainer>
      </View>
    </RuqqusClientProvider>
  );
}
