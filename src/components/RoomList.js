import React, { Component } from 'react';
import { Panel, ListGroup, ListGroupItem, Form, FormControl, Button } from 'react-bootstrap';

class RoomList extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      rooms: [],
      newRoom: '',
      editMode: false,
      editRoomName: ''
    };
    
    // Room reference and bind handlers
    this.roomsRef = this.props.firebase.database().ref('rooms');
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showEditButton = this.showEditButton.bind(this);
    this.hideEditButton = this.hideEditButton.bind(this);
    this.handleEditChange = this.handleEditChange.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
  }
  
  // Mount RoomList from firebase
  componentDidMount() {
    this.roomsRef.on('value', snapshot => {
      const roomChanges = [];
      snapshot.forEach((room) => {
        roomChanges.push({
          key: room.key,
          name: room.val().name
        })
      })
      this.setState({
        rooms: roomChanges
      })
    })
  }

  // Handle input change function

  handleEditChange(e) {
    this.setState({
      editRoomName: e.target.value
    })
  }

  // Handle submit for new room

  handleEditSubmit(e) {
    e.preventDefault();
    console.log('You edited the room');
    this.roomsRef.child(this.props.activeRoom.key).set({
      name: this.state.editRoomName
    })
    this.setState({
      editRoomName: '',
      editMode: false
    })
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

  handleDelete(itemId) {
    if (window.confirm('Are you sure you want to delete this item?')) {
      this.roomsRef.child(itemId).remove(function(error) {
        if (error) {
          console.log(error);
        }
      });
    }
  }

  showEditButton() {
    this.setState({editMode: true});
  }

  hideEditButton() {
    this.setState({editMode: false})
  }
  
  // Create room list
  render() {

    // Edit form buttons and input change
    const editMode = this.state.editMode;
    const editButton = editMode ? (
      <span onClick={this.hideEditButton}><i className="fas fa-ban"></i></span>
    ) : (
      <span onClick={ this.showEditButton }><i className='fas fa-edit'></i></span>
    )
    const editForm = editMode ? (
      <Form className='submitRoomArea' onSubmit={this.handleEditSubmit}>
        <FormControl type='text' name='newRoom' placeholder='Edit Chat Room Name' 
          onChange={ this.handleEditChange } 
          value={ this.state.editRoomName }
        />
        <Button type='submit' bsStyle='warning' block><i className="fas fa-pen-square"></i> Edit Room Name</Button>
      </Form>
    ) : (
      <Form className='submitRoomArea' onSubmit={ this.handleSubmit }>
        <FormControl type='text' name='newRoom' placeholder='New Chat Room' 
          onChange={ this.handleChange } 
          value={ this.state.newRoom }
        />
        <Button type='submit' bsStyle='info' block><i className="fas fa-plus-circle"></i> Add Room</Button>
      </Form>
    )

    

    return (
      <div>
        <Panel bsStyle='info' className='chatRoomArea'>
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
                  <span onClick={ () => this.handleDelete( room.key ) }><i className='fas fa-times-circle'> </i></span>
                  { editButton }
                  { room.name }
                  </ListGroupItem>
                )
              }
            </ListGroup>
            {editForm}
          </Panel.Body>
        </Panel>
      </div>
    )
  }
}

export default RoomList;
