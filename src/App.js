import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase'
import RoomList from './components/RoomList'
import MessageList from './components/MessageList'
import User from "./components/User";
import { Grid, Col, Row, Jumbotron } from "react-bootstrap";

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
      <div className="App">
        
        <Grid>
          <Row>
            <Jumbotron>
              <h1>Bloc Chat</h1>
              <User 
                  firebase={firebase} 
                  setUser={ this.setUser.bind(this) } 
                  currentUser={ this.state.user === null ? 'Guest' : this.state.user.displayName } 
                  user={ this.state.user }
                />
            </Jumbotron>
          </Row>
          <Row className='mainContentArea'>
          {/* Room List Area */}
            <Col sm={6} lg={4}>
              <RoomList 
              firebase={firebase} 
              activeRoom={ this.state.activeRoom } 
              selectRoom={ this.selectRoom.bind(this) }
            />
            </Col>
          {/* Chat Area */}
            <Col xs={12} lg={8}>
              <MessageList 
                firebase={firebase} 
                activeRoom={ this.state.activeRoom }
                currentUser={ this.state.user === null ? 'Guest' : this.state.user.displayName }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default App;
