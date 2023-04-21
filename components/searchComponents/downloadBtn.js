import React from 'react';
import { TouchableOpacity } from 'react-native';
import { List,ActivityIndicator } from 'react-native-paper';
import RNBackgroundDownloader from '@kesha-antonov/react-native-background-downloader'
import AsyncStorage from '@react-native-async-storage/async-storage';
import ytdl from 'react-native-ytdl'
import { AnimatedCircularProgress } from 'react-native-circular-progress';

export default function(props) {
    const [btnstatus,setbtnstatus] = React.useReducer(function(state,val) {
        if (val.loading) {
            return {loading:true,downloading:false,percent:0}
        } else if (val.downloading) {
            return {loading:false,downloading:true,percent:0}
        } else if (val.percent !== undefined) {
            return {loading:false,downloading:true,percent:val.percent} 
        } else {
            return {loading:false,downloading:false,percent:0}
        }
    },{loading:false,downloading:false,percent:0})
    if (btnstatus.loading) {
        return <ActivityIndicator size="small" animating={true}/>
    } else if (btnstatus.downloading) {
        console.log(btnstatus.percent)
        return (
            <AnimatedCircularProgress
                size={30}
                width={5}
                fill={btnstatus.percent*100}
                tintColor="#b5a3de"
                backgroundColor="#3d5875" 
            />
        )
    } else {
        return (
            <TouchableOpacity onPress={function() {
                setbtnstatus({loading:true})
                ytdl("https://www.youtube.com/watch?v="+props.videoID, { quality: 'highestaudio' }).then(function(res) {
                    console.log("got yt url")  
                    RNBackgroundDownloader.download({id:"musicdl",url:res[0].url,destination: `${RNBackgroundDownloader.directories.documents}/music/${props.videoID}.webm`,metadata: {}}).begin(function({expectedBytes,headers}) {
                        setbtnstatus({downloading:true})
                      }).progress(percent => {
                        setbtnstatus({percent:percent})
                      }).done(async function() {
                        await AsyncStorage.setItem(props.videoID, JSON.stringify({title:props.song,artist:props.artist,url:`file://${RNBackgroundDownloader.directories.documents}/music/${props.videoID}.webm`}))
                        setbtnstatus({reset:true})
                        console.log('Download is done!')
                        if (Platform.OS === 'ios') {
                          RNBackgroundDownloader.completeHandler("musicdl")
                        }
                      })
                  })
            }}>
                <List.Icon icon="download" />
            </TouchableOpacity>
        )
    }
}