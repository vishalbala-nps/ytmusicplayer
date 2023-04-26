import {YT_SEARCH_API_KEY} from '@env'
import ytdl from 'react-native-ytdl'
import axios from 'axios';

export default function(vid) {
    return new Promise(function(resolve,reject) {
      Promise.all([axios.get("https://www.googleapis.com/youtube/v3/videos",{params:{
        id:vid,
        part: "contentDetails",
        key: YT_SEARCH_API_KEY
      }}),ytdl("https://www.youtube.com/watch?v="+vid, { quality: 'highestaudio' })]).then(function(res) {
        resolve(res)
      }).catch(function(e) {
        console.log(e)
        reject(e)
      })
    })
  }