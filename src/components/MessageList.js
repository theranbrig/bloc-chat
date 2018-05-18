import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from "react-bootstrap";

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      activeMessages: []
    }
    this.messagesRef = this.props.firebase.database().ref( 'messages' );
  }

  // Update active room message list
  
  updateActiveMessages(activeRoomKey) {
    this.setState({ activeMessages: this.state.messages.filter( message => message.roomId === activeRoomKey ) });
  }

  // Mount messages from database

  componentDidMount() {
    this.messagesRef.on('child_added', snapshot => {
      const message = snapshot.val();
      message.key = snapshot.key;
      this.setState( { messages: this.state.messages.concat( message ) } );
    });
  }

  // Update props for new active room

  componentWillUpdate(newProps){
    if(this.props !== newProps) {
      this.updateActiveMessages(newProps.activeRoom.key);
    }
  }

  render() {
    return (
      <div>
        <h2>{ this.props.activeRoom.name }</h2>
        <ListGroup>
          {
            this.state.activeMessages.map( ( message, index ) => 
              <ListGroupItem key={index} header={ message.content }></ListGroupItem>
            )
          }
        </ListGroup>
      </div>
    )
  }
}

export default MessageList
