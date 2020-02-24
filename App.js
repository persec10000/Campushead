/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import NavigationScreen from './navigation/appnavigation';
import FlashMessage from 'react-native-flash-message';
import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {MenuProvider} from 'react-native-popup-menu';

import {Provider} from 'react-redux';
import configureStore from './redux/store/configureStore';

const store = configureStore ();

export default class App extends Component {
  constructor (props) {
    super (props);
    Icon.loadFont ();
    console.disableYellowBox = true;
  }
  render () {
    return (
      <Provider store={store}>
        <MenuProvider>
          <View style={{flex: 1}}>
            <NavigationScreen />
            <FlashMessage position="top" animated={true} autoHide={true} />
          </View>
        </MenuProvider>
      </Provider>
    );
  }
}

const styles = StyleSheet.create ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
