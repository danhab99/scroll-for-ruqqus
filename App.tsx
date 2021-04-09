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
import {
  ThemeConsumer,
  ThemeContextType,
  ThemeProvider,
} from './contexts/theme-context';
import {ValueProvider} from './contexts/storage-context';

type ChildrenOnly = {
  children: React.ReactNode;
};

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(
  props: DrawerContentComponentProps<DrawerContentOptions>,
) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList
        activeTintColor="white"
        inactiveTintColor="lightgray"
        activeBackgroundColor={COLORS.primary}
        {...props}
      />
    </DrawerContentScrollView>
  );
}

function StackTitle(props: StackHeaderTitleProps) {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        width: '100%',
      }}>
      <Text
        style={{
          color: COLORS.text,
          fontSize: FONTSIZE(2),
          fontWeight: 'bold',
        }}>
        {props.children}
      </Text>
    </View>
  );
}

function StackNavigator(props: ChildrenOnly) {
  const navigation = useNavigation();

  const toggle = () => navigation.dispatch(DrawerActions.toggleDrawer());

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.backgroundHighlight,
        },
        headerTitle: (ps) => <StackTitle {...ps} />,
        headerLeft: () => (
          <IconButton
            icon="menu"
            fontSize={4}
            onPress={() => toggle()}
            style={{
              marginLeft: SPACE(1),
            }}
          />
        ),
      }}>
      {props.children}
    </Stack.Navigator>
  );
}

function FeedStackNavigator(props: ChildrenOnly) {
  return (
    <StackNavigator {...props}>
      <Stack.Screen
        name="Frontpage"
        component={Feed}
        initialParams={{
          fetch: (client, options) =>
            client.feeds.frontpage(options.page, options.sort),
        }}
      />

      <Stack.Screen
        name="All"
        component={Feed}
        initialParams={{
          fetch: (client, options) => {
            debugger;
            return client.feeds.all(options.page, options.sort);
          },
          name: 'All',
        }}
      />

      <Stack.Screen
        name="Guild"
        component={Feed}
        initialParams={{
          fetch: (client, options) =>
            client.feeds.guild(options.name, options.page, options.sort),
          prefix: '+',
          guildHeader: true,
        }}
      />

      <Stack.Screen
        name="Comments"
        component={Comments}
        initialParams={{
          fetch: (client, options) =>
            client.feeds.guild(options.name, options.page, options.sort),
        }}
      />

      <Stack.Screen
        name="User"
        component={Feed}
        initialParams={{
          fetch: (client, options) =>
            client.feeds.user(options.name, options.page, options.sort),
          prefix: '@',
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

function SavedStackNavigator(props: ChildrenOnly) {
  return (
    <StackNavigator {...props}>
      <Stack.Screen
        name="Saved"
        component={Feed}
        initialParams={{
          fetch: (client, options) => {
            const PAGESIZE = 5;
            options.page--;
            var saved = new Collection('saved');
            return saved
              .find({})
              .then((items) =>
                Promise.all(
                  items
                    .sort((f, l) => (f.savedat < l.savedat ? 1 : -1))
                    .slice(
                      options.page * PAGESIZE,
                      options.page * PAGESIZE + PAGESIZE,
                    )
                    .map((item) => client.posts.fetch(item.pid)),
                ),
              )
              .then((posts) => {
                console.log('SAVED POSTS', posts);
                return {posts};
              });
          },
          prefix: '',
          name: 'Saved',
        }}
      />
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

export default function App(props: ChildrenOnly) {
  return (
    <ThemeProvider>
      <ValueProvider>
      <ThemeConsumer>
        {(themeState: ThemeContextType) => (
          <View style={themeState?.style?.root}>
      <StatusBar />
      <NavigationContainer>
        <StatusBar style="light" />

        <Drawer.Navigator
          drawerStyle={{
            backgroundColor: COLORS.backgroundHighlight,
          }}
          drawerContent={(ps) => <CustomDrawerContent {...ps} />}>
          <Drawer.Screen name="Frontpage" component={FeedStackNavigator} />
          <Drawer.Screen name="All" component={FeedStackNavigator} />
          <Drawer.Screen name="Login" component={LoginStackNavigator} />
          <Drawer.Screen name="Saved" component={SavedStackNavigator} />
          <Drawer.Screen name="Submit" component={SubmitStackNavigator} />
        </Drawer.Navigator>
      </NavigationContainer>
    </View>
        )}
      </ThemeConsumer>
      </ValueProvider>
    </ThemeProvider>
  );
}
