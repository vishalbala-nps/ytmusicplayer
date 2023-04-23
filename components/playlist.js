import { List,Dialog,Button,Text,TextInput } from "react-native-paper"
import AsyncStorage from "@react-native-async-storage/async-storage"
import React from "react"
import { FlatList } from "react-native"
export default function() {
    const [visible, setVisible] = React.useState(false);
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
            <Dialog visible={visible} onDismiss={function() {
                setVisible(false)
            }}>
                <Dialog.Title>New Playlist</Dialog.Title>
                <Dialog.Content>
                    <TextInput label="Playlist Name" style={{backgroundColor:"#322b38"}} mode="outlined" onChangeText={function(t) {
                        ptex.current = t
                    }}/>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={async function() {
                        const ps = await AsyncStorage.getItem("@playlists")
                        let plist = JSON.parse(ps)
                        if (plist === null) {
                            plist = []
                        } else {
                            plist.push(ptex.current)
                        }
                        AsyncStorage.setItem("@playlists",JSON.stringify(plist))
                        setVisible(false)
                    }}>Done</Button>
                </Dialog.Actions>
            </Dialog>
            <List.Item title="Create new Playlist" left={function() {
                return <List.Icon icon="plus" />
            }} onPress={function() {
                setVisible(true)
            }} />
            <FlatList data={plist} keyExtractor={function(item,index) {
                return index
            }} renderItem={function(item) {
                return <List.Item title={item.item} />
            }}/>
        </>
    )
}