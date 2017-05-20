import React, { Component } from 'react';
import { connect } from 'react-redux';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import { WebView } from 'react-native';
import styles from './css/styles.css';

// import { addToPlaylist, removeFromPlaylist } from '../actions';

class SongListEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gestureName: 'none',
      backgroundColor: '#fff',
      onPlaylist: false,
      opacity: 1,
    };
  }

  onSwipe(gestureName) {
    // const { dispatch } = this.props;
    const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
    this.setState({ gestureName });
    switch (gestureName) {
      case SWIPE_UP:
        this.setState({ backgroundColor: 'red' });
        break;
      case SWIPE_DOWN:
        this.setState({ backgroundColor: 'green' });
        break;
      case SWIPE_LEFT:
        // dispatch(removeFromPlaylist(this.props.song));
        this.props._removeSong(this.props.song, 'Song removed');
        this.setState({ backgroundColor: '#282828', onPlaylist: false, opacity: 1 });
        break;
      case SWIPE_RIGHT:
        // dispatch(addToPlaylist(this.props.song));
        this.props._addSong(this.props.song, 'Song added');
        this.setState(
          { backgroundColor: 'red', onPlaylist: true, opacity: 0.3 });
        break;
      default:
        break;
    }
  }

  render() {
    const config = {
      velocityThreshold: 0.1,
      directionalOffsetThreshold: 10,
    };

    return (
      <GestureRecognizer
        onSwipe={(direction, state) => this.onSwipe(direction, state)}
        config={config}
        style={{ borderColor: this.state.borderColor }}
      >
        <WebView
          key={this.props.index}
          source={{ uri: `https://open.spotify.com/embed?uri=${this.props.song.uri}` }}
          style={[styles.webview, { opacity: this.state.opacity }]}
          allowsInlineMediaPlayback
          automaticallyAdjustContentInsets
          scrollEnabled
          height={100}
        />
      </GestureRecognizer>
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
    playlist,
    songs,
    isFetching,
    lastUpdated,
  };
};

export default connect(mapStateToProps)(SongListEntry);

