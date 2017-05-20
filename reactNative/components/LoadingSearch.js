import React from 'react';
import { View, Text, Image } from 'react-native';

import styles from './css/styles.css';

const LoadingSearch = () => (
  <Image source={require('../public/images/recordPlayer.jpg')} style={styles.background}>
    <View>
      <Text style={{
        fontFamily: 'Barrio',
        marginTop: 350,
        marginLeft: 175,
        fontSize: 60,
      }}
      >Tribal
      </Text>
    </View>
  </Image>
);

export default LoadingSearch;
