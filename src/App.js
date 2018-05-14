import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase'
import RoomList from './components/RoomList'
import { Grid, Col, Row } from "react-bootstrap";

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
  render() {
    return (
      <div className="App">
        <h1>Bloc Chat</h1>
        <Grid>
          <Row>
          {/* Room List Area */}
            <Col sm={6} md={4}>
              <RoomList firebase={firebase}/>
            </Col>
          {/* Chat Area */}
            <Col xs={12} md={8}>
              <h2>Chat Area</h2>
              <p>Place holder area for now.  Chats will go here.</p>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default App;
