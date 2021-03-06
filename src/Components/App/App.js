import React, { Component } from 'react';
import './App.css';

import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

Spotify.getAccessToken();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: [],
      searchTerm: ''
    }
    
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.updateTerm = this.updateTerm.bind(this);
  }
  
  addTrack(track) {
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    let tempTracks = this.state.playlistTracks;
    tempTracks.push(track);
    this.setState({playlistTracks: tempTracks});
  }
  
  removeTrack(track) {
    this.setState({playlistTracks: this.state.playlistTracks.filter(playlistTrack => playlistTrack.id !== track.id)})
  }
  
  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }
  
  savePlaylist() {
    const trackUris = this.state.playlistTracks.map(playlistTrack => playlistTrack.uri);
    Spotify.savePlaylist(this.state.playlistName, trackUris).then(() => {
      this.setState({
        playlistTracks: [],
        playlistName: 'New Playlist'
      });
    });
  }

  updateTerm(term) {
    this.setState({searchTerm: term});
  }
  
  search() {
    if (this.state.searchTerm.length > 0) {
      Spotify.search(this.state.searchTerm).then(results => 
        this.setState({searchResults: results})
      );
    } else {
      this.setState({searchResults: []});
    }
  }
  
  render() {
    return (
      <div>
        <h1>Pl<span className="highlight">ayi</span>fy</h1>
        <div className="App">
          <SearchBar 
            onSearch={this.search} 
            onTermChange={this.updateTerm} />
          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults} 
              onAdd={this.addTrack} />
            <Playlist 
              playlistName={this.state.playlistName} 
              playlistTracks={this.state.playlistTracks} 
              onRemove={this.removeTrack} 
              onNameChange={this.updatePlaylistName} 
              onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
