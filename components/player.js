import React from 'react';
import TrackPlayer from 'react-native-track-player';
import {View,Text, Image} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Slider from '@react-native-community/slider';
import { IconButton } from 'react-native-paper';
import { State } from 'react-native-track-player';
import { ProgressBar, MD3Colors } from 'react-native-paper';

export default function(gprops) {
    const navigation = gprops.navigation
    const props = gprops.route.params
    const [pstat,setpstat] = React.useState(false)
    const [playing,setplaying] = React.useState(false)
    const [currsong,setcurrsong] = React.useState({})
    React.useEffect(function() { 
        async function addinqueue() {
            await TrackPlayer.add(props.queue);
            setpstat(false)
            setplaying(true)
            TrackPlayer.play();
            setcurrsong(props.queue[0]) 
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
            setpstat(true)
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
    return (
        <>
            <Spinner visible={pstat} textContent={'Please Wait'} />
            <View style={{alignItems: 'center',width:"100%"}}>
                <Image style={{width: 200, height: 200}} source={{uri:currsong.artwork}}/>
                <Text />
                <Text style={{fontSize:35,fontWeight:"bold"}}>{currsong.title}</Text>
                <Text style={{fontSize:20}}>{currsong.artist}</Text>
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