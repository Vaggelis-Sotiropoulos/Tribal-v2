import React from 'react';
import { connect } from 'react-redux';

import {
  Text,
  View,
  TextInput,
  Image,
  ScrollView,
  TouchableHighlight,
} from 'react-native';
import styles from './css/styles.css';
import Loading from './Loading';
import SongListEntry from './SongListEntry';
import LoadingSearch from './LoadingSearch';

const Search = ({
  isFetching, message, songs, _onChangeText, _onSearch, _addSong, _removeSong,
}) => (
  <View style={styles.container}>

    <View style={styles.headerBar} />

    <View style={styles.header}>
      <Image
        source={require('../public/images/logo.png')}
        style={{ width: '100%', height: '100%' }}
      />
    </View>

    <View style={styles.textInput} >
      <TextInput
        style={styles.searchInputBox}
        placeholder="Search songs or artist"
        onChangeText={_onChangeText}
      />
      <TouchableHighlight
        activeOpacity={1}
        style={styles.button}
        onPress={_onSearch}
      >
        <Text style={styles.buttonText}>Search</Text>
      </TouchableHighlight>
    </View>

    {(songs.length === 0)                                                //eslint-disable-line
      ? (isFetching ? <Loading /> : <LoadingSearch />)
      : <ScrollView style={{ flex: 3, backgroundColor: '#282828' }}>
        {songs.map(song => (
          <SongListEntry
            key={song.uri}
            song={song}
            _addSong={_addSong}
            _removeSong={_removeSong}
          />
        ))}
      </ScrollView>
    }

    {message !== '' &&
      <View style={styles.messageBox}>
        <Text style={styles.message}>{message}</Text>
      </View>
    }
  </View>
);

const mapStateToProps = (state) => {
  const { songsByQuery, currentQuery } = state;
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
  };
};

export default connect(mapStateToProps)(Search);
