import React from 'react';
import axios from 'axios';
import { TextInput,Button,ActivityIndicator,List } from 'react-native-paper';
import { FlatList,Text } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {YT_SEARCH_API_KEY} from '@env'
import ytdl from 'react-native-ytdl'
import TrackPlayer from 'react-native-track-player';
import moment from 'moment';
export default function() {
    const search = React.useRef("")
    const scrollbegin = React.useRef(false)
    const [loading,setloading] = React.useReducer(function(state,val) {
      if (val.status === "loading") {
        return {loading:true,error:false,loading:false,data:[],nextpage:""}
      } else if (val.status === "loading_np") {
        return {error:false,loading:true,data:state.data,nextpage:state.nextpage}
      } else if (val.status === "error") {
        alert("An Error Occured. Please Try again later")
        return {error:true,loading:false,data:[],nextpage:""}
      } else if (val.status === "data_np") {
        return {error:false,loading:false,data:state.data.concat(val.data),nextpage:val.nextpage}
      } else {
        return {error:false,loading:false,data:val.data,nextpage:val.nextpage}
      }
    },{error:false,loading:false,data:[],nextpage:""})
    const [onclickload,setonclickload] = React.useState(false)
    const SongListItem = React.memo(function(props) {
        return <List.Item title={props.song} description={props.artist} onPress={function() {
            setonclickload(true)
            Promise.all([axios.get("https://www.googleapis.com/youtube/v3/videos",{params:{
              id:props.vid,
              part: "contentDetails",
              key: YT_SEARCH_API_KEY
            }}),ytdl("https://www.youtube.com/watch?v="+props.vid, { quality: 'highestaudio' })]).then(function(res) {
              setonclickload(false)
              TrackPlayer.add({
                url: res[1][0].url,
                title: props.song,
                artist: props.artist,
                artwork: props.albumart,
                duration: parseInt(moment.duration(res[0].data.items[0].contentDetails.duration).asSeconds())
              })
              TrackPlayer.play()
            }).catch(function(e) {
              setonclickload(false)
              console.log(e)
              alert("An Error Occured. Please Try again later")
            })
          }}/>
      })
    return (
        <>
          <Spinner
            visible={onclickload}
            textContent={'Please Wait'}
          />
          <TextInput label="Search Youtube" onChangeText={function(t) {
            search.current = t;
          }}/>
          <Button onPress={function(){
            if (search.current !== "") {
              setloading({status:"loading"})
              axios.get("https://www.googleapis.com/youtube/v3/search",{params:{
                maxResults:70,
                q:search.current,
                type:"video,song",
                part:"snippet",
                key: process.env.YT_SEARCH_API_KEY
              }}).then(function(r) {
                setloading({status:"data",data:r.data.items,nextpage:r.data.nextPageToken})
              }).catch(function(e) {
                console.log(e)
                setloading({status:"error"})
              })
            }
          }}>Search</Button>
          <FlatList data={loading.data} keyExtractor={function(item,index) {
            return index
          }} renderItem={function(item) {
            return <SongListItem song={item.item.snippet.title} artist={item.item.snippet.channelTitle} vid={item.item.id.videoId} albumart={item.item.snippet.thumbnails.high.url}/>
          }} onEndReached={function() {
            if (search.current !== "" && scrollbegin.current === true) {
              console.log("End reached Loading")
              setloading({status:"loading_np"})
              if (loading.nextpage !== undefined) {
                axios.get("https://www.googleapis.com/youtube/v3/search",{params:{
                  maxResults:70,
                  q:search.current,
                  type:"video,song",
                  part:"snippet",
                  pageToken:loading.nextpage,
                  key: process.env.YT_SEARCH_API_KEY
                }}).then(function(r) {
                  setloading({status:"data_np",data:r.data.items,nextpage:r.data.nextPageToken})
                }).catch(function(e) {
                  console.log(e)
                  setloading({status:"error"})
                })
              }
            }
          }} ListFooterComponent={function() {
            if (loading.nextpage === undefined) {
              return <Text style={{textAlign:"center"}}>You have reached the End</Text>
            } else if (loading.loading) {
              return <ActivityIndicator animating={true}/>
            }
          }} onMomentumScrollBegin={function() {
            scrollbegin.current = true
          }} onEndReachedThreshold={0.8}/>
        </>
      )
}