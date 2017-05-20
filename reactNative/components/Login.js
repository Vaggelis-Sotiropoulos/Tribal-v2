import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TouchableHighlight,
  TextInput,
} from 'react-native';
import styles from './css/styles.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  get() {
    fetch('https://tribal-global-mobile.herokuapp.com/login', {
      method: 'GET',
    }).then(result => console.log(result));
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerBar} />
        <View style={styles.header}>
          <Image
            source={require('../public/images/logo.png')}
            style={{ width: '100%', height: '100%' }}
          />
        </View>
        <View style={styles.login}>

          <TextInput
            style={styles.inputBox}
            placeholder="username"
            autoCapitalize="none"
            onChangeText={text => this.setState({ username: text })}
          />

          <TextInput
            style={styles.inputBox}
            secureTextEntry
            placeholder="password"
            onChangeText={text => this.setState({ password: text })}
          />

          <TouchableHighlight
            activeOpacity={1}
            style={styles.loginButton}
            onPress={this.get.bind(this)}
            title="Login with Spotify"
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableHighlight>

        </View>
        <Image
          source={require('../public/images/recordPlayer.gif')}
          style={{ width: '100%', height: 200 }}
        />
        
        <View style={styles.login}>
          <Text></Text>
        </View>
      </View>
    );
  }
}

export default Login;
