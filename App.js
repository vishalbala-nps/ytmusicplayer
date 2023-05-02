import React from 'react';
import Home from './components/screens/home.js'
import Player from './components/screens/player.js'
import { NavigationContainer,DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';
import { LogBox } from 'react-native';
const Stack = createNativeStackNavigator();

function App() {
  const scheme = useColorScheme();
  React.useEffect(function() {
    LogBox.ignoreLogs(['react-native-ytdl is out of date! If the latest port is available, update with "npm install react-native-ytdl@latest".']);
  },[])
  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={{headerShown:false}} />
        <Stack.Screen name="Player" component={Player} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;