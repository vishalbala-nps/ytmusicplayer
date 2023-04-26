import React from 'react';
import axios from 'axios';
import { TextInput,Button,ActivityIndicator,List } from 'react-native-paper';
import { FlatList,Text,TouchableOpacity, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import TrackPlayer from 'react-native-track-player';
import moment from 'moment';
import DownloadBtn from '../searchComponents/downloadBtn.js';
import PlaylistAddModal from './playlistAddModal.js';
import getDurationAndURL from './getDurationAndURL.js';
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
    const [showplistmodal, setshowplistmodal] = React.useReducer(function(state,val) {
      if (val.show) {
          return {show:true,song:val.song}
      } else {
          return {show:false,song:""}
      }
  },{show:false,song:""});
    const SongListItem = React.memo(function(props) {
        return <List.Item title={props.song} description={props.artist} onPress={function() {
            setonclickload(true)
            getDurationAndURL(props.vid).then(function(d) {
              setonclickload(false)
              TrackPlayer.reset().then(function() {
                TrackPlayer.add({
                  url: d[1][0].url,
                  title: props.song,
                  artist: props.artist,
                  artwork: props.albumart,
                  duration: parseInt(moment.duration(d[0].data.items[0].contentDetails.duration).asSeconds())
                })
                TrackPlayer.play()
              })
            }).catch(function() {
              setonclickload(false)
              alert("An error occured. Please try again later")
            })
          }} right={function() {
            return (
              <View style={{flexDirection:"row", gap: 10}}>
                <View/>
                  <TouchableOpacity onPress={function() {
                    setshowplistmodal({show:true,song:{title:props.song,artist:props.artist,artwork:props.albumart,url:"",description:"https://www.youtube.com/watch?v="+props.vid}})
                  }}>
                    <List.Icon icon="plus" />
                  </TouchableOpacity>
                  <DownloadBtn videoID={props.vid} song={props.song} artist={props.artist} />
                  <TouchableOpacity onPress={function() {
                    setonclickload(true)
                    getDurationAndURL(props.vid).then(function(d) {
                      setonclickload(false)
                      TrackPlayer.add({
                        url: d[1][0].url,
                        title: props.song,
                        artist: props.artist,
                        artwork: props.albumart,
                        duration: parseInt(moment.duration(d[0].data.items[0].contentDetails.duration).asSeconds())
                      }).then(function() {
                        TrackPlayer.play()
                      })
                    }).catch(function(e) {
                      setonclickload(false)
                      console.log(e)
                      alert("An error occured. Please try again later")
                    })
                  }}>
                  <List.Icon icon="playlist-plus" />
                </TouchableOpacity>
              </View>
            )
          }}/>
      })
      function renderItem(item) {
        return <SongListItem song={item.item.snippet.title} artist={item.item.snippet.channelTitle} vid={item.item.id.videoId} albumart={item.item.snippet.thumbnails.high.url}/>
      }
    return (
        <>
          <Spinner
            visible={onclickload}
            textContent={'Please Wait'}
          />
          <PlaylistAddModal modal={showplistmodal} setmodal={setshowplistmodal}/>
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
          }} renderItem={renderItem} onEndReached={function() {
            if (search.current !== "" && scrollbegin.current === true) {
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