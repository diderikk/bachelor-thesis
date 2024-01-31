/**
 * @format
 */
import '@ethersproject/shims';
import { AppRegistry } from 'react-native';
import 'react-native-get-random-values';
import 'text-encoding';
import { name as appName } from './app.json';
import './shim';
import AppWrapper from './src/AppWrapper';


AppRegistry.registerComponent(appName, () => AppWrapper);
