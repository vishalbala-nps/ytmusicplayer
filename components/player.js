import React from 'react';
import TrackPlayer from 'react-native-track-player';
import {Button} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

export default function(props) {
    const [pstat,setpstat] = React.useState(false)
    console.log(props)
    React.useEffect(function() {
        async function setup() {
          await TrackPlayer.setupPlayer()
          await TrackPlayer.add([{url:props.url}]);
          setpstat(false)
        }
        console.log("in effect")
        if (props.url !== null) {
            console.log("not null so initializing player")
            setpstat(true)
            setup()
        }
    },[props.url])
    return (
        <>
            <Spinner visible={pstat} textContent={'Please Wait'} />
            <Button onPress={function() {
                TrackPlayer.play();
                TrackPlayer.setVolume(1);
            }} title="Play"/>
            <Button onPress={function() {
                TrackPlayer.pause();
            }} title="Pause"/>
            <Button onPress={function() {
                TrackPlayer.reset();
            }} title="Stop"/>
            <Button onPress={function() {
                TrackPlayer.seekTo(10);
            }} title="Seek Forward"/>
            <Button onPress={function() {
                TrackPlayer.seekTo(-10);
            }} title="Seek Backward"/>
        </>
    )
}