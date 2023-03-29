/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {Button,TextInput} from 'react-native';
import ytdl from "react-native-ytdl"
import Player from './components/player.js';
import TrackPlayer from 'react-native-track-player';
import Spinner from 'react-native-loading-spinner-overlay';

function App(props) {
  const [text, onChangeText] = React.useState();
  const [yturl,setyturl] = React.useReducer(function(state,val) {
    if (val === "loading") {
      return {loading:true,error:false,url:null}
    } else if (val === "error") {
      return {loading:false,error:true,url:null}
    } else {
      return {loading:false,error:false,url:val}
    }
  },{loading:false,error:false,url:null})
  return (
    <>
      <Spinner
        visible={yturl.loading}
        textContent={'Please Wait'}
      />
      <TextInput
        onChangeText={onChangeText}
        value={text}
      />
      <Button onPress={async function() {
          setyturl("loading");
          const urls = await ytdl(text, { quality: 'highestaudio' });
          setyturl(urls[0].url);
      }} title="Get Youtube URL"/>
      <Player url={yturl.url}/>
    </>
  )
}

export default App;
