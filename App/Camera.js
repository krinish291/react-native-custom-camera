import React, {useEffect, useState} from 'react';
import {
  PermissionsAndroid,
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {useCamera} from 'react-native-camera-hooks';
import CameraRoll from '@react-native-community/cameraroll';
import RNFS from 'react-native-fs';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';

const styles = StyleSheet.create({
  preview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  flex: {
    flex: 1,
  },
  buttonStyle: {
    position: 'absolute',
    left: 0,
    bottom: 130,
  },
  centerItem: {
    alignItems: 'center',
  },
  upIconStyle: {
    fontSize: 15,
    color: '#fff',
  },
  rowStyle: {
    flexDirection: 'row',
  },
  imageStyle: {
    width: 90,
    height: 90,
  },
  circleIconOuter: {
    marginBottom: 30,
  },
  circleIcon: {
    fontSize: 85,
    color: '#fff',
  },
});

const Camera = () => {
  const [{cameraRef}, {takePicture}] = useCamera(null);
  const {
    preview,
    flex,
    buttonStyle,
    centerItem,
    upIconStyle,
    rowStyle,
    imageStyle,
    circleIcon,
    circleIconOuter,
  } = styles;

  const captureHandler = async () => {
    try {
      const data = await takePicture();
      const filePath = data.uri;
      const newFilePath = RNFS.ExternalCachesDirectoryPath + '/abc.jpg';
      await RNFS.moveFile(filePath, newFilePath).then(() => {
        console.log('Image', newFilePath);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [nodes, setNodes] = useState([]);

  const checkPermission = async () => {
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'I Need Permission Bro',
        message: 'I Need Permission Bro Only access your photo',
        buttonPositive: 'Ok',
      },
    );

    return status === 'granted';
  };

  useEffect(() => {
    checkPermission().then(() => {
      getPhoto();
    });
  }, []);

  const getPhoto = async () => {
    const photo = await CameraRoll.getPhotos({
      first: 10,
    });
    setNodes(photo?.edges.map(edge => edge.node));
  };

  return (
    <View style={flex}>
      <RNCamera
        ref={cameraRef}
        type={RNCamera.Constants.Type.back}
        style={preview}>
        <View style={buttonStyle}>
          {(nodes?.length && (
            <TouchableOpacity style={centerItem}>
              <AntDesign name="up" style={upIconStyle} />
            </TouchableOpacity>
          )) ||
            null}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={rowStyle}>
              {nodes?.map((e, i) => (
                <TouchableOpacity key={i}>
                  <Image source={{uri: e.image.uri}} style={imageStyle} />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
        <TouchableOpacity style={circleIconOuter} onPress={captureHandler}>
          <Feather name="circle" style={circleIcon} />
        </TouchableOpacity>
      </RNCamera>
    </View>
  );
};

export {Camera};
