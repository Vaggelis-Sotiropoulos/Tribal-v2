import React from 'react';
import { View, Image } from 'react-native';
import styles from './css/styles.css';

const Loading = () => (

  <Image
    source={require('../public/images/recordPlayer.gif')}
    style={[styles.background, { transform: [{ rotate: '270deg' }], width: null, height: null, minHeight: 420 }]}
  />

);

export default Loading;
