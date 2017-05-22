const express = require('express');
const db = require('./database');
const Promise = require('bluebird');
const request = require('request');
const mongoose = require('mongoose');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const swig = require('swig');
const methodOverride = require('method-override');
const session = require('express-session');
const SpotifyStrategy = require('passport-spotify').Strategy;
const consolidate = require('consolidate');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const SERVER_PORT = process.env.PORT || 4242;

const DATABASE_CONNECTED_MESSAGE_PREFIX = 'Database connection status: ';
const DATABASE_CONNECTED_MESSAGE = 'Connected';
const DATABASE_NOT_CONNECTED_MESSAGE = 'NOT connected';

// test endpoint for reporting status of database connection
app.get('/test', (req, res) => {
  const message = DATABASE_CONNECTED_MESSAGE_PREFIX +
    ((db.mongoose.connection.readyState === 1) ? DATABASE_CONNECTED_MESSAGE : DATABASE_NOT_CONNECTED_MESSAGE);
  res.status(200).send(message);
});

app.get('/clients', (req, res) => {
  let message = '';
  let clients = io.sockets.connected;
  for ( client in clients ) {
    message += `Rooms for ${client}: ${JSON.stringify(clients[client].rooms)}\n`;
  }
  res.status(200).send(message);
});

// serve up client files
app.use(express.static(`${__dirname}/../client`));
app.use(express.static(`${__dirname}/../node_modules`));

// Query Spotify's Search API for a track name, and return an array of all matching tracks. Each track in the response will
// be an object with properties uri and artist name.
app.get('/tracks', (req, res) => {
  const query = req.query.trackName; // name me trackName in the client

  let tracks;

  request(`https://api.spotify.com/v1/search?q=${query}&type=track`, (error, response, body) => {
    const parsedBody = JSON.parse(body);

    if (parsedBody.tracks.items.length <= 0) {
      res.send([]);
      return;
    }

    tracks = parsedBody.tracks.items.map(track => {
      return {uri: track.uri, artist: track.artists[0].name};
    });
    res.status(200).send(tracks);
    return;
  });
});

// socket.io framework
io.on( 'connection', function(client) {

  client.on('add song', (uri) => {
    console.log( 'Client adding song', uri );
    // the playlistId is the name of a room that this socket is in
    let playlistId;
    for ( room in client.rooms ) {
      // each socket is also in a room matching its own ID, so let's filter that out
      if ( room !== client.id ) {
        playlistId = room;
      }
    }
    console.log( '  for playlist', playlistId );
    db.insertSong(playlistId, {uri: uri});
    // transmit the confirmation to ALL clients working with this playlist
    io.in(playlistId).emit('song added', uri);
  });

  // (new or existing) playlist requests
  client.on( 'playlist', function(playlistId, callback) {
    let playlist;
    let p;

    if ( playlistId ) {
      console.log( `Client requesting playlist ${playlistId}` );

      p = db.getSinglePlayList( playlistId )
        .then( (doc) => {
          if ( !doc ) {
            throw new Error( 'playListNotFound' );
          }
          return doc;
        })
        .catch(
          (err) => (err.message === 'playListNotFound' ),
          () => {
            return db.createPlayList();
          });

    } else {

      console.log( 'Client requesting new playlist' );
      p = db.createPlayList();
    }

    p.then( (doc) => {
      // put this client in a socket.io room corresponding to this playlist
      client.join( doc._id.toString() );
      callback({ _id: doc._id.toString(), songs: doc.songs });
    })
    .catch( (err) => {
      console.log( err );
    });
  });

  client.on('disconnect', function() {
    // POST-MVP: clean up empty playlists here
  });
});


/**********************************************************************/


app.use(express.static(`${__dirname}/../client`));
app.set('views', __dirname + '../client/components');
app.set('view engine', 'html');
app.engine('html', consolidate.swig);

var appKey = '03ef82e56fd64d0ab0af33bb8f993831';
var appSecret = 'c7353df3cbfc48c9826f04ceef2ba066';
var redirect_uri = 'http://localhost:4242/callback';

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

var accessTok;
passport.use(new SpotifyStrategy({
  clientID: appKey,
  clientSecret: appSecret,
  callbackURL: 'http://localhost:4242/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    console.log('inside');
    process.nextTick(function () {
      accessTok = accessToken;
      return done(null, profile);
    });
  }));

app.use(cookieParser());
app.use(bodyParser());
app.use(methodOverride());
app.use(session({ secret: 'Rethymno Kriti' }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/authorize', passport.authenticate('spotify', {scope: ['user-read-email', 'user-read-private'], showDialog: true}),
  function(req, res){
    console.log('fail');
  });

app.get('/callback',
  passport.authenticate('spotify', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/mylists', function(req, res) {
  var bod;
  var options = {
    url: 'https://api.spotify.com/v1/me/playlists',
    headers: { 'Authorization': 'Bearer ' + accessTok },
    json: true
  };
  request(options, function (error, response, body) {
    //console.log('res: ', response.body)
    console.log('first');
    console.log(response.body);
    res.send(response.body);
    // res.end();
  });
});

app.get('/logout', function(req, res){
  accessTok = null;
  req.logout();
  res.redirect('/');
});


/**************************************************************/


// start the webserver
http.listen = Promise.promisify(http.listen);
app.start = function() {
  return http.listen(SERVER_PORT)
    .then(() => {
      console.log(`Tribal server is listening on port ${SERVER_PORT}.`);
    });
};

module.exports = app;
module.exports.SERVER_PORT = SERVER_PORT;
module.exports.DATABASE_CONNECTED_MESSAGE_PREFIX = DATABASE_CONNECTED_MESSAGE_PREFIX;
module.exports.DATABASE_CONNECTED_MESSAGE = DATABASE_CONNECTED_MESSAGE;





