import React, { Component } from 'react';
import './App.css';
import SearchBar from './components/SearchBar/SearchBar.js';
import SearchResults from './components/SearchResults/SearchResults.js';
import Playlist from './components/Playlist/Playlist.js';
import Spotify from './utils/Spotify.js';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      searchResults: [
        /* removed defaults
        {
          name:'name1',
          artist:'artist1',
          album:'album1',
          id:'id1',
          uri:'123a'
        },
        {
          name:'name2',
          artist:'artist2',
          album:'album2',
          id:'id2',
          uri:'123a'
        } */
      ],
      playlistName: 'Test Name',
      playlistTracks: [
        /* removed defaults
        {
          name:'pl name1',
          artist:'pl artist1',
          album:'pl album1',
          id:'pl id1',
          uri:'123a'
        },
        {
          name:'pl name2',
          artist:'pl artist2',
          album:'pl album2',
          id:'pl id2',
          uri:'123a'
        } */
      ]
    };
    //bind methods as needed
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  savePlaylist(){

    //Create array of URIs
    var trackURIs = this.state.playlistTracks.map(track => {
      return track.uri;
    });

    Spotify.savePlaylist(this.state.playlistName,trackURIs);
    this.setState({playlistTracks: [] });
    this.setState({playlistName: 'New Playlist'});

  }

  search(searchTerm){

    //Debug
    console.log('Searching for: ' + searchTerm);

    if(searchTerm === ''){
      this.setState({searchResults: [] });
    }else{
      //Update state with results
      Spotify.search(searchTerm).then(response => this.setState({searchResults: response}));
    }

  }

  addTrack(track){
    //jump out of this method if track already exists in playlist tracks
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }else{
      //get the playLists tracks, add new track and store
      var pTracks = this.state.playlistTracks;
      pTracks.push(track);
      this.setState({playlistTracks: pTracks});
    }
  }

  removeTrack(track){
    //get the playLists tracks, remove track and store
    var pTracks = this.state.playlistTracks;
    var index = pTracks.indexOf(track);
    if(index>-1){
      pTracks.splice(index,1);
    }
    this.setState({playlistTracks: pTracks});
  }

  updatePlaylistName(name){
    this.setState({playlistName: name})
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
