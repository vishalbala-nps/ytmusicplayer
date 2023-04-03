/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import axios from 'axios';
import React from 'react';
import {YT_SEARCH_API_KEY} from "@env";
/*import {Button,TextInput} from 'react-native';
import ytdl from "react-native-ytdl"
import Player from './components/player.js';*/
import { Provider as PaperProvider,TextInput,Button,List,ActivityIndicator } from 'react-native-paper';
import { FlatList,Text } from 'react-native';

function App(props) {
  const search = React.useRef("")
  const scrollbegin = React.useRef(false)
  const [text, onChangeText] = React.useState();
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
  function SongListItem(props) {
    const litem = React.useMemo(function() {
      return <List.Item title={props.song} description={props.artist}/>
    },[props.song,props.artist])
    return litem
  }
  return (
    <PaperProvider>
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
        return <SongListItem song={item.item.snippet.title} artist={item.item.snippet.channelTitle}/>
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
      {/*<TextInput
        onChangeText={onChangeText}
        value={text}
      />
      <Button onPress={async function() {
          setyturl("loading");
          const urls = await ytdl(text, { quality: 'highestaudio' });
          setyturl(urls[0].url);
      }} title="Get Youtube URL"/>
      <Player queue={[{id:0,url:yturl.url,artwork:"https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg",title:"Test",artist:"Test",duration:0}]}/>*/}
    </PaperProvider>
  )
}

export default App;
