import React from 'react';
import TrackPlayer from 'react-native-track-player';
import {View,Text, Image, Alert, ToastAndroid} from 'react-native';
import { IconButton,Card,MD3DarkTheme,List } from 'react-native-paper';
import PlayPauseBtn from './playerComponents/playPause.js'
import SeekBar from './playerComponents/seekBar.js'
import { useTrackPlayerEvents,Event } from 'react-native-track-player';
import NoImage from '../../assets/No_Image_Available.jpg'
import DownloadBtn from './searchComponents/downloadBtn.js';
import Modal from "react-native-modal";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { FlatList } from 'react-native-gesture-handler';
import axios from 'axios';
import {YT_SEARCH_API_KEY} from '@env'
import Spinner from 'react-native-loading-spinner-overlay';
import moment, { duration } from 'moment';
export default function({navigation}) {
    const [song,setsong] = React.useState({artwork:Image.resolveAssetSource(NoImage).uri})
    const [addplist, showaddplist] = React.useState({visible:false,playlists:[],loading:false});
    const theme = MD3DarkTheme;
    React.useEffect(function() { 
        TrackPlayer.getCurrentTrack().then(function(no) {
            TrackPlayer.getTrack(no).then(function(ob) {
                setsong(ob)
            })
        })
    },[])
    useTrackPlayerEvents([Event.PlaybackTrackChanged],function(e) {
        if (e.nextTrack === undefined) {
          TrackPlayer.reset()
          navigation.navigate("Search")
        }
      })
    if (song === null) {
        return null
    } else {
        return (
            <>
                <Spinner
                    visible={addplist.loading}
                    textContent={'Please Wait'}
                />
                <Modal useNativeDriver={true} isVisible={addplist.visible} hideModalContentWhileAnimating={true} onBackdropPress={function(params) {
                    showaddplist({visible:false,playlists:[],loading:false})
                }} onBackButtonPress={function() {
                    showaddplist({visible:false,playlists:[],loading:false})
                }}>
                    <View>
                        <Card theme={theme}>
                            <Text />
                            <Text style={{fontSize:25,fontWeight:"bold"}}>  Select Playlist</Text>
                            <Text />
                            <FlatList data={addplist.playlists} keyExtractor={function(item,index) {
                                return index
                            }} renderItem={function(item) {
                                return <List.Item title={item.item} theme={theme} onPress={function() {
                                    showaddplist({visible:addplist.visible,playlists:addplist.playlists,loading:true})
                                    let id;
                                    if (song.description === undefined) {
                                        id = song.vid
                                    } else {
                                        id = song.description
                                    }
                                    axios.get("https://www.googleapis.com/youtube/v3/videos",{params:{
                                        id:id,
                                        part: "contentDetails",
                                        key: YT_SEARCH_API_KEY
                                    }}).then(async function(d) {
                                        const frstorage = await AsyncStorage.getItem("@"+item.item)
                                        let nlist = JSON.parse(frstorage)
                                        if (nlist === null) {
                                            nlist = []
                                        }
                                        let nobj = song
                                        nobj.duration = moment.duration(d.data.items[0].contentDetails.duration).asSeconds()
                                        nobj.description = id
                                        nlist.push(nobj)
                                        await AsyncStorage.setItem("@"+item.item,JSON.stringify(nlist))
                                        showaddplist({visible:false,playlists:addplist.playlists,loading:false})
                                        ToastAndroid.show("Song Added to playlist",ToastAndroid.SHORT)
                                    }).catch(function() {
                                        alert("An error occured please try again")
                                        showaddplist({visible:addplist.visible,playlists:addplist.playlists,loading:false})
                                    })
                                }} /> 
                            }} />
                        </Card>
                    </View>
                </Modal>
                <View style={{alignItems: 'center',width:"100%"}}>
                    <Image style={{width: 200, height: 200}} source={{uri:song.artwork}}/>
                    <Text />
                    <Text style={{fontSize:35,fontWeight:"bold",textAlign:"center"}} numberOfLines={2}>{song.title}</Text>
                    <Text style={{fontSize:20}}>{song.artist}</Text>
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <IconButton
                            icon="skip-backward"
                            size={45}
                            onPress={function() {
                                TrackPlayer.getCurrentTrack().then(function(ind) {
                                const nind = ind-1
                                if (nind >= 0) {
                                    TrackPlayer.skip(nind)
                                }  
                                })
                            }}
                            mode="contained"
                        />
                        <PlayPauseBtn/>
                        <IconButton
                            icon="skip-forward"
                            size={45}
                            onPress={async function() {
                                const ind = await TrackPlayer.getCurrentTrack()
                                const queue = await TrackPlayer.getQueue()
                                const nind = ind+1
                                if (nind < queue.length) {
                                    TrackPlayer.skip(nind)
                                }
                            }}
                            mode="contained"
                        />
                    </View>
                </View>
                <SeekBar />
                <View style={{alignItems:"center",width:"100%"}}>
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <DownloadBtn videoID={song.vid} song={song.title} artist={song.artist} fromplayer={true} />
                        <IconButton size={25} icon="playlist-plus" onPress={async function() {
                            let d = await AsyncStorage.getItem("@playlists")
                            showaddplist({visible:true,playlists:JSON.parse(d),loading:false})
                        }} mode="contained" />
                    </View>
                </View>
            </>
        )
    }
}