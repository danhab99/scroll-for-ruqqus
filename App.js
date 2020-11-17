import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import Style, { COLORS, FONTSIZE, SPACE } from './theme'
import { View, Text } from 'react-native'
import { IconButton } from './components/Buttons'

import Feed from './views/feed'
import Login from './views/login';
import Comments from './views/comments'
import Submit from './views/submit'

import Collection from './asyncstorage';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList 
        activeTintColor="white"
        inactiveTintColor="lightgray"
        activeBackgroundColor={COLORS.primary}
        {...props} 
      />
    </DrawerContentScrollView>
  )
}

function StackTitle(props) {
  return (
    <View style={{ 
      flex: 1, 
      flexDirection: 'row',
      width: '100%'
    }}>
      <Text style={{
        color: COLORS.text,
        fontSize: FONTSIZE(2),
        fontWeight: 'bold',
      }}>
        {props.children}
      </Text>    
    </View>
  )
}

function StackNavigator(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.backgroundHighlight
        },
        headerTitle: ps => <StackTitle {...ps}/>,
        headerLeft: () => (<IconButton 
          icon="menu" 
          fontsize={4} 
          onPress={() => props.navigation.toggleDrawer()}
          style={{
            marginLeft: SPACE(1)
          }}
        />)
      }}
    >
      {props.children}
    </Stack.Navigator>
  )
}

function FeedStackNavigator(props) {
  return (<StackNavigator {...props}>
    <Stack.Screen
      name="Frontpage"
      component={Feed}
      initialParams={{
        fetch: (client, options) => client.feeds.frontpage(options.page, options.sort)
      }}
    />

    <Stack.Screen
      name="All"
      component={Feed}
      initialParams={{
        fetch: (client, options) => {
          debugger
          return client.feeds.all(options.page, options.sort)
        },
        name: "All"
      }}
    />

    <Stack.Screen
      name="Guild"
      component={Feed}
      initialParams={{
        fetch: (client, options) => client.feeds.guild(options.name, options.page, options.sort),
        prefix: '+',
        guildHeader: true
      }}
    />

    <Stack.Screen
      name="Comments"
      component={Comments}
      initialParams={{
        fetch: (client, options) => client.feeds.guild(options.name, options.page, options.sort)
      }}
    />

    <Stack.Screen
      name="User"
      component={Feed}
      initialParams={{
        fetch: (client, options) => client.feeds.user(options.name, options.page, options.sort),
        prefix: '@'
      }}
    />
  </StackNavigator>)
}

function LoginStackNavigator(props) {
  return (<StackNavigator {...props}>
    <Stack.Screen
      name="Login"
      component={Login}
    />
  </StackNavigator>)
}

function SavedStackNavigator(props) {
  return (<StackNavigator {...props}>
    <Stack.Screen
      name="Saved" 
      component={Feed} 
      initialParams={{
        fetch: (client, options) => {
          if (options.page > 1) {
            return {posts: []}
          }
          else {
            var saved = new Collection('saved')
            return saved.find({})
              .then(items => Promise.all(items.map(item => client.posts.fetch(item.pid))))
              .then(posts => {
                console.log('SAVED POSTS', posts)
                return {posts}
              })
          }
        },
        prefix: '',
        name: "Saved"
      }}
    />
  </StackNavigator>)
}

function SubmitStackNavigator(props) {
  return <StackNavigator {...props}>
    <Stack.Screen
      name="Submit"
      component={Submit}
    />
  </StackNavigator>
}

export default class App extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {

  }

  render() {
    return (
      <View style={Style.root}>
        <StatusBar />
        <NavigationContainer>
          <StatusBar style="light"/>
    
          <Drawer.Navigator 
            // initialRouteName="Home"
            drawerStyle={{
              backgroundColor: COLORS.backgroundHighlight,
            }}
            drawerContent={ps => <CustomDrawerContent {...ps} />}
          >
            <Drawer.Screen name="Frontpage" component={FeedStackNavigator} />
            <Drawer.Screen name="All" component={FeedStackNavigator} />
            <Drawer.Screen name="Login" component={LoginStackNavigator} />
            <Drawer.Screen name="Saved" component={SavedStackNavigator} />
            <Drawer.Screen name="Submit" component={SubmitStackNavigator} />
          </Drawer.Navigator>
        </NavigationContainer>
      </View>
    );
  }
}
