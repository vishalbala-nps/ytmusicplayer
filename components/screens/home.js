/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React from 'react';
import TrackPlayer from 'react-native-track-player';
import { Capability,AppKilledPlaybackBehavior } from 'react-native-track-player';
import Search from './search.js'
import BottomStatus from '../bottomPlayer.js';
import {Provider as PaperProvider} from 'react-native-paper'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import Downloads from './downloads.js';
import Playlist from './playlist.js';
const Tab = createBottomTabNavigator();
export default function({ navigation }) {
  const pliststopped = React.useRef(false)
  React.useEffect(function() {
    TrackPlayer.setupPlayer({maxBuffer:400,minBuffer:200,backBuffer:100}).then(function() {
      TrackPlayer.updateOptions({
        alwaysPauseOnInterruption:true,
        capabilities: [
            Capability.Play,
            Capability.Pause,
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
        notificationCapabilities: [
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
    return function() {
      TrackPlayer.reset()
    }
  },[])
  return (
    <PaperProvider>
        <Tab.Navigator screenOptions={function(route) {
          return {
            tabBarIcon:function() {
              if (route.route.name === "Search") {
                return <Icon name="search" size={20} />
              } else if (route.route.name === "Downloads") {
                return <Icon name="download" size={20} />
              } else if (route.route.name === "Playlists") {
                return <Icon name="list" size={20} />
              }
            }
          }
        }} >
          <Tab.Screen name="Search" component={Search} options={{unmountOnBlur:true}} initialParams={{pliststopped:pliststopped}} />
          <Tab.Screen name="Downloads" component={Downloads} options={{unmountOnBlur:true}} initialParams={{pliststopped:pliststopped}} />
          <Tab.Screen name="Playlists" component={Playlist} initialParams={{pliststopped:pliststopped}} />
        </Tab.Navigator>
        <BottomStatus nav={navigation} />
    </PaperProvider>
  )
}
