import React, { Component } from 'react';
import { Panel, ListGroup, ListGroupItem, Form, FormGroup, FormControl, Button, Well } from "react-bootstrap";
import * as moment from 'moment';

class MessageList extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      activeMessages: [],
      newMessageContent: '',
      show: true
    }
    this.messagesRef = this.props.firebase.database().ref( 'messages' );
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
      this.setState( { messages: this.state.messages.concat( message ), activeMessages: this.state.activeMessages.concat( message ) } );
    });
  }

  // Update props for new active room

  componentWillUpdate(newProps){
    if(this.props !== newProps) {
      this.updateActiveMessages(newProps.activeRoom.key);
    }
  }

  handleChange(e) {
    this.setState({
      newMessageContent: e.target.value
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    const newMessage = {
      content: this.state.newMessageContent,
      username: this.props.currentUser,
      roomId: this.props.activeRoom.key,
      sentAt: this.props.firebase.database.ServerValue.TIMESTAMP
    }
    this.messagesRef.push(newMessage);
    this.setState({
      newMessageContent: ''
    })
  }

  render() {
    return (
      <div>
        <Panel bsStyle='primary'>
          <Panel.Heading>
          <Panel.Title componentClass='h3'>
            { this.props.activeRoom === '' ? 'Welcome to Bloc Chat' : this.props.activeRoom.name }
          </Panel.Title>
          </Panel.Heading>
          <Panel.Body>
            <ListGroup id='messageList'>
              { this.props.activeRoom === '' ?
                <Well className='noRoomSelected'>No Room Selected</Well>
                :
                this.state.activeMessages.map( ( message, index ) => 
                  <ListGroupItem key={index} header={ message.content }>{ message.username } - { moment(message.sentAt).fromNow() }</ListGroupItem>
                )
              }
            </ListGroup>
            <Form>
              <FormGroup className='submitMessageArea'>
                <FormControl type='text' placeholder='Enter Message' onChange={ this.handleChange } value={ this.state.newMessageContent }/>
                <Button type='submit' onClick={ this.props.activeRoom !== '' ? this.handleSubmit : this.handleShow } bsStyle='primary' block>Send</Button>
              </FormGroup>
            </Form>
          </Panel.Body>
        </Panel>
        
      </div>
    )
  }
}

export default MessageList
