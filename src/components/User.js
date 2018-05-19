import React, { Component } from 'react';
import { Button, Grid, Row } from "react-bootstrap";

class User extends Component {
  
  signIn () {
    console.log('clickSignIn')
    const provider = new this.props.firebase.auth.GoogleAuthProvider();
    this.props.firebase.auth().signInWithPopup( provider ).then((result) => {
        const user = result.user;
        this.setState({ user });
    });
  }

  signOut () {
    console.log('Hi');
    this.props.firebase.auth().signOut();
    this.setState({ user: null })
  }

  componentDidMount () {
    this.props.firebase.auth().onAuthStateChanged(user => {
      this.props.setUser(user);
    });
  }

  render() {
    return (
      <Grid>
        <Row>
          <h4>User: { this.props.currentUser }</h4>
        </Row>
        <Row>
          {this.props.user === null ?
          <Button bsStyle='primary' onClick={ this.signIn.bind(this) }>Sign In</Button>
          :
          <Button bsStyle='primary' onClick={ this.signOut.bind(this) }>Sign Out</Button>
          }
        </Row>
      </Grid>
    )
  }
}

export default User;