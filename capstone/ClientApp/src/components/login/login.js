import React from 'react';
import {
  Modal, ModalHeader, ModalBody, Button
} from 'reactstrap';
import firebase from 'firebase/app';
import 'firebase/auth';
import registerData from '../../data/registerData';
import profileCalls from '../../data/profileCalls';
import './login.scss';

class login extends React.Component {
  state = {
    modal: false,
    email: '',
    password: '',
    username: '',
    error: false,
    loggingIn: true
  }

  toggle = () => {
    this.setState({
      loggingIn: true,
      modal: !this.state.modal,
    });
  }

  //Updates the relevant state whenever a form field is edited.
  updateField = (event) => {
    const val = event.target.value;
    switch(event.target.id) {
      case 'emailInputLogin' : this.setState({ email : val }); break;
      case 'passwordInputLogin' : this.setState({ password : val }); break; 
      case 'usernameInputLogin' : this.setState({ username: val }); break;
      default : break;
    }
  }

  registerUser = () => {
    registerData.createUser(this.state.email, this.state.password, this.state.username)
      .then(() => {
        
      });
  }

  //Runs the form validator and then if it passes logs the user in through firebase and reroutes them to the correct page.
  loginUser = () => {
    this.setState({ error: false });
    this.validate();
    if (!this.state.error) {
      firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        this.historyPusher();
      })
      .catch((err) => {
        if (err.code === 'auth/wrong-password') {
          this.setState({ error: 'Incorrect password entered' });
        }
      });
    }  
  }

  validate = () => {
    if (this.state.email === '') {
      this.setState({ error: 'No email entered' });
    } else if (this.state.password === '') {
      this.setState({ error: 'No password entered' });
    } else if (this.state.password.length < 6) {
      this.setState({ error: 'Password must be at least 6 characters' });
    }
  }

  hovered = (event) => {
    event.preventDefault();
    const link = event.target;
    if (link.className.includes(' hovered') === false) {
      link.className += ' hovered';
    }
  }

  hoveredOut = (event) => {
    event.preventDefault();
    const link = event.target;
    if (link.className.includes(' hovered')) {
      link.className = link.className.replace(' hovered', '');
    }
  }

  goToRegister = () => {
    this.setState({ loggingIn: false });
  }

  render() {
    return(
      <div className='login'>
        <p className='nav-link' onClick={this.toggle}
                  onMouseEnter={this.hovered} onMouseLeave={this.hoveredOut}> 
                  <i className="fas fa-sign-in-alt"></i> Login
        </p> 
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader className='loginM' toggle={this.toggle}>
            {this.state.loggingIn ? 'Login to Cardboard Achievements' : 'Register a new account'}
          </ModalHeader>
          <ModalBody className='loginM'>
            {this.state.loggingIn ? 
            <div>
              <form>
                <div className="form-group">
                  <label htmlFor="usernameInputLogin">Username</label>
                  <input type="email" className="form-control" id="usernameInputLogin" placeholder="Enter username" onChange={this.updateField}/>
                </div>
                <div className="form-group">
                  <label htmlFor="emailInputLogin">Email</label>
                  <input type="email" className="form-control" id="emailInputLogin" placeholder="Enter email" onChange={this.updateField}/>
                </div>
                <div className="form-group">
                  <label htmlFor="passwordInputLogin">Password</label>
                  <input type="password" className="form-control" id="passwordInputLogin" placeholder="Enter password" onChange={this.updateField}/>
                </div>
              </form>
              <p className='registerLink' onClick={this.goToRegister}>Register a new account</p>
            </div>             
            : 
            <div>
              <form>
                <div className="form-group">
                  <label htmlFor="emailInputLogin">Email</label>
                  <input type="email" className="form-control" id="emailInputLogin" placeholder="Enter email" onChange={this.updateField}/>
                </div>
                <div className="form-group">
                  <label htmlFor="passwordInputLogin">Password</label>
                  <input type="password" className="form-control" id="passwordInputLogin" placeholder="Enter password" onChange={this.updateField}/>
                </div>
                <div className="form-group">
                  <label htmlFor="usernameInputLogin">Username</label>
                  <input type="text" className="form-control" id="usernameInputLogin" placeholder="Enter username" onChange={this.updateField}/>
                </div>
              </form>
              <Button onClick={this.registerUser}>Register</Button>
              <p className='errorMsg'>{this.state.error ? this.state.error : null}</p>
            </div>}
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default login;