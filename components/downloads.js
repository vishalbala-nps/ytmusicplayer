import React from 'react';
import { Alert, FlatList,TouchableOpacity } from 'react-native';
import RNFS from 'react-native-fs'
import RNBackgroundDownloader from '@kesha-antonov/react-native-background-downloader'
import Spinner from 'react-native-loading-spinner-overlay';
import { List } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TrackPlayer from 'react-native-track-player';

export default function() {
    const [loading,setloading] = React.useReducer(function(state,val) {
        if (val.status === "loading") {
          return {loading:true,data:[]}
        } else {
            return {loading:false,data:val.data}
        }
      },{loading:false,data:[]})    
      React.useEffect(function() {
        setloading({status:"loading"})
        RNFS.readDir(`${RNBackgroundDownloader.directories.documents}/music/`).then(function(d) {
            setloading({status:"data",data:d})
        }).catch(function() {
            Alert.alert("No Music","You Don't have any music downloaded yet")
            setloading({data:[]})
        })
    },[])
    const DlLiItem = React.memo(function(props) {
        const [getitem,setitem] = React.useState({title:"",artist:"",url:""})
        React.useEffect(function() {
            AsyncStorage.getItem(props.item.name.replace(".webm","")).then(function(d) {
                setitem(JSON.parse(d))
            })
        },[])
        return <List.Item title={getitem.title} description={getitem.artist} onPress={function() {
            console.log(getitem)
            TrackPlayer.reset().then(function() {
                TrackPlayer.add(getitem)
                TrackPlayer.play()
            })
        }} right={function() {
            return (
                <>
                    <TouchableOpacity onPress={function() {
                        TrackPlayer.add(getitem)
                        TrackPlayer.play()
                    }}>
                        <List.Icon icon="playlist-plus" />
                    </TouchableOpacity>
                </>
            )
        }}/>
    })
    return (
        <>
          <Spinner
            visible={loading.loading}
            textContent={'Please Wait'}
          />
          <FlatList data={loading.data} keyExtractor={function(item,index) {
            return index
          }} renderItem={function(item) {
            return <DlLiItem item={item.item}/>
          }}/>
        </>
    )
}