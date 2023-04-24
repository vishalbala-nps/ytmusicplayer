import React from 'react';
import TrackPlayer from 'react-native-track-player';
import {View,Text } from 'react-native';
import Slider from '@react-native-community/slider';
import { ProgressBar } from 'react-native-paper';
import { useProgress,State,usePlaybackState } from 'react-native-track-player';
import moment from "moment"

export default function() {
    const { position, buffered, duration } = useProgress()
    const playerState = usePlaybackState();
    if (playerState === State.Connecting) {
        return <ProgressBar indeterminate visible={true}/>
    } else {
        return (
            <View style={{flexDirection: 'row'}}>
                <Text style={{flexBasis:"auto",flexShrink:1,flexGrow:0}}>{moment.duration(position,'seconds').format("hh:mm:ss", { trim: false })}</Text>
                <View style={{flexBasis:100,flexShrink:0,flexGrow:1}}>
                    <Slider minimumValue={0} maximumValue={duration} value={parseInt(position)} maximumTrackTintColor="transparent" minimumTrackTintColor="#ff0000" onSlidingComplete={function(n) {
                        TrackPlayer.seekTo(n)
                    }}/>
                    <Slider minimumValue={0} maximumValue={duration} value={parseInt(buffered)} style={{zIndex:-1,position:"absolute",width:"100%"}} thumbTintColor="transparent" minimumTrackTintColor="#8e8d8b" maximumTrackTintColor="#5f5c59"/>
                </View>
                <Text style={{flexBasis:"auto",flexShrink:1,flexGrow:0}}>{moment.duration(duration,'seconds').format("hh:mm:ss", { trim: false })}</Text>
            </View>
        )
    }
}