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
import Spinner from 'react-native-loading-spinner-overlay';
import { Provider as PaperProvider } from 'react-native-paper';
import { TextInput,Button,FlatList } from 'react-native-paper';

function App(props) {
  const search = React.useRef("")
  const [text, onChangeText] = React.useState();
  const [loading,setloading] = React.useReducer(function(state,val) {
    if (val.status === "loading") {
      return {loading:true,error:false,data:[],nextpage:""}
    } else if (val.status === "error") {
      alert("An Error Occured. Please Try again later")
      return {loading:false,error:true,data:[],nextpage:""}
    } else {
      return {loading:false,error:false,data:val.data.items,nextpage:""}
    }
  },{loading:false,error:false,data:[],nextpage:""})
  /*const [yturl,setyturl] = React.useReducer(function(state,val) {
    if (val === "loading") {
      return {loading:true,error:false,url:null}
    } else if (val === "error") {
      return {loading:false,error:true,url:null}
    } else {
      return {loading:false,error:false,url:val}
    }
  },{loading:false,error:false,url:null})*/
  return (
    <PaperProvider>
      <Spinner
        visible={loading.loading}
        textContent={'Please Wait'}
      />
      <TextInput label="Search Youtube" onChangeText={function(t) {
        search.current = t;
      }}/>
      <Button onPress={function(){
        console.log(process.env)
        setloading({status:"loading"})
        axios.get("https://www.googleapis.com/youtube/v3/search",{params:{
          maxResults:20,
          q:search.current,
          type:"video,song",
          key: process.env.YT_SEARCH_API_KEY
        }}).then(function(r) {
          setloading({status:"data",data:r.data.items,nextpage:r.data.nextPageToken})
          setloading(r.data.items)
        }).catch(function() {
          setloading({status:"error"})
        })
      }}>Search</Button>
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
