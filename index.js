/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import setupduration from 'moment-duration-format'
import moment from 'moment';
import PlaybackService from './components/playbackservice.js';
import TrackPlayer from 'react-native-track-player';

setupduration(moment)
AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => PlaybackService);