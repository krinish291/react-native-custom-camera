import React from 'react';
import {View, StyleSheet} from 'react-native';
import {CameraButton} from './CameraButton';

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const Home = () => {
  const {outer} = styles;

  return (
    <View style={outer}>
      <CameraButton />
    </View>
  );
};

export {Home};
