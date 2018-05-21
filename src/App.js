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
  apiKey: process.env.REACT_APP_API_KEY,
   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
   databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
   messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID
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
