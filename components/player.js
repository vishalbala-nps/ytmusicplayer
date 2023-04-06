import React from 'react';
import TrackPlayer from 'react-native-track-player';
import {View,Text, Image} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Slider from '@react-native-community/slider';
import { IconButton,ProgressBar,ActivityIndicator } from 'react-native-paper';
import { Event,useProgress,State,usePlaybackState,useTrackPlayerEvents } from 'react-native-track-player';
import moment from 'moment';

export default function(gprops) {
    const navigation = gprops.navigation
    const props = gprops.route.params
    const [pinit,setpinit] = React.useState(false)
    const [song,setsong] = React.useState({})
    React.useEffect(function() { 
        async function addinqueue() {
            await TrackPlayer.add(props.queue);
            setpinit(false)
            setsong(props.queue[0])
            TrackPlayer.play()
        }       
        async function setup() {
          TrackPlayer.reset().then(async function() {
            console.log("Already Playing, so adding song in cleared queue")
            addinqueue()
          }).catch(async function() {
            console.log("Not playing. So initalizing for first time")
            await TrackPlayer.setupPlayer({playBuffer:10})
            addinqueue()
        })
        }
        console.log("in effect")
        if (props.queue[0].url !== null) {
            console.log("not null so initializing player")
            setpinit(true)
            setup()
        }
    },[props.queue])
    function PlayPauseBtn() {
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
    function SeekBar() {
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
    useTrackPlayerEvents([Event.PlaybackState,Event.PlaybackError],function(event) {
        if (event.type === Event.PlaybackError) {
            alert("An Error Occured. Please Try again later")
        }
        console.log(JSON.stringify(event))
    })
    return (
        <>
            <Spinner visible={pinit} textContent={'Please Wait'} />
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