import React from 'react';
import { Card,IconButton } from 'react-native-paper';
import { Text,Image,View } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { usePlaybackState,State,Event,useTrackPlayerEvents } from 'react-native-track-player';

export default React.memo(function(props) {
    const playerState = usePlaybackState();
    const [curtrack,setcurtrack] = React.useReducer(function(state,val) {
      if (val.loading) {
        return {loading:true,error:false,data:{}}
      } else if (val.metarec) {
        return {loading:false,error:false,data:val.data}
      } else {
        return {loading:false,error:true,data:{}}
      }
    },{loading:false,error:false,data:{}})
    useTrackPlayerEvents([Event.PlaybackTrackChanged],function(e) {
      setcurtrack({loading:true})
      if (e.nextTrack !== undefined) {
        TrackPlayer.getTrack(e.nextTrack).then(function(ob) {
          setcurtrack({
            metarec:true,
            data:ob
          })
        })
      } else {
        TrackPlayer.reset()
      }
    })
    function PlayPauseBtn() {
      if (playerState === State.Playing) {
        return <IconButton icon="pause" onPress={function() {
          TrackPlayer.pause()
        }} />
      } else {
        return <IconButton icon="play" onPress={function() {
          TrackPlayer.play()
        }} />
      } 
    }
    if (playerState === State.Stopped || playerState === State.None) {
      return null
    } else {
      if (curtrack.loading) {
        return null
      } else {
        return (
          <Card mode='contained' style={{height:60,position:"absolute",width:"100%",bottom: 55}} contentStyle={{flexDirection:"row",alignContent:"space-between"}} onPress={function() {
            props.nav.navigate("Player")
          }}>
              <Image style={{width: 50, height: 50,left:6,top:5,right:4,flexBasis:"auto",flexGrow:0,flexShrink:1}} source={{uri:curtrack.data.artwork}}/>
              <View style={{flexDirection:"column",alignSelf:'stretch',flex:1,top:5,left:12}}>
                <Text numberOfLines={1} style={{fontSize:20,fontWeight:"bold"}}>{curtrack.data.title}</Text>
                <Text numberOfLines={1}>{curtrack.data.artist}</Text>
              </View>
              <View style={{flexDirection:"row",marginLeft:"auto",alignItems:"center",top:3}}>
                <IconButton icon="skip-backward" onPress={function() {
                    TrackPlayer.getCurrentTrack().then(function(ind) {
                    const nind = ind-1
                    if (nind >= 0) {
                      TrackPlayer.skip(nind)
                    }  
                  })
                }}/>
                <PlayPauseBtn />
                <IconButton icon="skip-forward" onPress={async function() {
                  const ind = await TrackPlayer.getCurrentTrack()
                  const queue = await TrackPlayer.getQueue()
                  const nind = ind+1
                  if (nind < queue.length) {
                    TrackPlayer.skip(nind)
                  }
              }}/>
            </View>
          </Card>
        )
      }
    }
  })