import React from 'react';
import {
  Modal, ModalHeader, ModalBody, Button
} from 'reactstrap';
import './declineMsg.scss';

class declineMsg extends React.Component {
  state = {
    msg: '',
    modal: false
  }

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  }

  select = (event) => {
    this.setState({ msg: event.target.value });
  }

  declineAchievement = () => {
    this.props.decline(this.state.msg);
  }

  render() {
    return(
      <div className='declineMsg'>
        <Button className='btn btn-danger btn-sm' onClick={this.toggle}>Decline</Button>
        <Modal className='declineMsgModal' isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader className='declineMsgHeader' toggle={this.toggle}>
            Please Enter Reason for Declining Achievement
          </ModalHeader>
          <ModalBody className='declineMsgBody'>
            <div className="form-group">
              <label htmlFor="msgInput">Declining Reason: </label>
              <input type="text" className="form-control" id="declingInput" onChange={this.select}/>
              <Button className='btn btn-sm btn-dark' onClick={this.declineAchievement}>Submit</Button>
            </div>
          </ModalBody>
          </Modal>
      </div>
    );
  }
}

export default declineMsg;