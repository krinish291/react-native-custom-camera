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
import {useNavigation} from '@react-navigation/native';
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
  marginHZ: {
    marginHorizontal: 50,
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
    zIndex: 20,
  },
  imageStyle: {
    width: 90,
    height: 90,
  },
  circleIconOuter: {
    zIndex: 20,
    marginBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  circleIcon: {
    fontSize: 85,
    color: '#fff',
  },
  flashIcon: {
    fontSize: 30,
    color: '#fff',
  },
  repeatIcon: {
    fontSize: 30,
    color: '#fff',
  },
  swipeView: {
    position: 'absolute',
    height: height / 1.5,
    width: width,
    top: 0,
    zIndex: 10,
  },
  closeStyle: {
    position: 'absolute',
    top: 50,
    left: 50,
    zIndex: 20,
  },
});

const Camera = () => {
  const [{cameraRef}, {takePicture}] = useCamera(null);
  const [nodes, setNodes] = useState([]);
  const navigation = useNavigation();
  const [gallery, setGallery] = useState(false);
  const [isFlash, setIsFlash] = useState(false);
  const [endCursor, setEndCursor] = useState(0);
  const [isFront, setIsFront] = useState(false);
  let touchY = '';
  let touchX = '';
  const {
    preview,
    flex,
    container,
    closeStyle,
    centerItem,
    upIconStyle,
    rowStyle,
    imageStyle,
    circleIcon,
    flashIcon,
    repeatIcon,
    circleIconOuter,
    swipeView,
    marginHZ,
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
        type={RNCamera.Constants.Type[isFront ? 'front' : 'back']}
        flashMode={RNCamera.Constants.FlashMode[isFlash ? 'on' : 'off']}
        style={preview}>
        <View
          onTouchStart={e => {
            touchY = e.nativeEvent.pageY;
            touchX = e.nativeEvent.pageX;
          }}
          onTouchEnd={onTouchEnd}
          style={swipeView}
        />
        <TouchableOpacity
          style={closeStyle}
          onPress={() => {
            navigation.goBack();
          }}>
          <Feather name="x" style={repeatIcon} />
        </TouchableOpacity>
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
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    console.log(e);
                  }}>
                  <Image source={{uri: e.image.uri}} style={imageStyle} />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
        <View style={circleIconOuter}>
          <TouchableOpacity
            onPress={() => {
              setIsFlash(!isFlash);
            }}>
            <Feather name={(isFlash && 'zap') || 'zap-off'} style={flashIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={captureHandler} style={marginHZ}>
            <Feather name="circle" style={circleIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setIsFront(!isFront);
            }}>
            <Feather name="repeat" style={repeatIcon} />
          </TouchableOpacity>
        </View>
      </RNCamera>
      <Modal visible={gallery} transparent={true}>
        {renderModal()}
      </Modal>
    </View>
  );
};

export {Camera};
