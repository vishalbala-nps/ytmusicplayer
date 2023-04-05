/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import setupduration from 'moment-duration-format'
import moment from 'moment';
setupduration(moment)
AppRegistry.registerComponent(appName, () => App);
