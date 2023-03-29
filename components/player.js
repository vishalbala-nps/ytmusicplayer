import React from 'react';
import TrackPlayer from 'react-native-track-player';
import {View,Text, Image} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Slider from '@react-native-community/slider';
import { IconButton } from 'react-native-paper';
import { State } from 'react-native-track-player';
export default function(props) {
    const [pstat,setpstat] = React.useState(false)
    const [playing,setplaying] = React.useState(false)
    console.log(props)
    React.useEffect(function() {
        async function setup() {
          await TrackPlayer.setupPlayer({playBuffer:10,minBuffer:50,maxBuffer:50})
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
    function PlayPauseBtn(props) {
        console.log(props.playing)
        if (props.playing) {
            return (
                <IconButton
                    icon="pause"
                    size={45}
                    onPress={function() {
                        TrackPlayer.pause();
                        setplaying(false)
                    }}
                    mode="contained"
                />
            )
        } else {
            return (
                <IconButton
                    icon="play"
                    size={45}
                    onPress={function() {
                        TrackPlayer.play();
                        TrackPlayer.setVolume(1);
                        setplaying(true)
                    }}
                    mode="contained"
                />
            )
        }
    }
    console.log(State)
    return (
        <>
            <Spinner visible={pstat} textContent={'Please Wait'} />
            <View style={{alignItems: 'center',width:"100%"}}>
                <Image style={{width: 200, height: 200}} source={{uri:props.image}}/>
                <Text />
                <Text style={{fontSize:35,fontWeight:"bold"}}>{props.songname}</Text>
                <Text style={{fontSize:20}}>{props.songartist}</Text>
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
                    <PlayPauseBtn playing={playing}/>
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
            <View style={{flexDirection: 'row'}}>
                <Text style={{flexBasis:"auto",flexShrink:1,flexGrow:0}}>00:00:00</Text>
                <Slider style={{flexBasis:100,flexShrink:0,flexGrow:1}} minimumValue={0} maximumValue={100} />
                <Text style={{flexBasis:"auto",flexShrink:1,flexGrow:0}}>99:99:99</Text>
            </View>

        </>
    )
}