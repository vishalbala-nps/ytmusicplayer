import React from 'react';
import TrackPlayer from 'react-native-track-player';
import {View,Text, Image} from 'react-native';
import { IconButton } from 'react-native-paper';
import PlayPauseBtn from './playerComponents/playPause.js'
import SeekBar from './playerComponents/seekBar.js'

export default function() {
    const [song,setsong] = React.useState({})
    React.useEffect(function() { 
        TrackPlayer.getCurrentTrack().then(function(no) {
            TrackPlayer.getTrack(no).then(function(ob) {
                setsong(ob)
            })
        })
    })
    return (
        <>
            <View style={{alignItems: 'center',width:"100%"}}>
                <Image style={{width: 200, height: 200}} source={{uri:song.artwork}}/>
                <Text />
                <Text style={{fontSize:35,fontWeight:"bold"}}>{song.title}</Text>
                <Text style={{fontSize:20}}>{song.artist}</Text>
                <View style={{flexDirection:"row",alignItems:"center"}}>
                    <IconButton
                        icon="skip-backward"
                        size={45}
                        onPress={function() {
                            TrackPlayer.getPosition().then(function(p) {
                                console.log(p)
                                TrackPlayer.seekTo(parseInt(p)-10);
                            })
                        }}
                        mode="contained"
                    />
                    <PlayPauseBtn/>
                    <IconButton
                        icon="skip-forward"
                        size={45}
                        onPress={function() {
                            TrackPlayer.getPosition().then(function(p) {
                                TrackPlayer.seekTo(parseInt(p)+10);
                            })
                        }}
                        mode="contained"
                    />
                </View>
            </View>
            <SeekBar />
        </>
    )
}