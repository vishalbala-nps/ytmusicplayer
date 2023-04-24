import { List,Card,Button,TextInput,Text } from "react-native-paper"
import AsyncStorage from "@react-native-async-storage/async-storage"
import React from "react"
import { FlatList,View } from "react-native"
import Modal from "react-native-modal";

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
            <Modal isVisible={visible} hideModalContentWhileAnimating={true} onBackdropPress={function(params) {
                setVisible(false)
            }} onBackButtonPress={function() {
                setVisible(false)
            }}>
                <View >
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
                                    setVisible(false)
                                }}> Submit</Button>
                            </View>
                            <Text />
                        </Card>
                </View>
            </Modal>
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