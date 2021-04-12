import {
  DrawerActions,
  NavigationContainer,
  useNavigation,
} from '@react-navigation/native';
import {
  createStackNavigator,
  HeaderBackButton,
  StackHeaderTitleProps,
} from '@react-navigation/stack';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentOptions,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {View, Text} from 'react-native';
import {IconButton} from './components/Buttons';

import Feed from './views/feed';
import Comments from './views/comments';
import Submit from './views/submit';
import ROALogin from './views/roa_login';

import Collection from './asyncstorage';
import {ThemeContextType, useTheme} from './contexts/theme-context';
import {useStyle} from '@contexts';

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
        flexDirection: 'row',
        width: '100%',
      }}>
      <Text
        style={{
          color: theme?.Colors?.text,
          fontSize: theme?.FontSize?.get?.(2),
          fontWeight: 'bold',
        }}>
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
            name="bars"
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
          feed: 'front',
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
          feed: 'all',
        }}
      />
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

export default function App() {
  const theme = useTheme();
  const style = useStyle();

  return (
    <View>
      <View style={style?.root}>
        <StatusBar />
        <NavigationContainer>
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
            <Drawer.Screen name="Login" component={LoginStackNavigator} />
            <Drawer.Screen name="Submit" component={SubmitStackNavigator} />
          </Drawer.Navigator>
        </NavigationContainer>
      </View>
    </View>
  );
}
