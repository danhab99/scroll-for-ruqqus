import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { COLORS, FONTSIZE, SPACE } from './theme'
import { View, Text } from 'react-native'
import { IconButton } from './components'

import Feed from './views/feed'

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

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

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light"/>

      <Drawer.Navigator 
        initialRouteName="Home"
        drawerStyle={{
          backgroundColor: COLORS.backgroundHighlight
        }}
      >
        <Drawer.Screen name="Home" component={StackNavigator} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
