import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

class RoomList extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      rooms: []
    };

    this.roomsRef = this.props.firebase.database().ref('rooms')
  }
  
  // Mount RoomList from firebase
  componentDidMount() {
    this.roomsRef.on('child_added', snapshot => {
      const room = snapshot.val();
      room.key = snapshot.key;
      this.setState({ rooms: this.state.rooms.concat( room ) });
    });
    
  }
  
  // Create Room List
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
      </div>
    )
  }
}

export default RoomList;
