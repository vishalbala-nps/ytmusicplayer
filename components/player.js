import React from 'react';
import TrackPlayer from 'react-native-track-player';
import {View,Text, Image} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Slider from '@react-native-community/slider';
import { IconButton,ProgressBar } from 'react-native-paper';
import { useTrackPlayerEvents, Event,useProgress } from 'react-native-track-player';
import moment from 'moment';

export default function(gprops) {
    const navigation = gprops.navigation
    const props = gprops.route.params
    const [pinit,setpinit] = React.useState(false)
    const [song,setsong] = React.useReducer(function(state,val) {
        if (val.state === "loading") {
            return {playing:false,currentsong:state.currentsong,loading:true}
        } else if (val.state === "playing") {
            if (val.dontcalltp !== false) {
                TrackPlayer.play();
            } 
            if (val.song === undefined) {
                console.log("No song specified. Using old one")
                return {playing:true,currentsong:state.currentsong,loading:false}
            } else {
                return {playing:true,currentsong:val.song,loading:false}
            }
        } else if (val.state === "paused") {
            if (val.dontcalltp !== false) {
                TrackPlayer.pause();
            } 
            return {playing:false,currentsong:state.currentsong,loading:false}
        } else if (val.state === "buffering") {
            return {playing:true,currentsong:state.currentsong,loading:false}
        }
    },{playing:false,currentsong:{},loading:false})
    const { position, buffered, duration } = useProgress()
    React.useEffect(function() { 
        async function addinqueue() {
            await TrackPlayer.add(props.queue);
            setpinit(false)
            setsong({state:"playing",song:props.queue[0]})
        }       
        async function setup() {
          TrackPlayer.reset().then(async function() {
            console.log("Already Playing, so adding song in cleared queue")
            addinqueue()
          }).catch(async function() {
            console.log("Not playing. So initalizing for first time")
            await TrackPlayer.setupPlayer({playBuffer:10,minBuffer:50,maxBuffer:50})
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
    function PlayPauseBtn(btprops) {
        if (btprops.playing) {
            return (
                <IconButton
                    icon="pause"
                    size={45}
                    onPress={function() {
                        if (song.loading === false) {
                            setsong({state:"paused"})
                        }
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
                        if (song.loading === false) {
                            setsong({state:"playing"})
                            TrackPlayer.setVolume(1);
                        }
                    }}
                    mode="contained"
                />
            )
        }
    }
    function SeekBar(sprops) {
        /*if (song.loading) {
            console.log("song is loading")
            return <ProgressBar indeterminate visible={true} />
        } else {
            return (
                <View style={{flexDirection: 'row'}}>
                    <Text style={{flexBasis:"auto",flexShrink:1,flexGrow:0}}>{moment.duration(position,'seconds').format("hh:mm:ss", { trim: false })}</Text>
                    <Slider style={{flexBasis:100,flexShrink:0,flexGrow:1}} minimumValue={0} maximumValue={duration} value={parseInt(position)} />
                    <Text style={{flexBasis:"auto",flexShrink:1,flexGrow:0}}>{moment.duration(duration,'seconds').format("hh:mm:ss", { trim: false })}</Text>
                </View>
            )
        }*/
        return (
            <View style={{flexDirection: 'row'}}>
                <Text style={{flexBasis:"auto",flexShrink:1,flexGrow:0}}>{moment.duration(position,'seconds').format("hh:mm:ss", { trim: false })}</Text>
                <View style={{flexBasis:100,flexShrink:0,flexGrow:1}}>
                    <Slider minimumValue={0} maximumValue={duration} value={parseInt(position)} maximumTrackTintColor="transparent" minimumTrackTintColor="#ff0000" />
                    <Slider minimumValue={0} maximumValue={duration} value={parseInt(buffered)} style={{zIndex:-1,position:"absolute",width:"100%"}} thumbTintColor="transparent" minimumTrackTintColor="#8e8d8b" maximumTrackTintColor="#5f5c59"/>
                </View>
                <Text style={{flexBasis:"auto",flexShrink:1,flexGrow:0}}>{moment.duration(duration,'seconds').format("hh:mm:ss", { trim: false })}</Text>
            </View>
        )
    }
    useTrackPlayerEvents([Event.PlaybackState,Event.PlaybackError],function(event) {
        if (event.type === Event.PlaybackError) {
            alert("An Error Occured. Please Try again later")
        } else {
            if (event.state === "connecting" || event.state === "buffering") {
                setsong({state:"loading"})
            } else if (event.state === "playing") {
                if (song.playing === false) {
                    setsong({state:"playing",dontcalltp:true})
                }
            }
        }
        console.log(JSON.stringify(event))
    })
    return (
        <>
            <Spinner visible={pinit} textContent={'Please Wait'} />
            <View style={{alignItems: 'center',width:"100%"}}>
                <Image style={{width: 200, height: 200}} source={{uri:song.currentsong.artwork}}/>
                <Text />
                <Text style={{fontSize:35,fontWeight:"bold"}}>{song.currentsong.title}</Text>
                <Text style={{fontSize:20}}>{song.currentsong.artist}</Text>
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
                    <PlayPauseBtn playing={song.playing}/>
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