import React from 'react';
import TrackPlayer from 'react-native-track-player';
import {View,Text, Image} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Slider from '@react-native-community/slider';
import { IconButton,ProgressBar } from 'react-native-paper';
import { State } from 'react-native-track-player';
import { useTrackPlayerEvents, Event } from 'react-native-track-player';

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
                console.log(val.song)
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
                        setsong({state:"paused"})
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
                        setsong({state:"playing"})
                        TrackPlayer.setVolume(1);
                    }}
                    mode="contained"
                />
            )
        }
    }
    function SeekBar(sprops) {
        
    }
    useTrackPlayerEvents([Event.PlaybackState,Event.PlaybackError],function(event) {
        if (event.type === Event.PlaybackError) {
            alert("An Error Occured. Please Try again later")
        } else {
            if (event.state === "connecting") {
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
            <ProgressBar indeterminate visible={State.Buffering} />
            <ProgressBar indeterminate visible={State.Connecting} />
            <View style={{flexDirection: 'row'}}>
                <Text style={{flexBasis:"auto",flexShrink:1,flexGrow:0}}>00:00:00</Text>
                <Slider style={{flexBasis:100,flexShrink:0,flexGrow:1}} minimumValue={0} maximumValue={100} />
                <Text style={{flexBasis:"auto",flexShrink:1,flexGrow:0}}>99:99:99</Text>
            </View>

        </>
    )
}