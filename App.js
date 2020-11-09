import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import Style, { COLORS, FONTSIZE, SPACE } from './theme'
import { View, Text } from 'react-native'
import { IconButton } from './components'
import AsyncStorage from '@react-native-async-storage/async-storage'

import Feed from './views/feed'
import Login from './views/login';

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
      <IconButton 
        icon="menu" 
        fontsize={4} 
        onPress={() => props.navigation.toggleDrawer()}
      />
      <Text style={{
        color: COLORS.text,
        fontSize: FONTSIZE(2),
        fontWeight: 'bold',
        marginLeft: SPACE(1)
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
        headerTitle: ps => <StackTitle {...ps} navigation={props.navigation} />
      }}
    >
      <Stack.Screen
        name="Home"
        component={Feed}
      />
    </Stack.Navigator>
  )
}

export default class App extends React.Component {
  componentDidMount() {
    // AsyncStorage.clear()
    AsyncStorage.getAllKeys((err, keys) => {
      if (err) {
        console.error('ASYNC STORAGE ERROR', err)
      }
      else {
        keys.forEach(key => {
          AsyncStorage.getItem(key, (err, value) => {
            console.log('ASYNC STORAGE', key, value || err)
          })
        })
      }
    })
  }

  render() {
    return (
      <View style={Style.root}>
        <StatusBar />
        <NavigationContainer>
          <StatusBar style="light"/>
    
          <Drawer.Navigator 
            initialRouteName="Home"
            drawerStyle={{
              backgroundColor: COLORS.backgroundHighlight,
            }}
            drawerContent={ps => <CustomDrawerContent {...ps} />}
          >
            <Drawer.Screen name="Home" component={StackNavigator} />
            <Drawer.Screen name="Login" component={Login} />
          </Drawer.Navigator>
        </NavigationContainer>
      </View>
    );
  }
}
