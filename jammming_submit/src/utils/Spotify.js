var accessToken = '';
var expiresIn = '';
const clientID = '1328cd172a8c43f69c24e14d0d4bb1e7'; //aka the app id
const redirectURI = 'http://localhost:3000/';

var Spotify = {
  getAccessToken(){
    if (accessToken !== ''){
      return accessToken;
    }else {
      //attempt to get access token and expiration from href
      var href = {};
      href.value =  window.location.href;
      href.accessToken = href.value.match(/access_token=([^&]*)/);
      href.expiresIn = href.value.match(/expires_in=([^&]*)/);
      if(href.accessToken === null || href.expiresIn === null ){
        //redirect if access Token is note available
        //Spotify will prompt for login to allow app id to access account with scope provided
        window.location = 'https://accounts.spotify.com/authorize?client_id=' + clientID +
        '&response_type=token&scope=playlist-modify-public&redirect_uri='+ redirectURI;



      }else{
        //clear accessToken after timeout and clear page in history for back button
        accessToken = href.accessToken[1];
        expiresIn = href.expiresIn[1];
        window.setTimeout(() => accessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
        return accessToken;
      }


    }
  },
  search(searchTerm){
  //http get with modifed header
  Spotify.getAccessToken();
  return  fetch('https://api.spotify.com/v1/search?type=track&q='+searchTerm,
    {
      headers: {Authorization: `Bearer ${accessToken}`}
    })
  //convert response to json
  .then(response => response.json())
  //get data from reponse
  .then(responseJSON => {
    return responseJSON.tracks.items.map(track=>{
        return {
          name:track.name,
          artist:track.artists[0].name,
          album:track.album.name,
          id: track.id,
          uri:track.uri

                }
      });

    });


  },
  //savePlaylist(playlistName,trackURIs){
  savePlaylist(name, trackURIs) {
    //Cancel save if name or trackURIs is empty
    if (!name || !trackURIs.length) {
      return;
    }
    //const accessToken = Spotify.getAccessToken();
    //create header for GET request for users username
    var headers = {
      Authorization: `Bearer ${accessToken}`
    };
    return fetch('https://api.spotify.com/v1/me', {
      headers: headers
      })
    .then(response => {
      return response.json();
      })
      //use the user ID to create a playlist
    .then(jsonResponse => {
      console.log('user id response: ');
      console.log(jsonResponse);
      var userId = jsonResponse.id;
      return fetch('https://api.spotify.com/v1/users/'+userId+'/playlists', {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({
          name: name
        })
      })
    .then(response => {
        return response.json();
      })
      //user the returned playlist ID to add songs to the playlist
    .then(jsonResponse => {
      console.log('playlist Response: ');
      console.log(jsonResponse);
        var playlistId = jsonResponse.id;
        return fetch('https://api.spotify.com/v1/users/'+ userId +'/playlists/'+playlistId +'/tracks', {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({
            uris: trackURIs
          })
        });
      });
    });
}

}

export default Spotify;
