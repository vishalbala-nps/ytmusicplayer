import { List,Card,Button,TextInput,Text } from "react-native-paper"
import AsyncStorage from "@react-native-async-storage/async-storage"
import React from "react"
import { FlatList,View } from "react-native"
import Modal from "react-native-modal";
import PlistModal from './playlistComponents/plistModal.js'
export default function() {
    const [addplist, showaddplist] = React.useState(false);
    const [plistsongs, showplistsongs] = React.useReducer(function(state,val) {
        if (val.show) {
            return {show:true,plist:val.plist}
        } else {
            return {show:false,plist:""}
        }
    },{show:false,plist:""});
    const [plist,setplist] = React.useState([]) 
    const ptex = React.useRef()
    React.useEffect(function() {
        AsyncStorage.getItem("@playlists").then(function(d) {
            console.log(d)
            setplist(JSON.parse(d))
        })
    },[])
    return (
        <>
            <Modal isVisible={addplist} hideModalContentWhileAnimating={true} onBackdropPress={function(params) {
                showaddplist(false)
            }} showaddplist={function() {
                setaddplist(false)
            }}>
                <View>
                    <Card>
                            <Text />
                            <Text variant="titleLarge">  Add new Playlist</Text>
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
            <PlistModal showstate={plistsongs} setshowstate={showplistsongs} />
            <List.Item title="Create new Playlist" left={function() {
                return <List.Icon icon="plus" />
            }} onPress={function() {
                showaddplist(true)
            }} />
            <FlatList data={plist} keyExtractor={function(item,index) {
                return index
            }} renderItem={function(item) {
                return <List.Item title={item.item} onPress={function() {
                    showplistsongs({show:true,plist:item.item})
                }} />
            }}/>
        </>
    )
}