import React from 'react';
import {
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import SearchBar from '../searchBar/searchbar';
import Login from '../login/login';
import './navbarC.scss';

class navbarC extends React.Component {
  state = {
    gameMenu: false
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
              <NavLink tag={RRNavLink} to='/mygames' onMouseEnter={this.gameMenuHovered} onMouseLeave={this.gameMenuHoveredOut} className='gameMenuItem' id='myGamesLink'>My Games</NavLink>
              <NavLink tag={RRNavLink} to='/allgames' onMouseEnter={this.gameMenuHovered} onMouseLeave={this.gameMenuHoveredOut} className='gameMenuItem' id='allGamesLink'>All Games</NavLink>
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
                <SearchBar className="searchBar"/>
                <NavLink tag={RRNavLink} to='/home' onMouseEnter={this.hovered} onMouseLeave={this.hoveredOut}>
                  <i className="fas fa-home"></i> Home
                </NavLink>
                <NavLink tag={RRNavLink} to='/myachievements' onMouseEnter={this.hovered} onMouseLeave={this.hoveredOut}>
                  <i class="fas fa-trophy"></i> My Achievements
                </NavLink>
                <NavLink tag={RRNavLink} to='/gamers' onMouseEnter={this.hovered} onMouseLeave={this.hoveredOut}>
                  <i class="fas fa-user-friends"></i> Gamers
                </NavLink>
                <div onMouseEnter={this.dropDown} onMouseLeave={this.dropDownOut} className={this.state.gameMenu ? 'nav-link hovered' : 'nav-link'} id='gameLink'>
                  <i class="fas fa-dice"></i> View Games
                  <div id='dropdownMenuDiv'>
                    {this.state.gameMenu ? this.gameMenu() : null}
                  </div>
                </div>
                {this.props.moderator ? <NavLink tag={RRNavLink} to='/mods' onMouseEnter={this.hovered} onMouseLeave={this.hoveredOut}>
                  <i className="fas fa-home"></i> Moderator Portal
                </NavLink> : null}
                {this.props.loggedIn ? <p onClick={this.logoutClicked} className='nav-link'
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