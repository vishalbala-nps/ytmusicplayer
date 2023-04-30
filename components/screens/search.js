import React from 'react';
import axios from 'axios';
import { TextInput,Button,ActivityIndicator,List } from 'react-native-paper';
import { FlatList,Text,TouchableOpacity, View,Keyboard } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import TrackPlayer from 'react-native-track-player';
import moment from 'moment';
import DownloadBtn from './searchComponents/downloadBtn.js';
import getDurationAndURL from './searchComponents/getDurationAndURL.js';
import PlistMenu from './searchComponents/plistMenu.js';
export default function({route, navigation}) {
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
      const [plistmenu, setplistmenu] = React.useState({visible:false,playlists:[]});
        return (
          <>
            <List.Item title={props.song} description={props.artist} onPress={function() {
                route.params.pliststopped.current = true
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
                      <PlistMenu mstate={plistmenu} setmstate={setplistmenu} setload={setonclickload} song={{url:"",title:props.song,artist:props.artist,artwork:props.albumart,duration:"",description:props.vid}} />
                      <DownloadBtn videoID={props.vid} song={props.song} artist={props.artist} />
                      <TouchableOpacity onPress={function() {
                        setonclickload(true)
                        getDurationAndURL(props.vid).then(async function(d) {
                          setonclickload(false)
                          const s = await TrackPlayer.getState()
                          if (s === "idle") {
                            console.log("player is idle resetting")
                            await TrackPlayer.reset()
                          }
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
            </>
          )
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
          <TextInput label="Search Youtube" onChangeText={function(t) {
            search.current = t;
          }}/>
          <Button onPress={function(){
            Keyboard.dismiss()
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