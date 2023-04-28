import React from 'react';
import { Alert, FlatList,TouchableOpacity,View } from 'react-native';
import RNFS from 'react-native-fs'
import RNBackgroundDownloader from '@kesha-antonov/react-native-background-downloader'
import Spinner from 'react-native-loading-spinner-overlay';
import { List } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TrackPlayer from 'react-native-track-player';

export default function({route,navigation}) {
    const [loading,setloading] = React.useReducer(function(state,val) {
        if (val.status === "loading") {
          return {loading:true,data:[]}
        } else {
            return {loading:false,data:val.data}
        }
      },{loading:false,data:[]})    
      React.useEffect(function() {
        setloading({status:"loading"})
        readStorage()
    },[])
    function readStorage() {
        setloading({status:"loading"})
        RNFS.readDir(`${RNBackgroundDownloader.directories.documents}/music/`).then(function(d) {
            setloading({status:"data",data:d})
        }).catch(function() {
            Alert.alert("No Music","You Don't have any music downloaded yet")
            setloading({data:[]})
        })
    }
    const DlLiItem = React.memo(function({item}) {
        const [getitem,setitem] = React.useState({title:"Loading...",artist:"Please Wait",url:"",artwork:""})
        React.useEffect(function() {
            AsyncStorage.getItem(item.item.name.replace(".webm","")).then(function(d) {
                if (d === null ) {
                    setitem({title:item.item.name,artist:"",url:`file://${RNBackgroundDownloader.directories.documents}/music/${item.item.name}`,artwork:""})
                } else {
                    setitem(JSON.parse(d))
                }
            })
        },[])
        return <List.Item title={getitem.title} description={getitem.artist} onPress={function() {
            route.params.pliststopped.current = true
            TrackPlayer.reset().then(function() {
                TrackPlayer.add(getitem)
                TrackPlayer.play()
            })
        }} right={function() {
            return (
                <View style={{flexDirection:"row", gap: 10}}>
                    <View />
                    <TouchableOpacity onPress={async function() {
                        const s = await TrackPlayer.getState()
                        if (s === "idle") {
                            route.params.pliststopped.current = true
                            await TrackPlayer.reset()
                        }
                        TrackPlayer.add(getitem)
                        TrackPlayer.play()
                    }}>
                        <List.Icon icon="playlist-plus" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={function() {
                        RNFS.unlink(getitem.url)
                        AsyncStorage.removeItem(getitem.description)
                        readStorage()
                    }}>
                        <List.Icon icon="delete" />
                    </TouchableOpacity>
                </View>
            )
        }}/>
    })
    function renderItem(item) {
        return <DlLiItem item={item}/>
    }
    return (
        <>
          <Spinner
            visible={loading.loading}
            textContent={'Please Wait'}
          />
          <FlatList data={loading.data} keyExtractor={function(item,index) {
            return index
          }} renderItem={renderItem}/>
        </>
    )
}