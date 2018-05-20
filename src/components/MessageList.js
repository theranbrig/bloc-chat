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
    this.messagesRef = this.props.firebase.database().ref( `messages` );
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Mount messages from database

  componentDidMount() {
    this.messagesRef.on('value', snapshot => {
      const messageChanges = [];
      snapshot.forEach((message) => {
        messageChanges.push({
          message: message.key,
          content: message.val().content,
          roomId: message.val().roomId,
          username: message.val().username,
          sentAt: message.val().sentAt
        })
      })
      this.setState({
        messages: messageChanges,
        activeMessages: this.state.messages.filter( message => message.roomId === this.props.activeRoom.key ) 
      })
    })
    this.messagesEnd.scrollIntoView()
  }

  // Update props for new active room

  componentWillUpdate(newProps){
    if(this.props !== newProps) {
      this.updateActiveMessages(newProps.activeRoom.key);
    }
    console.log(newProps);
    this.messagesEnd.scrollIntoView();
  }

  componentDidUpdate() {
    this.messagesEnd.scrollIntoView();
  }
  
  // Send new message handlers

  handleChange(e) {
    this.setState({
      newMessageContent: e.target.value
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    if(this.state.newMessageContent.length > 0) {
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
      this.scrollToBottom();
    }
  }

  // Update active room message list
  
  updateActiveMessages(activeRoomKey) {
    this.setState({ activeMessages: this.state.messages.filter( message => message.roomId === activeRoomKey ) });
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView()
  }

  render() {
    return (
      <div>
        <Panel bsStyle='info' className='wholeMessageArea'>
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
                  <ListGroupItem 
                    key={index} 
                    header={ message.content }
                  >
                    { message.username } - { moment(message.sentAt).fromNow() }
                  </ListGroupItem>
                )
              }
              <div style={{ float:"left", clear: "both" }}
                ref={(el) => { this.messagesEnd = el; }}>
              </div>
            </ListGroup>
            <Form>
              <FormGroup className='submitMessageArea'>
                <FormControl type='text' placeholder='Enter Message' onChange={ this.handleChange } value={ this.state.newMessageContent }/>
                <Button 
                  type='submit' 
                  onClick={ this.props.activeRoom !== '' ? this.handleSubmit : this.handleShow } 
                  bsStyle='info' block
                >
                  <i className="fas fa-paper-plane"></i> Send
                </Button>
              </FormGroup>
            </Form>
          </Panel.Body>
        </Panel>
        
      </div>
    )
  }
}

export default MessageList
