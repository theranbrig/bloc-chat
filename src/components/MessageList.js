import React, { Component } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Typography,
  Chip,
  Paper
} from "@material-ui/core";
import * as moment from "moment";

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      activeMessages: [],
      newMessageContent: "",
      show: true
    };
    this.messagesRef = this.props.firebase.database().ref(`messages`);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteAlert = this.deleteAlert.bind(this);
  }

  // Mount messages from database

  componentDidMount() {
    this.messagesRef.on("value", snapshot => {
      const messageChanges = [];
      snapshot.forEach(message => {
        messageChanges.push({
          message: message.key,
          content: message.val().content,
          roomId: message.val().roomId,
          username: message.val().username,
          sentAt: message.val().sentAt
        });
      });
      this.setState({
        messages: messageChanges,
        activeMessages: messageChanges.filter(
          message => message.roomId === this.props.activeRoom.key
        )
      });
    });
  }

  // Update props for new active room

  componentWillUpdate(newProps) {
    if (this.props !== newProps) {
      this.updateActiveMessages(newProps.activeRoom.key);
    }
  }

  componentDidUpdate(newProps) {
    this.messagesEnd.scrollIntoView();
  }

  // Send new message handlers

  handleChange(e) {
    this.setState({
      newMessageContent: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.newMessageContent.length > 0) {
      const newMessage = {
        content: this.state.newMessageContent,
        username: this.props.currentUser,
        roomId: this.props.activeRoom.key,
        sentAt: this.props.firebase.database.ServerValue.TIMESTAMP
      };
      this.messagesRef.push(newMessage);
      this.setState({
        newMessageContent: ""
      });
      this.scrollToBottom();
    }
  }

  // Update active room message list

  updateActiveMessages(activeRoomKey) {
    this.setState({
      activeMessages: this.state.messages.filter(
        message => message.roomId === activeRoomKey
      )
    });
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView();
  };

  handleDelete(itemId) {
    if (window.confirm("Are you sure you want to delete this item?")) {
      this.messagesRef.child(itemId).remove(function(error) {
        if (error) {
          console.log(error);
        }
      });
    }
  }

  deleteAlert() {
    alert("You do not have permission to delete this message!");
  }

  render() {
    return (
      <div className="wholeMessageArea">
        <Paper square>
          <Typography variant="headline" color="secondary" component="h2">
            {this.props.activeRoom === ""
              ? "Choose a room to get started chatting."
              : this.props.activeRoom.name}
          </Typography>
        </Paper>
        <List id="messageList">
          {this.props.activeRoom === "" ? (
            <Typography
              component="h2"
              variant="headline"
              color="secondary"
              className="noRoomSelected"
            >
              No Room Selected
            </Typography>
          ) : (
            this.state.activeMessages.map((message, index) => (
              <ListItem key={index} divider className="individualMessage">
                <ListItemText
                  className={
                    this.props.currentUser === message.username
                      ? "activeUser"
                      : "otherUser"
                  }
                  primary={message.content}
                  secondary={message.username}
                />
                <Chip
                  label={moment(message.sentAt).format("MMMM Do, h:mm a")}
                />
                <span
                  onClick={
                    this.props.currentUser === message.username
                      ? () => this.handleDelete(message.message)
                      : this.deleteAlert
                  }
                >
                  <i className="fas fa-times-circle"> </i>
                </span>
              </ListItem>
            ))
          )}
          <div
            style={{ float: "left", clear: "both" }}
            ref={el => {
              this.messagesEnd = el;
            }}
          />
        </List>
        <form className="submitMessageArea">
          <TextField
            type="text"
            onChange={this.handleChange}
            value={this.state.newMessageContent}
            className="messageInput"
            label="Enter Message"
            fullWidth
          />
          <Button
            type="submit"
            onClick={
              this.props.activeRoom !== "" ? this.handleSubmit : this.handleShow
            }
            variant="raised"
            color="primary"
            className="messageButton"
          >
            <i className="fas fa-paper-plane" /> Send
          </Button>
        </form>
      </div>
    );
  }
}

export default MessageList;
