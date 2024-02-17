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
import ShareMenu from "react-native-share-menu";
import {ToastAndroid} from 'react-native'
import getDurationAndURL from './searchComponents/getDurationAndURL.js';
import moment from 'moment';
import axios from 'axios';
import 'react-native-url-polyfill/auto'

const Tab = createBottomTabNavigator();
export default function({ navigation }) {
  const pliststopped = React.useRef(false)
  function handleShare(item) {
    console.log(item)
    if (item !== null) {
      console.log("hi")
      const url = new URL(item.data)
      if ( url.hostname === "youtube.com" || url.hostname === "music.youtube.com" ) {
        const vid = url.searchParams.get("v")
        if (vid === null) {
          ToastAndroid.show("The above link is not a Youtube URL!",ToastAndroid.SHORT)
        } else {
          ToastAndroid.show("Loading Song Please wait",ToastAndroid.LONG)
          getDurationAndURL(vid,snip=true).then(function(d) {
            console.log(d[0].data.items[0].snippet.title)
            TrackPlayer.reset().then(function() {
              TrackPlayer.add({
                url: d[1][0].url,
                title: d[0].data.items[0].snippet.title,
                artist: d[0].data.items[0].snippet.channelTitle,
                artwork: d[0].data.items[0].snippet.thumbnails.default.url,
                vid: vid,
                duration: parseInt(moment.duration(d[0].data.items[0].contentDetails.duration).asSeconds())
              })
              TrackPlayer.play()
            })
          }).catch(function() {
            alert("An error occured. Please try again later")
          })
        }
      } else {
        ToastAndroid.show("The above link is not a Youtube URL!",ToastAndroid.SHORT)
      }
    }
  }
  React.useEffect(function() {
    let listener = {remove:function(){}}
    TrackPlayer.setupPlayer({maxBuffer:400,minBuffer:200,backBuffer:100}).then(async function() {
      await TrackPlayer.updateOptions({
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
      console.log("initialized")
      ShareMenu.getInitialShare(handleShare);
      listener = ShareMenu.addNewShareListener(handleShare);
    }).catch(function() {
      //TrackPlayer.reset()
    })
    return function() {
      TrackPlayer.reset()
      listener.remove()
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
