import React, {Component} from 'react';
import {View} from 'react-native';

exports.renderSeparator = () => {
  return (
    <View
      style={{
        height: 1,
        width: '100%',
        backgroundColor: '#dcdde1',
      }}
    />
  );
};
