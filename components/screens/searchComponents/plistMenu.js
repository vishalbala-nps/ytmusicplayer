import { List,Menu } from 'react-native-paper';
import { Alert, TouchableOpacity } from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {YT_SEARCH_API_KEY} from '@env'
import moment from 'moment';

export default function(props) {
    if (props.mstate.playlists === null) {
        return <TouchableOpacity onPress={function() {
            Alert.alert("No Playlists","No playlists have been created yet. Go to Playlists to create one")
        }}><List.Icon icon="plus" /></TouchableOpacity>
    } else {
        return (
            <>
                <Menu
                    visible={props.mstate.visible}
                    onDismiss={function() {
                        props.setmstate({visible:false,playlists:[]})
                    }}
                    anchor={<TouchableOpacity onPress={async function() {
                        const plists = await AsyncStorage.getItem("@playlists")
                        props.setmstate({visible:true,playlists:JSON.parse(plists)})
                    }}><List.Icon icon="plus" /></TouchableOpacity>}>
                        {props.mstate.playlists.map(function(item,index) {
                            return <Menu.Item onPress={function() {
                                props.setload(true)
                                axios.get("https://www.googleapis.com/youtube/v3/videos",{params:{
                                    id:props.song.description,
                                    part: "contentDetails",
                                    key: YT_SEARCH_API_KEY
                                }}).then(async function(d) {
                                    const frstorage = await AsyncStorage.getItem("@"+item)
                                    let nlist = JSON.parse(frstorage)
                                    if (nlist === null) {
                                        nlist = []
                                    }
                                    let nobj = props.song
                                    nobj.duration = moment.duration(d.data.items[0].contentDetails.duration).asSeconds()
                                    nobj.vid = props.song.description
                                    nlist.push(nobj)
                                    await AsyncStorage.setItem("@"+item,JSON.stringify(nlist))
                                    props.setload(false)
                                }).catch(function() {
                                    props.setload(false)
                                    alert("An Error Occured. Please Try again later")
                                })
                            }} title={item} key={index} />
                        })}
                </Menu>
            </>
        )
    }
}