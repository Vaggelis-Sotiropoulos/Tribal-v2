import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  TabBarIOS,
} from 'react-native';

import {
  fetchSongsIfNeeded, updateQuery, addToPlaylist, removeFromPlaylist,
} from '../actions';

import icons from '../public/images/icons';

// Import components
import Login from './Login';
import Search from './Search';
import PlayList from './PlayList';

const playListIcon = icons.playListIcon;
const searchIcon = icons.searchIcon;
const loginIcon = icons.loginIcon;
const logoutIcon = icons.logoutIcon;

// MAIN COMPONENT
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      selectedTab: 'loginTab',
      loggedIn: false,
    };

    this._onChangeText = this._onChangeText.bind(this);
    this._onSearch = this._onSearch.bind(this);
    this._addSong = this._addSong.bind(this);
    this._removeSong = this._removeSong.bind(this);
    this._login = this._login.bind(this);
  }

  _addSong(song) {
    this.setState({ message: `[${song.artist}] ** ADDED ** ` }, () => {
      setTimeout(() => this.setState({ message: '' }), 1000);
    });

    const { dispatch } = this.props;
    dispatch(addToPlaylist(song));
  }

  _removeSong(song) {
    this.setState({ message: `[${song.artist}] song ** REMOVED ** ` }, () => {
      setTimeout(() => this.setState({ message: '' }), 1000);
    });

    const { dispatch } = this.props;
    dispatch(removeFromPlaylist(song));
  }

  _onChangeText(name) {
    const { dispatch } = this.props;
    dispatch(updateQuery(name));
  }

  _onSearch() {
    const { dispatch, currentQuery } = this.props;
    dispatch(fetchSongsIfNeeded(currentQuery));
  }

  _login() {
    this.setState({ loggedIn: !this.state.loggedIn });
  }

  _renderSearch() {
    return (
      <Search
        _onSearch={this._onSearch}
        _onChangeText={this._onChangeText}
        _addSong={this._addSong}
        _removeSong={this._removeSong}
        message={this.state.message}
      />
    );
  }

  _renderPlayList() {
    return (
      <PlayList
        _addSong={this._addSong}
        _removeSong={this._removeSong}
        message={this.state.message}
      />
    );
  }

  render() {
    return (
      <TabBarIOS
        tintColor="white"
        itemTintColor="#D3D3D3"
        unselectedTintColor="#989898"
        unselectedItemTintColor="#989898"
        barTintColor="#383838"
      >

        {!this.state.loggedIn &&
          <TabBarIOS.Item
            title="Login"
            icon={{ uri: loginIcon, scale: 4 }}
            selected={this.state.selectedTab === 'loginTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'loginTab',
                loggedIn: !this.state.loggedIn,
              });
            }}
          >
            <View>
              <Login
                _login={this._login}
              />
            </View>
          </TabBarIOS.Item>
        }

        {this.state.loggedIn &&
          <TabBarIOS.Item
            title="Logout"
            icon={{ uri: logoutIcon, scale: 1.5 }}
            selected={this.state.selectedTab === 'loginTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'loginTab',
                loggedIn: !this.state.loggedIn,
              });
            }}
          >
            {this._renderSearch()}
          </TabBarIOS.Item>
        }

        <TabBarIOS.Item
          title="Search"
          icon={{ uri: searchIcon, scale: 5 }}
          selected={this.state.selectedTab === 'searchTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'searchTab',
            });
          }}
        >
          {this._renderSearch()}
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="PlayList"
          icon={{ uri: playListIcon, scale: 5 }}
          selected={this.state.selectedTab === 'playListTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'playListTab',
            });
          }}
        >
          {this._renderPlayList()}
        </TabBarIOS.Item>
      </TabBarIOS>
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

export default connect(mapStateToProps)(App);
