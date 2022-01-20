import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const CameraButton = () => {
  const navigation = useNavigation();
  const {buttonStyle, textStyle} = styles;

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={() => navigation.navigate('Camera')}>
      <Text style={textStyle}>Go to Camera</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: '#FA6650',
    alignItems: 'center',
    marginHorizontal: 20,
    borderRadius: 3,
  },
  textStyle: {
    padding: 10,
    color: '#fff',
  },
});

export {CameraButton};
