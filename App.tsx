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
import { View, Text, ToastAndroid } from "react-native";

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

function StackNavigator(props: React.PropsWithChildren<{}>) {
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

function CommentedStackNavigator(props: React.PropsWithChildren<{}>) {
  return (
    <StackNavigator {...props}>
      {props.children}
      <Stack.Screen name="Comments" component={Comments} />
    </StackNavigator>
  );
}

function FrontpageStackNavigator(props: React.PropsWithChildren<{}>) {
  return (
    <CommentedStackNavigator {...props}>
      <Stack.Screen
        name="Frontpage"
        component={Feed}
        initialParams={{
          feed: "front",
        }}
      />
    </CommentedStackNavigator>
  );
}

function AllStackNavigator(props: React.PropsWithChildren<{}>) {
  return (
    <CommentedStackNavigator {...props}>
      <Stack.Screen
        name="All"
        component={Feed}
        initialParams={{
          feed: "all",
        }}
      />
    </CommentedStackNavigator>
  );
}

function UserStackNavigator(props: React.PropsWithChildren<{}>) {
  const client = useRuqqusClient();

  return (
    <CommentedStackNavigator {...props}>
      <Stack.Screen
        name="All"
        component={Feed}
        initialParams={{
          feed: { user: client.username || "" },
        }}
      />
    </CommentedStackNavigator>
  );
}

function SavedStackNavigator(props: React.PropsWithChildren<{}>) {
  return (
    <CommentedStackNavigator {...props}>
      <Stack.Screen name="Saved" component={Saved} />
    </CommentedStackNavigator>
  );
}

function LoginStackNavigator(props: React.PropsWithChildren<{}>) {
  return (
    <CommentedStackNavigator {...props}>
      <Stack.Screen name="Login" component={ROALogin} />
    </CommentedStackNavigator>
  );
}

function SubmitStackNavigator(props: React.PropsWithChildren<{}>) {
  return (
    <CommentedStackNavigator {...props}>
      <Stack.Screen name="Submit" component={Submit} />
    </CommentedStackNavigator>
  );
}

function SettingsStackNavigator(props: React.PropsWithChildren<{}>) {
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

  const apiError = (e: Error) => {
    if (e.message.includes("login") || e.message.includes("No tokens")) {
      navRef.current?.navigate("Login");
    } else {
      ToastAndroid.show("API ERROR: " + e.message, ToastAndroid.LONG);
    }
  };

  return (
    <RuqqusClientProvider config={RUQQUS_CLIENT_CONFIG} onApiError={apiError}>
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
