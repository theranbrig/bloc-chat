import React, { Component } from "react";
import {
  MenuList,
  MenuItem,
  ListItemText,
  Typography,
  Button,
  TextField,
  Paper
} from "@material-ui/core";

class RoomList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rooms: [],
      newRoom: "",
      editMode: false,
      editRoomName: ""
    };

    // Room reference and bind handlers
    this.roomsRef = this.props.firebase.database().ref("rooms");
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showEditButton = this.showEditButton.bind(this);
    this.hideEditButton = this.hideEditButton.bind(this);
    this.handleEditChange = this.handleEditChange.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
  }

  // Mount RoomList from firebase
  componentDidMount() {
    this.roomsRef.on("value", snapshot => {
      const roomChanges = [];
      snapshot.forEach(room => {
        roomChanges.push({
          key: room.key,
          name: room.val().name
        });
      });
      this.setState({
        rooms: roomChanges
      });
    });
  }

  // Handle input change function

  handleEditChange(e) {
    this.setState({
      editRoomName: e.target.value
    });
  }

  // Handle submit for new room

  handleEditSubmit(e) {
    e.preventDefault();
    if (this.state.editRoomName !== "") {
      console.log("You edited the room");
      this.roomsRef.child(this.props.activeRoom.key).set({
        name: this.state.editRoomName
      });
      this.setState({
        editRoomName: "",
        editMode: false
      });
    }
  }

  // Handle input change function

  handleChange(e) {
    this.setState({
      newRoom: e.target.value
    });
  }

  // Handle submit for new room

  handleSubmit(e) {
    e.preventDefault();
    const room = {
      name: this.state.newRoom
    };
    if (room.name !== "") {
      this.roomsRef.push(room);
      this.setState({
        newRoom: ""
      });
    }
  }

  handleDelete(itemId) {
    if (window.confirm("Are you sure you want to delete this item?")) {
      this.roomsRef.child(itemId).remove(function(error) {
        if (error) {
          console.log(error);
        }
      });
    }
  }

  showEditButton() {
    this.setState({ editMode: true });
  }

  hideEditButton() {
    this.setState({ editMode: false });
  }

  // Create room list
  render() {
    // Edit form buttons and input change

    const editMode = this.state.editMode;
    const editButton = editMode ? (
      <span onClick={this.hideEditButton}>
        <i className="fas fa-ban" />
      </span>
    ) : (
      <span onClick={this.showEditButton}>
        <i className="fas fa-edit" />
      </span>
    );
    const editForm = editMode ? (
      <div>
        <form className="submitRoomArea" onSubmit={this.handleEditSubmit}>
          <TextField
            type="text"
            name="newRoom"
            onChange={this.handleEditChange}
            value={this.state.editRoomName}
            className="classListField"
            label="Edit Room Name"
          />
          <Button
            type="submit"
            variant="raised"
            color="secondary"
            className="classListButton editButton"
          >
            <i className="fas fa-pen-square" />
            Edit Name
          </Button>
        </form>
      </div>
    ) : (
      <div>
        <form className="submitRoomArea" onSubmit={this.handleSubmit}>
          <TextField
            type="text"
            name="newRoom"
            onChange={this.handleChange}
            value={this.state.newRoom}
            className="classListField"
            label="New Room Name"
          />
          <Button
            type="submit"
            variant="raised"
            color="primary"
            className="classListButton"
          >
            <i className="fas fa-plus-circle" />
            Add Room
          </Button>
        </form>
      </div>
    );

    return (
      <section className="chatRoomArea">
        <Paper>
          <Typography variant="headline" component="h3" color="primary">
            Chat Rooms
          </Typography>
        </Paper>
        <MenuList id="roomList">
          {this.state.rooms.map((room, index) => (
            <MenuItem
              key={index}
              onClick={e => this.props.selectRoom(room)}
              className="roomItem"
            >
              <span onClick={() => this.handleDelete(room.key)}>
                <i className="fas fa-times-circle"> </i>
              </span>
              {editButton}
              <ListItemText>{room.name}</ListItemText>
            </MenuItem>
          ))}
        </MenuList>
        {editForm}
      </section>
    );
  }
}

export default RoomList;
