import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Form, FormControl } from 'react-bootstrap';

class RoomList extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      rooms: [],
      newRoom: ''
    };

    // Room reference and bind handlers
    this.roomsRef = this.props.firebase.database().ref('rooms');
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  // Mount RoomList from firebase
  componentDidMount() {
    this.roomsRef.on('child_added', snapshot => {
      const room = snapshot.val();
      room.key = snapshot.key;
      this.setState({ rooms: this.state.rooms.concat( room ) });
    });
  }

  // Handle input change function
  handleChange(e) {
    this.setState({
      newRoom: e.target.value
    })
  }

  // Handle submit for new room
  handleSubmit(e) {
    e.preventDefault();
    const room = {
      name: this.state.newRoom
    }
    this.roomsRef.push(room);
    this.setState({
      newRoom: ''
    })
  }
  
  // Create room list
  render() {
    return (
      <div>
        <h2>Chat Rooms</h2>
        <ListGroup>
          {
            this.state.rooms.map( (room, index) => 
              <ListGroupItem key={index}>{room.name}</ListGroupItem>
            )
          }
        </ListGroup>
        <Form onSubmit={ this.handleSubmit }>
          <FormControl type='text' name='newRoom' placeholder='New Chat Room' onChange={ this.handleChange } value={ this.state.newRoom }/>
          <FormControl type='submit'/>
        </Form>
      </div>
    )
  }
}

export default RoomList;
