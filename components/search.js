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
import Icon from 'react-native-vector-icons/FontAwesome';
import Downloads from './downloads.js';
const Tab = createBottomTabNavigator();
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
  return (
    <PaperProvider>
        <Tab.Navigator screenOptions={function(route) {
          return {
            tabBarIcon:function() {
              if (route.route.name === "Search Music") {
                return <Icon name="search" size={20} />
              } else if (route.route.name === "Downloads") {
                return <Icon name="download" size={20} />
              }
            },headerShown:false
          }
        }}>
          <Tab.Screen name="Search Music" component={SearchLst} />
          <Tab.Screen name="Downloads" component={Downloads} />
        </Tab.Navigator>
        <BottomStatus nav={navigation} />
    </PaperProvider>
  )
}
