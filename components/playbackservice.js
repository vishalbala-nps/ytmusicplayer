import TrackPlayer from 'react-native-track-player';
import { Event } from 'react-native-track-player';

export default PlaybackService = async function() {
    TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
    TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
    TrackPlayer.addEventListener(Event.RemoteNext, async function() {
        const ind = await TrackPlayer.getCurrentTrack()
        const queue = await TrackPlayer.getQueue()
        const nind = ind+1
        if (nind < queue.length) {
            await TrackPlayer.skip(nind)
            TrackPlayer.play()
        }
    });
    TrackPlayer.addEventListener(Event.RemotePrevious, async function() {
        const ind = await TrackPlayer.getCurrentTrack()
        const nind = ind-1
        if (nind >= 0) {
            await TrackPlayer.skip(nind)
            TrackPlayer.play()
        }  
    })
};