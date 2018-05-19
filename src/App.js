import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase'
import RoomList from './components/RoomList'
import MessageList from './components/MessageList'
import User from "./components/User";
import { Grid, Col, Row, Jumbotron } from "react-bootstrap";

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
