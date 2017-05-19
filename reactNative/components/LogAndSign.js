



import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Button,
  TouchableHighlight,
  View
} from 'react-native';

class login extends Component {
  constructor(props) {
    super(props);
  }

  get() {
    fetch('http://localhost:4242/login', {
      method: 'GET'
    }).then ((result) => { console.log(result) }); 
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.title}>Signup/Login below</Text>
        </View>
        <View style={styles.row}>
            <Button 
              style={styles.buttonText} 
              onPress = {this.get.bind(this)}
              title = 'Login with Spotify' />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 30,
    alignSelf: 'center',
    marginBottom: 30
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  inputBox: {
    backgroundColor: 'white',
    borderColor: "#F8F8F8",
    height: 20,
    width: 100,
    textAlign: 'center',
  }
});

export default login;
