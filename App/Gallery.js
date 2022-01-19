import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import {height, width} from './Helper/helper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height,
    width: width,
    backgroundColor: '#fff',
  },
  imageOuter: {
    width: width / 3,
    height: width / 3,
  },
  header: {
    height: 60,
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 20,
  },
  titleText: {
    flex: 1,
    textAlign: 'center',
    marginRight: 50,
    fontSize: 20,
  },
});

const Gallery = ({nodes, goBack, onEndReached}) => {
  const {imageOuter, container, header, titleText} = styles;

  const renderItem = ({item}) => {
    return (
      <View style={imageOuter}>
        <Image source={{uri: `${item?.image?.uri}`}} style={imageOuter} />
      </View>
    );
  };

  return (
    <View style={container}>
      <View style={header}>
        <TouchableOpacity onPress={goBack}>
          <Text>Back</Text>
        </TouchableOpacity>
        <Text style={titleText}>Gallery</Text>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'always'}
        keyboardDismissMode="on-drag"
        data={nodes}
        onEndReached={onEndReached}
        renderItem={renderItem}
        numColumns={3}
        contentContainerStyle={[
          {paddingBottom: 10},
          !nodes.length && {flexGrow: 1},
        ]}
        keyExtractor={(item, i) => `${i}`}
      />
    </View>
  );
};

export {Gallery};
