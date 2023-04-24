import React from 'react';
import Search from './components/screens/search.js'
import Player from './components/screens/player.js'
import { NavigationContainer,DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';

const Stack = createNativeStackNavigator();

function App() {
  const scheme = useColorScheme();
  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator>
        <Stack.Screen name="Search" component={Search} options={{headerShown:false}} />
        <Stack.Screen name="Player" component={Player} options={{presentation:"modal"}} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;