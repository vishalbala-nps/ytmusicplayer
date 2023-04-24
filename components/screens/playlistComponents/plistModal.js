import {Card,List,Text} from 'react-native-paper'
import {View} from 'react-native'
import Modal from "react-native-modal";
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-gesture-handler';
export default function(props) {
    const [plistsongs,setplistsongs] = React.useState([])
    React.useEffect(function() {
        AsyncStorage.getItem("@"+props.showstate.plist).then(function(d) {
            setplistsongs(JSON.parse(d))
        })
    },[])
    return (
        <Modal isVisible={props.showstate.show} hideModalContentWhileAnimating={true} onBackdropPress={function(params) {
            props.setshowstate({show:false})
        }} showaddplist={function() {
            props.setshowstate({show:false})
        }}>
            <View>
                <Card>
                        <Text />
                        <Text variant="titleLarge">  {props.showstate.plist}</Text>
                        <Text />
                        <FlatList data={plistsongs} keyExtractor={function(item,index) {
                            return index
                        }} renderItem={function(item) {
                            return <List.Item title={item.item.title}  />
                        }}/>
                    </Card>
            </View>
        </Modal>
    )
}