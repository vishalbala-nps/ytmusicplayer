import {Card,List,Text} from 'react-native-paper'
import {View,FlatList} from 'react-native'
import Modal from "react-native-modal";
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default React.memo(function(props) {
    const [plist,setplist] = React.useState([])
    React.useEffect(function() {
        AsyncStorage.getItem("@playlists").then(function(d) {
            setplist(JSON.parse(d))
        })
    },[props.modal.show])
    return (
        <Modal isVisible={props.modal.show} hideModalContentWhileAnimating={true} onBackdropPress={function(params) {
            props.setmodal({show:false})
        }} showaddplist={function() {
            props.setmodal({show:false})
        }}>
            <View>
                <Card>
                        <Text />
                        <Text variant="titleLarge">  hi</Text>
                        <FlatList data={plist} useNativeDriver={true} keyExtractor={function(item,index) {
                            return index
                        }} renderItem={function(item) {
                            return <List.Item title={item.item} onPress={async function() {
                                const frstorage = await AsyncStorage.getItem("@"+item.item)
                                let nlist = JSON.parse(frstorage)
                                if (nlist === null) {
                                    nlist = []
                                }
                                nlist.push(props.modal.song)
                                await AsyncStorage.setItem("@"+item.item,JSON.stringify(nlist))
                                props.setmodal({show:false})
                            }} />
                        }}/>
                    </Card>
            </View>
        </Modal>
    )
})