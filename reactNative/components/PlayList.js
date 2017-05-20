import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Text,
  View,
  Image,
  ScrollView,
  Picker,
} from 'react-native';
import styles from './css/styles.css';
import Loading from './Loading';
import SongListEntry from './SongListEntry';

//   isFetching, message, songs, _onChangeText, _onSearch, _addSong, _removeSong,
// }) =>

class PlayList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPlayList: '',
    };
  }

  render() {
    const { message, isFetching, songs, _addSong, _removeSong, playlist } = this.props;
    const isEmpty = songs.length === 0;

    return (
      <View style={styles.container}>

        <View style={styles.headerBar} />

        <View style={styles.header}>
          <Image
            source={require('../public/images/logo.png')}
            style={{ width: '100%', height: '100%' }}
          />
        </View>

        <Image source={require('../public/images/recordPlayer.jpg')} style={styles.playlistBackground}>
          <ScrollView style={{ flex: 1 }}>
            {isEmpty                                                //eslint-disable-line
              ? (isFetching ? <Loading /> : null)
              : playlist.map(song => (
                <SongListEntry
                  key={song.uri}
                  song={song}
                  _addSong={_addSong}
                  _removeSong={_removeSong}
                />
              ))}
          </ScrollView>

          {message !== '' &&
            <View style={styles.messageBox}>
              <Text style={styles.message}>{message}</Text>
            </View>
          }
        </Image>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { songsByQuery, currentQuery, playlist } = state;
  const {
    isFetching,
    lastUpdated,
    songs,
  } = songsByQuery[currentQuery] || {
    isFetching: false,
    songs: [],
  };

  return {
    currentQuery,
    songs,
    isFetching,
    lastUpdated,
    playlist,
  };
};

export default connect(mapStateToProps)(PlayList);
