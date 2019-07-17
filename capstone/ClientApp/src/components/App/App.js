import React from 'react';
import NavbarC from '../navbarC/navbarC';
import Home from '../home/home';
import Gamers from '../gamers/gamers';
import MyAchievements from '../myAchievements/myAchievements';
import GamesList from '../gamesList/gamesList';
import connection from '../../data/connection';
import firebase from 'firebase/app';
import {
  BrowserRouter, Route, Redirect, Switch,
} from 'react-router-dom';
import profileCalls from '../../data/profileCalls';
import './App.scss';

connection();

// const PublicRoute = ({ component: Component, loginStatus, currentPath, currentUser, ...rest }) => {
//   const routeChecker = props => (loginStatus === false
//     ? (<Component { ...props } currentPath={currentPath} currentUser={currentUser}/>)
//     : (<Redirect to={{ pathname: currentPath, state: { from: props.location } } } />));
//   return <Route {...rest} render={props => routeChecker(props)} />;
// };

// const PrivateRoute = ({ component: Component, loginStatus, currentUser, searchData, ...rest }) => {
//   const routeChecker = props => (loginStatus === true
//     ? (<Component { ...props } loginStatus={loginStatus} currentUser={currentUser} searchData={searchData}/>)
//     : (<Redirect to={{ pathname: '/register', state: { from: props.location } } } />));
//   return <Route {...rest} render={props => routeChecker(props)} />;
// };

 class App extends React.Component {
  state = {
    loginStatus: false,
    pendingUser: true,
    creationDate: undefined,
    id: undefined,
    userName: undefined,
    currentPath: window.location.pathname 
  }

  componentDidMount() {
    this.removeListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        profileCalls.currentUserInfo(user.uid)
        .then(profileInfo => {
          const content = profileInfo.data
            this.setState({
              creationDate: content.creationDate,
              id: content.id,
              userName: content.userName,
              loginStatus: true,
              pendingUser: false
            });
          })
        .catch(err => {
          console.error(err);
        });
      } else {
        this.setState({
          loginStatus: false,
          pendingUser: false,
          creationDate: undefined,
          id: undefined,
          userName: undefined,
        });
      }
    });
  }

  componentWillUnmount() {
    this.removeListener();
  }

  render() {

    const currentUser = {
      creationDate: this.state.creationDate,
      id: this.state.id,
      userName: this.state.userName,
    }

    return (
        <BrowserRouter>
          <NavbarC moderator={false}/>
          <React.Fragment>
              <div className="switch-comp">
            <Switch>
              <Route path='/home' exact component={Home} currentPath={this.state.currentPath} loginStatus={this.state.loginStatus} currentUser={currentUser}/>
              <Route path='/' exact component={Home} currentPath={this.state.currentPath} loginStatus={this.state.loginStatus} currentUser={currentUser}/>
              <Route path='/gamers' component={Gamers} currentPath={this.state.currentPath} loginStatus={this.state.loginStatus} currentUser={currentUser}/>
              <Route path='/gamers' component={Gamers} currentPath={this.state.currentPath} loginStatus={this.state.loginStatus} currentUser={currentUser}/>
              <Route path='/games+*' component={GamesList} currentPath={this.state.currentPath} loginStatus={this.state.loginStatus} currentUser={currentUser}/>
              <Route path='/myachievements' component={MyAchievements} currentPath={this.state.currentPath} loginStatus={this.state.loginStatus} currentUser={currentUser}/>
            </Switch>
              </div>
          </React.Fragment>
        </BrowserRouter>
    );
  }
}

export default App;