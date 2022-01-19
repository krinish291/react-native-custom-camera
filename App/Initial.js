import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: '#FA6650',
    alignItems: 'center',
    marginHorizontal: 20,
    borderRadius: 3,
  },
  outer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    padding: 10,
    color: '#fff',
  },
});

const Home = () => {
  const navigation = useNavigation();
  const {buttonStyle, outer, textStyle} = styles;

  return (
    <View style={outer}>
      <TouchableOpacity
        style={buttonStyle}
        onPress={() => navigation.navigate('Camera')}>
        <Text style={textStyle}>Go to Camera</Text>
      </TouchableOpacity>
    </View>
  );
};

export {Home};
