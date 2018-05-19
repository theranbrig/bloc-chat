import React, { Component } from 'react';
import { Panel, ListGroup, ListGroupItem, Form, FormControl, Button } from 'react-bootstrap';

class RoomList extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      rooms: [],
      newRoom: '',
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
        <Panel bsStyle='primary' className='chatRoomArea'>
          <Panel.Heading>
            <Panel.Title componentClass="h3">Chat Rooms</Panel.Title>
          </Panel.Heading>
          <Panel.Body>
            <ListGroup id='roomList'>
              {
                this.state.rooms.map( (room, index) => 
                  <ListGroupItem 
                    key={index} 
                    onClick={ (e) => this.props.selectRoom(room) }
                    className='roomItem'
                  >
                    { room.name }
                  </ListGroupItem>
                )
              }
            </ListGroup>
            <Form className='submitRoomArea' onSubmit={ this.handleSubmit }>
              <FormControl type='text' name='newRoom' placeholder='New Chat Room' 
                onChange={ this.handleChange } 
                value={ this.state.newRoom }
              />
              <Button type='submit' bsStyle='primary' block>Add Room</Button>
            </Form>
          </Panel.Body>
        </Panel>
      </div>
    )
  }
}

export default RoomList;
