import { List,Card,Button,TextInput,Text } from "react-native-paper"
import AsyncStorage from "@react-native-async-storage/async-storage"
import React from "react"
import { FlatList,View,TouchableOpacity,Keyboard } from "react-native"
import Modal from "react-native-modal";
import ytdl from 'react-native-ytdl'
import TrackPlayer,{useTrackPlayerEvents,Event} from "react-native-track-player";
import Spinner from 'react-native-loading-spinner-overlay';

export default function({route,navigation}) {
    const [addplist, showaddplist] = React.useState(false);
    const [plistdetails, showplistdetails] = React.useReducer(function(state,val) {
        if (val.show) {
            return {show:true,plist:val.plist,loading:false}
        } else if (val.loading) {
            return {show:false,plist:state.plist,loading:true}
        } else {
            return {show:false,plist:state.plist,loading:false}
        }
    },{show:false,plist:{name:"",songs:[]},loading:false});
    const [plist,setplist] = React.useState([]) 
    const ptex = React.useRef()
    const startindex = React.useRef(0)
    React.useEffect(function() {
        AsyncStorage.getItem("@playlists").then(function(d) {
            setplist(JSON.parse(d))
        })
    },[])
    useTrackPlayerEvents([Event.PlaybackTrackChanged,Event.PlaybackQueueEnded,Event.PlaybackError],async function(e) {
        if (e.type === Event.PlaybackQueueEnded) {
            route.params.pliststopped.current = true
            TrackPlayer.reset()
        } else if (e.type === Event.PlaybackError) {
            let queue = await TrackPlayer.getQueue()
            alert("An error occured. Message "+e.message+"\nMusic JSON: "+JSON.stringify(queue))
        } else {
            let nt = e.nextTrack+startindex.current+1
            let queue = await TrackPlayer.getQueue()
            let tobj = plistdetails.plist.songs[nt]
            if (nt < plistdetails.plist.songs.length && queue[nt] === undefined && e.nextTrack !== undefined && route.params.pliststopped.current === false) {
                if (plistdetails.plist.songs[nt].url.startsWith("file://")) {
                    TrackPlayer.add(tobj).then(function() {
                        TrackPlayer.play()
                    })
                } else {
                    ytdl(plistdetails.plist.songs[nt].description, { quality: 'highestaudio' }).then(function(res) {
                        tobj.url = res[0].url
                        TrackPlayer.add(tobj)
                        TrackPlayer.play()
                    }).catch(function() {
                        alert("An Error Occured. Please Try again later")
                        route.params.pliststopped.current = true
                    })
                }
            }
        } 
    })
    function renderSongItem(item) {
        return <List.Item title={item.item.title} onPress={function() {
            TrackPlayer.reset().then(function() {
                route.params.pliststopped.current = true
                startindex.current = item.index
                let tobj = plistdetails.plist.songs[item.index]
                if (tobj.url.startsWith("file://")) {
                    showplistdetails({loading:true})
                    TrackPlayer.add(tobj).then(function() {
                        TrackPlayer.play().then(function() {
                            route.params.pliststopped.current = false
                            showplistdetails({show:false})  
                        })
                    }).catch(function() {
                        alert("An Error Occured. Please Try again later")
                        showplistdetails({show:false})
                    })
                } else {
                    showplistdetails({loading:true})
                    ytdl(tobj.description, { quality: 'highestaudio' }).then(function(res) {
                        tobj.url = res[0].url
                        TrackPlayer.add(tobj)
                        TrackPlayer.play()
                        route.params.pliststopped.current = false
                        showplistdetails({show:false})
                    }).catch(function() {
                        alert("An Error Occured. Please Try again later")
                        showplistdetails({show:false})
                    })   
                }        
            })
        }} right={function() {
            return (
                <View style={{flexDirection:"row", gap: 10}}>
                    <View />
                    {item.item.url.startsWith("file://") &&
                    <List.Icon icon="sd" />
                    }
                    <TouchableOpacity onPress={async function() {
                        const ps = await AsyncStorage.getItem("@"+plistdetails.plist.name)
                        let nplist = JSON.parse(ps)
                        nplist.splice(item.index,1)
                        await AsyncStorage.setItem("@"+plistdetails.plist.name,JSON.stringify(nplist))
                        showplistdetails({show:false})
                    }}>
                        <List.Icon icon="delete" />
                    </TouchableOpacity>
                </View>
            )
        }} />
    }
    function renderItem(item) {
        return <List.Item title={item.item} onPress={function() {
            AsyncStorage.getItem("@"+item.item).then(function(d) {
                showplistdetails({show:true,plist:{name:item.item,songs:JSON.parse(d)}})
            })
        }} right={function() {
            return (<TouchableOpacity onPress={async function() {
                let nplist = [...plist]
                nplist.splice(item.index,1)
                setplist(nplist)
                await AsyncStorage.setItem("@playlists",JSON.stringify(nplist))
                AsyncStorage.removeItem("@"+item.item)
            }}>
                <List.Icon icon="delete" />
            </TouchableOpacity>)
        }} />
    }
    return (
        <>
            <Spinner
                visible={plistdetails.loading}
                textContent={'Please Wait'}
            />
            <Modal useNativeDriver={true} isVisible={plistdetails.show} hideModalContentWhileAnimating={true} onBackdropPress={function(params) {
                showplistdetails({show:false})
            }} showaddplist={function() {
                showplistdetails({show:false})
            }}>
                <View>
                    <Card>
                            <Text />
                            <Text style={{fontSize:25,fontWeight:"bold"}}>  {plistdetails.plist.name}</Text>
                            <Text />
                            <FlatList data={plistdetails.plist.songs} keyExtractor={function(item,index) {
                                return index
                            }} renderItem={renderSongItem}/>
                        </Card>
                </View>
            </Modal>
            <Modal useNativeDriver={true} isVisible={addplist} hideModalContentWhileAnimating={true} onBackdropPress={function(params) {
                showaddplist(false)
            }} showaddplist={function() {
                setaddplist(false)
            }}>
                <View>
                    <Card>
                            <Text />
                            <Text style={{fontSize:25,fontWeight:"bold"}}>  Add new Playlist</Text>
                            <Text />
                            <TextInput
                                onChangeText={function(t) {
                                    ptex.current = t
                                }}
                                placeholder={'Enter text'}
                            />
                            <Text />
                            <View style={{flexDirection:"row-reverse"}}>
                                <Button style={{width:"30%"}} onPress={async function() {
                                    Keyboard.dismiss()
                                    const ps = await AsyncStorage.getItem("@playlists")
                                    let nplist = JSON.parse(ps)
                                    if (nplist === null) {
                                        nplist = []
                                    }
                                    nplist.push(ptex.current)
                                    AsyncStorage.setItem("@playlists",JSON.stringify(nplist))
                                    setplist(nplist)
                                    showaddplist(false)
                                }}> Submit</Button>
                            </View>
                            <Text />
                        </Card>
                </View>
            </Modal>
            <List.Item title="Create new Playlist" left={function() {
                return <List.Icon icon="plus" />
            }} onPress={function() {
                showaddplist(true)
            }} />
            <FlatList data={plist} keyExtractor={function(item,index) {
                return index
            }} renderItem={renderItem}/>
        </>
    )
}