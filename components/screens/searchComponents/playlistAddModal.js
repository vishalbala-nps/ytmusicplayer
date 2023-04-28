import {Card,List,Text} from 'react-native-paper'
import {View,FlatList} from 'react-native'
import Modal from "react-native-modal";
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {YT_SEARCH_API_KEY} from '@env'
import moment from 'moment';
export default React.memo(function(props) {
    const [plist,setplist] = React.useState([])
    React.useEffect(function() {
        AsyncStorage.getItem("@playlists").then(function(d) {
            setplist(JSON.parse(d))
        })
    },[props.modal.show])
    function renderLitem(item) {
        return <List.Item title={item.item} onPress={function() {
            props.setmodal({show:false})
            props.setload(true)
            axios.get("https://www.googleapis.com/youtube/v3/videos",{params:{
                id:props.modal.song.ytvid,
                part: "contentDetails",
                key: YT_SEARCH_API_KEY
            }}).then(async function(d) {
                const frstorage = await AsyncStorage.getItem("@"+item.item)
                let nlist = JSON.parse(frstorage)
                if (nlist === null) {
                    nlist = []
                }
                let nobj = props.modal.song
                nobj.duration = moment.duration(d.data.items[0].contentDetails.duration).asSeconds()
                nlist.push(nobj)
                await AsyncStorage.setItem("@"+item.item,JSON.stringify(nlist))
                props.setload(false)
            }).catch(function() {
                props.setload(false)
                alert("An Error Occured. Please Try again later")
              })
        }} />
    }
    return (
        <Modal isVisible={props.modal.show} hideModalContentWhileAnimating={true} onBackdropPress={function(params) {
            props.setmodal({show:false})
        }} showaddplist={function() {
            props.setmodal({show:false})
        }}>
            <View>
                <Card>
                        <Text />
                        <Text variant="titleLarge">  Add to Playlist</Text>
                        <FlatList data={plist} useNativeDriver={true} keyExtractor={function(item,index) {
                            return index
                        }} renderItem={renderLitem}/>
                    </Card>
            </View>
        </Modal>
    )
})