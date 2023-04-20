import React from 'react';
import Search from './components/search.js'
import Player from './components/player.js'
import { NavigationContainer,DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PermissionsAndroid, Platform, useColorScheme,BackHandler,Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob'

const Stack = createNativeStackNavigator();

function App() {
  const scheme = useColorScheme();
  React.useEffect(function() {
    if (Platform.OS === "android") {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,{title: "Storage Permission Required", message:"App needs access to your storage to download music"}).then(function(granted) {
        if (granted === PermissionsAndroid.RESULTS.DENIED) {
          Alert.alert('Storage Permission Denied', 'App needs access to your storage to download music. You will be unable to download music unless you enable storage', [
            {
              text: 'Exit Application',
              onPress: () => BackHandler.exitApp()
            }]
          )
        }
      })
    }
  },[])
  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator>
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="Player" component={Player} options={{presentation:"modal"}} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;