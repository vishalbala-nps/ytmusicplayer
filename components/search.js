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
import BottomStatus from './bottomstatus.js';
import {Provider as PaperProvider} from 'react-native-paper'
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
      <SearchLst />
      <BottomStatus nav={navigation} />
    </PaperProvider>
  )
}
