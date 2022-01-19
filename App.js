import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Home} from './App/Initial';
import {Camera} from './App/Camera';

const Stack = createNativeStackNavigator();

export default function App() {
  const Routes = [
    {
      name: 'Home',
      screen: Home,
      navigationOptions: {
        headerShown: false,
      },
    },
    {
      name: 'Camera',
      screen: Camera,
      navigationOptions: {
        headerShown: false,
      },
    },
  ];

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="InitialScreen"
        screenOptions={({route, navigation, theme}) => ({
          headerShown: true,
          cardOverlayEnabled: true,
          headerBackTitleVisible: false,
          presentation: 'card',
        })}>
        {Routes.map(route => {
          return (
            <Stack.Screen
              name={route.name}
              component={route.screen}
              key={route.name}
              options={route.navigationOptions || {}}
            />
          );
        })}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
