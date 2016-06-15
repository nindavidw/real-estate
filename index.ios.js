/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  NavigatorIOS
} from 'react-native';
import SearchPage from './SearchPage'

class PropertyFinder extends Component {
  render() {
    return (
      <NavigatorIOS
        style={styles.navigator}
        initialRoute={{
          title: 'Property Finder',
          component: SearchPage
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  navigator: {
    flex: 1
  }
});

AppRegistry.registerComponent('PropertyFinder', () => PropertyFinder);
