import React from 'react';
import { View, Image } from 'react-native';

import styles from './css/styles.css';

const LoadingSearch = () => (
  <View style={styles.loadingSearch}>
    <View>
      <Image source={require('../public/images/caleb.png')} />
      <Image source={require('../public/images/carlo.png')} />
    </View>
    <View>
      <Image source={require('../public/images/vaggelis.png')} />
    </View>
  </View>
);

export default LoadingSearch;
