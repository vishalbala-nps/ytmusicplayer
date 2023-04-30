import React from 'react';
import TrackPlayer from 'react-native-track-player';
import {View,Text, Image} from 'react-native';
import { IconButton } from 'react-native-paper';
import PlayPauseBtn from './playerComponents/playPause.js'
import SeekBar from './playerComponents/seekBar.js'
import { useTrackPlayerEvents,Event } from 'react-native-track-player';
export default function({navigation}) {
    const [song,setsong] = React.useState({})
    React.useEffect(function() { 
        TrackPlayer.getCurrentTrack().then(function(no) {
            TrackPlayer.getTrack(no).then(function(ob) {
                setsong(ob)
            })
        })
    })
    useTrackPlayerEvents([Event.PlaybackTrackChanged],function(e) {
        if (e.nextTrack === undefined) {
          TrackPlayer.reset()
          navigation.navigate("Search")
        }
      })
    return (
        <>
            <View style={{alignItems: 'center',width:"100%"}}>
                <Image style={{width: 200, height: 200}} source={{uri:song.artwork}}/>
                <Text />
                <Text style={{fontSize:35,fontWeight:"bold",textAlign:"center"}} numberOfLines={3}>{song.title}</Text>
                <Text style={{fontSize:20}}>{song.artist}</Text>
                <View style={{flexDirection:"row",alignItems:"center"}}>
                    <IconButton
                        icon="skip-backward"
                        size={45}
                        onPress={function() {
                            TrackPlayer.getCurrentTrack().then(function(ind) {
                              const nind = ind-1
                              if (nind >= 0) {
                                TrackPlayer.skip(nind)
                              }  
                            })
                        }}
                        mode="contained"
                    />
                    <PlayPauseBtn/>
                    <IconButton
                        icon="skip-forward"
                        size={45}
                        onPress={async function() {
                            const ind = await TrackPlayer.getCurrentTrack()
                            const queue = await TrackPlayer.getQueue()
                            const nind = ind+1
                            if (nind < queue.length) {
                                TrackPlayer.skip(nind)
                            }
                        }}
                        mode="contained"
                    />
                </View>
            </View>
            <SeekBar />
        </>
    )
}