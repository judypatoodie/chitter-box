import React, { Component } from 'react';
import { Button, Form, ControlLabel, FormGroup, FormControl, Modal  } from 'react-bootstrap';
import './RoomsList.css';

class RoomList extends Component {
  constructor(props) {
  super(props);

    this.state= {
      rooms: [],
      changedRoomName: this.props.content,
      roomName: '',
      show: false,
      overlay: (

            <Form inline onSubmit={(e)=>this.createRoom(e)}>
              <FormGroup controlId="formInlineName">
                <ControlLabel>Room Name</ControlLabel>{' '}
                <FormControl onChange={(e) => this.handleChange(e)} type="text" placeholder="Lunch Room" />
              </FormGroup>{' '}
              <FormGroup controlId="formInlineEmail">
              </FormGroup>{' '}
              <Button bsStyle="primary" className="submitButton" type="submit" >Create Room</Button>
            </Form>

      )

  };
  this.roomsRef = this.props.firebase.database().ref('rooms');

}

handleClose() {
   this.setState({ show: false });
 }

 handleShow() {
   this.setState({ show: true });
 }

handleChange(e){
  e.preventDefault();
  let newChatRoom = e.target.value;
     this.setState({roomName: newChatRoom});
}

createRoom(e){
  let newRoomName = this.state.roomName;
  this.roomsRef.push({
    name: newRoomName
  })
  this.setState({roomName: ''});
}

 componentDidMount() {
  this.roomsRef.on('child_added', snapshot => {
    const room = snapshot.val();
    room.key = snapshot.key;
    this.setState({ rooms: this.state.rooms.concat( room ) })
    console.log(room.key)
  });
}

getActiveRoom = (e) => {
  let clickedRoomName = e.target.dataset.value;
  let roomKey = e.target.dataset.key;
  this.props.replace(clickedRoomName, roomKey);
};



  render() {



    return (
      <section className="chatColumn">
      <h1 className="colTitle">Bloc Chat</h1>
      <Button bsStyle="success" style={{float:'right'}} onClick={() => this.handleShow()}>New Room </Button>

      <Modal show={this.state.show} onHide={() => this.handleClose() }>
        <Modal.Header closeButton>
          <Modal.Title>Create New Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.state.overlay}
        </Modal.Body>
        <Modal.Footer>
              <Button className="cancelButton" bsStyle="danger" onClick={() => this.handleClose()}>Cancel</Button>
        </Modal.Footer>

       </Modal>

          <div className="roomsList">
            {this.state.rooms.map((room,index)  =>
            <p key={index} data-value={room.name} data-key={room.key} onClick={this.getActiveRoom}>{room.name}</p>)}
          </div>
        </section>


    );
  }
}

export default RoomList;
