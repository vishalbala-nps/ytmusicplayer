import React from 'react';
import TrackPlayer from 'react-native-track-player';
import {View,Text, Image} from 'react-native';
import Slider from '@react-native-community/slider';
import { IconButton,ProgressBar,ActivityIndicator } from 'react-native-paper';
import { Event,useProgress,State,usePlaybackState,useTrackPlayerEvents,Capability,AppKilledPlaybackBehavior } from 'react-native-track-player';
import ytdl from "react-native-ytdl"
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';

export default function(gprops) {
    const navigation = gprops.navigation
    const props = gprops.route.params
    const [pinit,setpinit] = React.useState(true)
    const [song,setsong] = React.useState({})
    const playlist = React.useRef([])
    React.useEffect(function() { 
        console.log("component mount")
        async function addinqueue() {
            console.log("Getting URL from youtube")
            let yturl = await ytdl(playlist.current[0].description, { quality: 'highestaudio' })
            setpinit(false)
            playlist.current[0].url = yturl[0].url
            console.log(playlist.current)
            await TrackPlayer.add(playlist.current);
            setsong(playlist.current[0])
            TrackPlayer.play()
        }
        playlist.current = props.queue
        TrackPlayer.reset().then(async function() {
            console.log("Adding song in queue")
            await addinqueue()
        }).catch(async function() {
            console.log("Initializing Player")
            await TrackPlayer.setupPlayer()
            await TrackPlayer.updateOptions({
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
            await addinqueue()
        })
    },[props.queue,playlist])
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
    function ImageRender() {
        if (pinit) {
            return (
                <View style={{width: 200, height: 200,alignItems:"center",alignContent:"center"}}>
                    <ActivityIndicator size={45} animating={true} />
                </View>
            )
        } else {
            return <Image style={{width: 200, height: 200}} source={{uri:song.artwork}}/>
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
                <ImageRender />
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