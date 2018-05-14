import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase'
import RoomList from './components/RoomList'
import { Grid, Col, Row } from "react-bootstrap";

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
