import React from 'react';
import {
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
} from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import SearchBar from '../searchBar/searchbar';
import Login from '../login/login';
import Notification from './notification/notification';
import userData from '../../data/userData';
import './navbarC.scss';

class navbarC extends React.Component {
  state = {
    gameMenu: false,
    notificationsInfo: null,
    popoverOpen: false
  }

  componentDidMount() {
    if (this.props.currentUser) {
      userData.getNotifications(this.props.currentUser)
        .then((notificationsInfo) => {
          this.setState({ notificationsInfo });
        })
    }
  }

  refresh = () => {
    userData.getNotifications(this.props.currentUser)
    .then((notificationsInfo) => {
      this.setState({ notificationsInfo }, () => {
        this.setState({ popoverOpen: true });
      });
    });
  }

  toggle = () => {
    this.setState({ popoverOpen: !this.state.popoverOpen });
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

  logoutClicked = (event) => {
    event.preventDefault();
    firebase.auth().signOut();
  }

  dropDown = (event) => {
    this.setState({ gameMenu: true });
    event.preventDefault();
    const link = event.target;
    if (link.className.includes(' hovered') === false) {
      link.className += ' hovered';
    }
  }

  dropDownOut = (event) => {
    event.preventDefault();
    const link = event.target;
    if (link.className.includes(' hovered')) {
      link.className = link.className.replace(' hovered', '');
    }
    this.setState({ gameMenu: false });
  }

  gameMenuHovered = (event) => {
    this.setState({ gameMenu: true });
    const link = event.target;
    if (link.className.includes(' hovered') === false) {
      link.className += ' hovered';
    }
  }

  gameMenuHoveredOut = (event) => {
    event.preventDefault();
    const link = event.target;
    if (link.className.includes(' hovered')) {
      link.className = link.className.replace(' hovered', '');
    }
    this.setState({ gameMenu: false });
  }


  gameMenu = () => {
    return <div id='gameMenu' onMouseEnter={this.dropDown} onMouseLeave={this.dropDownOut}>
              {this.props.currentUser ? <NavLink tag={RRNavLink} to={`/games+${this.props.currentUser}`} onMouseEnter={this.gameMenuHovered} onMouseLeave={this.gameMenuHoveredOut} className='gameMenuItem' id='myGamesLink'>My Games</NavLink> : null}
              <NavLink tag={RRNavLink} to='/games+all' onMouseEnter={this.gameMenuHovered} onMouseLeave={this.gameMenuHoveredOut} className='gameMenuItem' id='allGamesLink'>All Games</NavLink>
            </div>;
  }

  render() {
    return(
      <div className='navbarC'>
        <Navbar color="dark" dark expand="md">
          <NavbarBrand className='navTitle' href="/">
            Cardboard Achievements
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
            <Nav className="ml-auto" navbar>
              <NavItem className='navLinks'>
                <SearchBar className="searchBar" games={true} achievements={true} users={true}/>
                <NavLink tag={RRNavLink} to='/home' onMouseEnter={this.hovered} onMouseLeave={this.hoveredOut}>
                  <i className="fas fa-home"></i> Home
                </NavLink>
                {this.props.currentUser ? <NavLink tag={RRNavLink} to={`/achievements?Id=${this.props.currentUser}`} onMouseEnter={this.hovered} onMouseLeave={this.hoveredOut}>
                  <i className="fas fa-trophy"></i> My Achievements 
                </NavLink> : null}

                {this.state.notificationsInfo && this.state.notificationsInfo.length > 0 ? <Button className='notificationsButton btn-dark'
                  id='notificationsButton' onClick={this.toggle}>
                    <span className="badge badge-light">{this.state.notificationsInfo.length}</span>
                  </Button> : null}
                  
                  {this.state.notificationsInfo && this.state.notificationsInfo.length > 0 ? 
                    <Notification notificationsInfo={this.state.notificationsInfo}
                    refresh={this.refresh} popoverOpen={this.state.popoverOpen}/> : null}

                <NavLink tag={RRNavLink} to='/gamers' onMouseEnter={this.hovered} onMouseLeave={this.hoveredOut}>
                  <i className="fas fa-user-friends"></i> Gamers
                </NavLink>
                <div onMouseEnter={this.dropDown} onMouseLeave={this.dropDownOut} className={this.state.gameMenu ? 'nav-link hovered' : 'nav-link'} id='gameLink'>
                  <i className="fas fa-dice"></i> View Games
                  <div id='dropdownMenuDiv'>
                    {this.state.gameMenu ? this.gameMenu() : null}
                  </div>
                </div>
                {this.props.moderator ? <NavLink tag={RRNavLink} to='/mods' onMouseEnter={this.hovered} onMouseLeave={this.hoveredOut}>
                  <i className="fas fa-home"></i> Moderator Portal
                </NavLink> : null}
                {this.props.currentUser ? <p onClick={this.logoutClicked} className='nav-link'
                  onMouseEnter={this.hovered} onMouseLeave={this.hoveredOut}>
                  <i className="fas fa-sign-out-alt"></i> Logout
                </p> 
                :
                <Login />}
              </NavItem>
            </Nav>
        </Navbar>
      </div>
    );
  }
}

export default navbarC;