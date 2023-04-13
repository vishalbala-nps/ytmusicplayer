import React from 'react';
import TrackPlayer from 'react-native-track-player';
import { IconButton,ProgressBar,ActivityIndicator } from 'react-native-paper';
import { Event,useProgress,State,usePlaybackState } from 'react-native-track-player';

export default function() {
    const playerState = usePlaybackState();
    if (playerState === State.Playing) {
        return (
            <IconButton
                icon="pause"
                size={45}
                onPress={function() {
                    if (playerState !== State.Connecting && playerState !== State.Buffering) {
                        TrackPlayer.pause()
                    }
                }}
                mode="contained"
            />
        )
    } else if (playerState === State.Buffering) {
        return (
            <ActivityIndicator size={45} animating={true} />
        )
    } else {
        return (
            <IconButton
                icon="play"
                size={45}
                onPress={function() {
                    if (playerState !== State.Connecting && playerState !== State.Buffering) {
                        TrackPlayer.play()
                    }
                }}
                mode="contained"
            />
        )
    }
}