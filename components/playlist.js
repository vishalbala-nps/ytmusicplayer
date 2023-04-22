import { Button } from "react-native-paper"
import AsyncStorage from "@react-native-async-storage/async-storage"
import React from "react"
import TrackPlayer,{Event,useTrackPlayerEvents,State} from "react-native-track-player"
import ytdl from 'react-native-ytdl'
export default function() {
    const songlist = React.useRef([])
    const stopped = React.useRef(false)
    React.useEffect(function() {
        AsyncStorage.getItem("@pl_songs_test").then(function(r) {
            songlist.current = JSON.parse(r)
        }) 
    },[])
    useTrackPlayerEvents([Event.PlaybackTrackChanged,Event.PlaybackQueueEnded,Event.PlaybackError,Event.PlaybackState],async function(e) {
        if (e.type === Event.PlaybackQueueEnded) {
            stopped.current = true
            console.log("Resetting")
            TrackPlayer.reset()
        } else if (e.type === Event.PlaybackState) {
            console.log(e)
        } else if (e.type === Event.PlaybackError) {
            alert("An error occured")
            console.log(e)
        } else {
            let nt = e.nextTrack+1
            let queue = await TrackPlayer.getQueue()
            if (nt < songlist.current.length && queue[nt] === undefined && e.nextTrack !== undefined && stopped.current === false) {
                ytdl(songlist.current[nt].description, { quality: 'highestaudio' }).then(function(res) {
                    console.log("got url adding to queue")
                    let tobj = songlist.current[nt]
                    tobj.url = res[0].url
                    TrackPlayer.add(tobj)
                    TrackPlayer.play()
                })
            }
        } 
    })
    return <Button onPress={function() {
        console.log("getting url for first song")
        stopped.current = false
        ytdl(songlist.current[0].description, { quality: 'highestaudio' }).then(function(res) {
            console.log("got url adding to queue")
            let tobj = songlist.current[0]
            tobj.url = res[0].url
            TrackPlayer.add(tobj)
            TrackPlayer.play()
        })
    }}>Play All</Button>
}