import React, {useEffect, useState} from 'react';
import {
  PermissionsAndroid,
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {useCamera} from 'react-native-camera-hooks';
import CameraRoll from '@react-native-community/cameraroll';
import RNFS from 'react-native-fs';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Gallery} from './Gallery';
import {height, width} from './Helper/helper';

const styles = StyleSheet.create({
  preview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  flex: {
    flex: 1,
  },
  container: {
    position: 'absolute',
    left: 0,
    bottom: 130,
    flex: 1,
  },
  centerItem: {
    alignItems: 'center',
  },
  upIconStyle: {
    fontSize: 15,
    color: '#fff',
    marginBottom: 10,
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
  swipeView: {
    position: 'absolute',
    height: height,
    width: width,
    top: 0,
  },
});

const Camera = () => {
  const [{cameraRef}, {takePicture}] = useCamera(null);
  const [nodes, setNodes] = useState([]);
  const [gallery, setGallery] = useState(false);
  const [endCursor, setEndCursor] = useState(0);
  let touchY = '';
  let touchX = '';
  const {
    preview,
    flex,
    container,
    centerItem,
    upIconStyle,
    rowStyle,
    imageStyle,
    circleIcon,
    circleIconOuter,
    swipeView,
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

  const checkPermission = async () => {
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );
    console.log(hasPermission);

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'I Need Permission Bro',
        message: 'I Need Permission Bro Only access your photo',
        buttonPositive: 'Ok',
      },
    );

    if (status === 'granted') {
      await getPhoto();
    }
  };

  useEffect(() => {
    setTimeout(() => {
      checkPermission();
    }, 2000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPhoto = async () => {
    const photo = await CameraRoll.getPhotos({
      first: 20,
      assetType: 'Photos',
    });
    setEndCursor(photo.page_info.end_cursor);
    setNodes(photo?.edges.map(edge => edge.node));
  };

  const goBack = () => {
    setGallery(false);
  };

  const loadMore = async () => {
    const photo = await CameraRoll.getPhotos({
      first: 20,
      after: endCursor,
      assetType: 'Photos',
    });
    setEndCursor(photo.page_info.end_cursor);
    setNodes([...nodes, ...photo?.edges?.map(edge => edge.node)]);
  };
  console.log('nodes', nodes.length);

  const renderModal = () => {
    return <Gallery nodes={nodes} goBack={goBack} onEndReached={loadMore} />;
  };

  const onTouchEnd = e => {
    const x = touchX - e.nativeEvent.pageX;
    const y = touchY - e.nativeEvent.pageY;
    if (x === y) {
      return;
    }
    if (touchY - e.nativeEvent.pageY > 100) {
      console.log('swipe up');
      setGallery(true);
    } else {
      console.log('else');
      setGallery(false);
    }
  };

  return (
    <View style={flex}>
      <RNCamera
        ref={cameraRef}
        // type={RNCamera.Constants.Type.back}
        // flashMode={RNCamera.Constants.FlashMode.on}
        style={preview}>
        <View
          onTouchStart={e => {
            touchY = e.nativeEvent.pageY;
            touchX = e.nativeEvent.pageX;
          }}
          onTouchEnd={onTouchEnd}
          style={swipeView}
        />
        <View style={container}>
          {(nodes?.length && (
            <TouchableOpacity
              style={centerItem}
              onPress={() => {
                setGallery(true);
                console.log('swipeup');
              }}>
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
      <Modal visible={gallery} transparent={true}>
        {renderModal()}
      </Modal>
    </View>
  );
};

export {Camera};
