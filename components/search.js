/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React from 'react';
import TrackPlayer from 'react-native-track-player';
import { Capability,AppKilledPlaybackBehavior } from 'react-native-track-player';
import SearchLst from './searchlst.js'
import BottomStatus from './bottomPlayer.js';
import {Provider as PaperProvider} from 'react-native-paper'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
import { Text, View } from 'react-native';
export default function({ navigation }) {
  React.useEffect(function() {
    TrackPlayer.setupPlayer().then(function() {
      TrackPlayer.updateOptions({
        alwaysPauseOnInterruption:true,
        capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.Stop,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.SeekTo,
        ],
        compactCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
        ],
        android: {appKilledPlaybackBehavior:AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification},
        forwardJumpInterval: 10,
        backwardJumpInterval: 10
    })
    }).catch(function() {
      //TrackPlayer.reset()
    })
  },[])
  function HomeScreen() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Home!</Text>
      </View>
    );
  }
  
  function SettingsScreen() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Settings!</Text>
      </View>
    );
  }
  return (
    <PaperProvider>
        <Tab.Navigator screenOptions={{headerShown:false}} >
          <Tab.Screen name="Search Music" component={SearchLst} />
          <Tab.Screen name="Downloads" component={SettingsScreen} />
        </Tab.Navigator>
        <BottomStatus nav={navigation} />
    </PaperProvider>
  )
}
