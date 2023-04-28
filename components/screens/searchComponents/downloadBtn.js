import React from 'react';
import { TouchableOpacity,Image } from 'react-native';
import { List,ActivityIndicator } from 'react-native-paper';
import RNBackgroundDownloader from '@kesha-antonov/react-native-background-downloader'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import getDurationAndURL from './getDurationAndURL.js';
import moment from 'moment';

export default function(props) {
    const [btnstatus,setbtnstatus] = React.useReducer(function(state,val) {
        if (val.loading) {
            return {loading:true,downloading:false,percent:0,complete:false}
        } else if (val.downloading) {
            return {loading:false,downloading:true,percent:0,complete:false}
        } else if (val.percent !== undefined) {
            return {loading:false,downloading:true,percent:val.percent,complete:false} 
        } else if (val.complete) {
            return {loading:false,downloading:false,percent:1,complete:true} 
        } else {
            return {loading:false,downloading:false,percent:0,complete:false}
        }
    },{loading:false,downloading:false,percent:0,complete:false})
    const imgloc = React.useRef()
    React.useEffect(function() {
       imgloc.current = Image.resolveAssetSource(require("../../../assets/vinyl.png")).uri 
    },[])
    if (btnstatus.loading) {
        return <ActivityIndicator size="small" animating={true}/>
    } else if (btnstatus.downloading) {
        return (
            <AnimatedCircularProgress
                size={30}
                width={5}
                fill={btnstatus.percent*100}
                tintColor="#b5a3de"
                backgroundColor="#3d5875" 
            />
        )
    } else if (btnstatus.complete) {
        return <TouchableOpacity><List.Icon icon="check" /></TouchableOpacity>
    } else {
        return (
            <TouchableOpacity onPress={function() {
                setbtnstatus({loading:true})
                getDurationAndURL(props.videoID).then(function(res) {
                    RNBackgroundDownloader.download({id:props.videoID,url:res[1][0].url,destination: `${RNBackgroundDownloader.directories.documents}/music/${props.videoID}.webm`,metadata: {}}).begin(function({expectedBytes,headers}) {
                        setbtnstatus({downloading:true})
                      }).progress(percent => {
                        setbtnstatus({percent:percent})
                      }).done(async function() {
                        await AsyncStorage.setItem(props.videoID, JSON.stringify({title:props.song,artist:props.artist,url:`file://${RNBackgroundDownloader.directories.documents}/music/${props.videoID}.webm`,artwork:imgloc.current,duration:parseInt(moment.duration(res[0].data.items[0].contentDetails.duration).asSeconds()),description:props.videoID}))
                        setbtnstatus({complete:true})
                        if (Platform.OS === 'ios') {
                          RNBackgroundDownloader.completeHandler(props.videoID)
                        }
                      }).error(function() {
                        setbtnstatus({loading:false})
                        alert("An Error Occured. Please Try again later")
                      })
                  }).catch(function(e) {
                    setbtnstatus({loading:false})
                    alert("An Error Occured. Please Try again later")
                  })
            }}>
                <List.Icon icon="download" />
            </TouchableOpacity>
        )
    }
}