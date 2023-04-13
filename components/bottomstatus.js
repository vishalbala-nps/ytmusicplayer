import React from 'react';
import { Card,IconButton } from 'react-native-paper';
import { Text,Image,View } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { usePlaybackState,State,Event,useTrackPlayerEvents } from 'react-native-track-player';
export default React.memo(function(props) {
    const playerState = usePlaybackState();
    const [curtrack,setcurtrack] = React.useState({title:"Title",artist:"Text",artwork:"https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930"})
    useTrackPlayerEvents([Event.PlaybackTrackChanged],function(e) {
      if (e.nextTrack === undefined) {
        TrackPlayer.reset()
      } else {
        TrackPlayer.getTrack(e.nextTrack).then(function(ob) {
          setcurtrack(ob)
        })
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
      return (
        <Card mode='contained' style={{height:80}} contentStyle={{flexDirection:"row",alignContent:"space-between"}} onPress={function() {
          props.nav.navigate("Player")
        }}>
            <Image style={{width: 70, height: 70,left:6,top:5,right:4,flexBasis:"auto",flexGrow:0,flexShrink:1}} source={{uri:curtrack.artwork}}/>
            <View style={{flexDirection:"column",alignSelf:'stretch',flex:1,top:5,left:12}}>
              <Text numberOfLines={1} style={{fontSize:20,fontWeight:"bold"}}>{curtrack.title}</Text>
              <Text numberOfLines={1}>{curtrack.artist}</Text>
            </View>
            <View style={{flexDirection:"row",marginLeft:"auto",alignItems:"center",top:3}}>
              <IconButton icon="skip-backward" />
              <PlayPauseBtn />
              <IconButton icon="skip-forward" />
            </View>
        </Card>
      )
    }
  })