import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase'
import RoomList from './components/RoomList'
import MessageList from './components/MessageList'
import User from "./components/User";
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

// First we need the theme provider and the theme creator
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';

// For this example I'll also be using the amber and blue color profiles
import pink from '@material-ui/core/colors/pink';
import blue from '@material-ui/core/colors/cyan';

// Now let us create our theme

const theme = createMuiTheme({
    palette: {
        type: 'light',
        primary: blue,
        secondary: pink
    }
});

// Firebase initialization

var config = {
  apiKey: "AIzaSyA4vsRfJ1E3ZqwI2-CxX7nVyjIq3fhYq7c",
  authDomain: "bloc-chat-790f9.firebaseapp.com",
  databaseURL: "https://bloc-chat-790f9.firebaseio.com",
  projectId: "bloc-chat-790f9",
  storageBucket: "bloc-chat-790f9.appspot.com",
  messagingSenderId: "703348039153"
};
firebase.initializeApp(config);

class App extends Component {
  constructor() {
    super();
    this.state = {
      activeRoom: '',
      user: '',
    }
  }

  selectRoom(room) {
    this.setState({
      activeRoom: room,
    });
  }

  setUser(user) {
    this.setState({
      user: user
    })
  }

  render() {
    return (
    <MuiThemeProvider theme={theme}>
      <Grid className="App">
        <Grid justify='center' container spacing={8}>
          <AppBar position='static' color='primary'>
            <Toolbar>
              <Typography variant='title' color="inherit" aria-label="Menu"><i className="far fa-comment"></i> Bloc Chat</Typography>
            </Toolbar>
          </AppBar>
          {/* Room List Area */}
          <Grid item xs={12} md={3} className='leftArea'>
            <User 
              firebase={firebase} 
              setUser={ this.setUser.bind(this) } 
              currentUser={ this.state.user === null ? 'Guest' : this.state.user.displayName } 
              user={ this.state.user }
            />
            <RoomList 
            firebase={firebase} 
            activeRoom={ this.state.activeRoom } 
            selectRoom={ this.selectRoom.bind(this) }
            />
          </Grid>
        {/* Chat Area */}
          <Grid item xs={12} md={8}>
            <MessageList 
              firebase={firebase} 
              activeRoom={ this.state.activeRoom }
              currentUser={ this.state.user === null ? 'Guest' : this.state.user.displayName }
            />
          </Grid>
        </Grid>
      </Grid>
    </MuiThemeProvider>
    );
  }
}

export default App;
