const clientId = '7a787c5bb7974320b8dc510abfcb70d3';
// const redirectUri = 'https://asato_playify.surge.sh';
// const redirectUri = 'https://localhost:3000';
const redirectUri = 'https://asato-playify.herokuapp.com';
const spotifyUrl = `https://accounts.spotify.com/authorize?response_type=token&scope=playlist-modify-public&client_id=${clientId}&redirect_uri=${redirectUri}`;

let accessToken = undefined;
let expiresIn = undefined;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      console.log("ACCESS TOKEN FOUND");
      return accessToken;
    }

    const urlAccess = window.location.href.match(/access_token=([^&]*)/);
    const urlExpire = window.location.href.match(/expires_in=([^&]*)/);

    if (urlAccess & urlExpire) {
      accessToken = urlAccess[1];
      expiresIn = urlExpire[1];

      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
    } else {
      console.log("AUTHENTICATE");
      window.location = spotifyUrl;
    }
  },

  search(term) {
    const searchUrl = `https://api.spotify.com/v1/search?type=track&q=${term.replace(' ', '%20')}`;
    return fetch(searchUrl, {
      headers: {Authorization: `Bearer ${accessToken}`}
    })
    .then(response => response.json())
    .then(jsonResponse => {
      if (!jsonResponse.tracks) {
        return [];
      } else {
        return jsonResponse.tracks.items.map(track => {
          return {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album,
            url: track.uri
          }
        });
      }
    });
  },

  savePlaylist(name, trackUris) {
    if (!name || !trackUris || trackUris.length === 0) {
      return;
    }

    let userId = undefined;
    let playlistId = undefined;
    const headers = {Authorization: `Bearer ${accessToken}`};

    const userUrl = 'https://api.spotify.com/v1/me';
    return fetch(userUrl, {
      headers: headers
    })
    .then(response => response.json())
    .then(jsonResponse => userId = jsonResponse.id)
    .then(() => {
      const playlistUrl = `https://api.spotify.com/v1/users/${userId}/playlists`;
      fetch(playlistUrl, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({
          name: name
        })
      })
      .then(response => response.json())
      .then(jsonResponse => playlistId = jsonResponse.id)
      .then(() => {
        const addPlaylistUrl = `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`;
        fetch(addPlaylistUrl, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({
            uris: trackUris
          })
        });
      })
    })

  }


};

export default Spotify;
