import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
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
  }

  // Update props for new active room

  componentWillUpdate(newProps){
    if(this.props !== newProps) {
      this.updateActiveMessages(newProps.activeRoom.key);
    }
    console.log(newProps);
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
        <div className='wholeMessageArea'>
          <div>
            <Typography 
              variant="headline" 
              color='secondary' 
              component='h2'>
              { this.props.activeRoom === '' ? 'Choose a room to get started chatting.' : this.props.activeRoom.name }
            </Typography>
          </div>
          <div>
            <List id='messageList'>
              { this.props.activeRoom === '' ?
                <Typography 
                  component='h3' 
                  variant='headline' 
                  color='secondary' 
                  className='noRoomSelected'>
                  No Room Selected
                </Typography>
                :
                this.state.activeMessages.map( ( message, index ) => 
                  <ListItem
                    key={index} 
                  >
                  <ListItemText 
                    primary={ message.content } 
                    secondary={ message.username }>
                  </ListItemText>
                  <Chip label={ moment(message.sentAt).format('LLL') }></Chip>
                  </ListItem>
                )
              }
              <div style={{ float:"left", clear: "both" }}
                ref={(el) => { this.messagesEnd = el; }}>
              </div>
            </List>
            <div>
              <form className='submitMessageArea'>
                <TextField 
                  type='text'
                  placeholder='Enter Message' 
                  onChange={ this.handleChange } 
                  value={ this.state.newMessageContent }
                  className='messageInput'
                  fullWidth
                />
                <Button 
                  type='submit' 
                  onClick={ this.props.activeRoom !== '' ? this.handleSubmit : this.handleShow }
                  variant="raised" 
                  color="primary"
                  className='messageButton'
                >
                  <i className="fas fa-paper-plane"></i> Send
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default MessageList
