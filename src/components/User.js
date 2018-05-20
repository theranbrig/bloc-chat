import React, { Component } from 'react';
import { Button, Row } from "react-bootstrap";

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
      <div className='userInfo'>
        <Row>
          <h4>Welcome: { this.props.currentUser }</h4>
        </Row>
        <Row>
          {this.props.user === null ?
          <Button bsStyle='info' onClick={ this.signIn.bind(this) }><i className="fas fa-user"></i> Sign In</Button>
          :
          <Button bsStyle='info' onClick={ this.signOut.bind(this) }><i className="fas fa-sign-out-alt"></i> Sign Out</Button>
          }
        </Row>
      </div>
    )
  }
}

export default User;