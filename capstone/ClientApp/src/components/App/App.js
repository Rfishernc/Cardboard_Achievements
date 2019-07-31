import React from 'react';
import NavbarC from '../navbarC/navbarC';
import Home from '../home/home';
import Gamers from '../gamers/gamers';
import MyAchievements from '../myAchievements/myAchievements';
import GamesList from '../gamesList/gamesList';
import GameDetail from '../gameDetail/gameDetail';
import ModeratorPortal from '../moderatorPortal/moderatorPortal';
import VotingPage from '../voting/votingPage/votingPage';
import connection from '../../data/connection';
import firebase from 'firebase/app';
import {
  BrowserRouter, Route, Switch
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

const RouteMe = ({ component: Component, currentUser, ...rest }) => {
  const routeChecker = props => (<Component { ...props } currentUser={currentUser}/>);
  return <Route {...rest} render={props => routeChecker(props)} />;
};

 class App extends React.Component {
  state = {
    loginStatus: false,
    pendingUser: true,
    currentPath: window.location.pathname,
    currentUser: null
  }

  componentDidMount() {
    this.removeListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        profileCalls.currentUserInfo(user.uid)
        .then(profileInfo => {
          const content = profileInfo.data
            this.setState({
              currentUser: content,
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
          currentUser: undefined,
        });
      }
    });
  }

  componentWillUnmount() {
    this.removeListener();
  }

  render() {

    return (
        <BrowserRouter>
          <NavbarC moderator={true}/>
          <React.Fragment>
              <div className="switch-comp">
            <Switch>
              <RouteMe path='/home' exact component={Home} currentPath={this.state.currentPath} currentUser={this.state.currentUser}/>
              <RouteMe path='/' exact component={Home} currentPath={this.state.currentPath} currentUser={this.state.currentUser}/>
              <Route path='/gamers' component={Gamers} currentPath={this.state.currentPath} loginStatus={this.state.loginStatus} currentUser={this.state.currentUser}/>
              <Route path='/gamers' component={Gamers} currentPath={this.state.currentPath} loginStatus={this.state.loginStatus} currentUser={this.state.currentUser}/>
              <Route path='/games+*' component={GamesList} currentPath={this.state.currentPath} loginStatus={this.state.loginStatus} currentUser={this.state.currentUser}/>
              <Route path='/achievements' component={MyAchievements} currentPath={this.state.currentPath} loginStatus={this.state.loginStatus} currentUser={this.state.currentUser}/>
              <Route path='/game' component={GameDetail} currentPath={this.state.currentPath} loginStatus={this.state.loginStatus} currentUser={this.state.currentUser}/>
              <Route path='/mods' component={ModeratorPortal} currentPath={this.state.currentPath} loginStatus={this.state.loginStatus} currentUser={this.state.currentUser}/>
              <Route path='/voting' component={VotingPage} currentPath={this.state.currentPath} loginStatus={this.state.loginStatus} currentUser={this.state.currentUser}/>
            </Switch>
              </div>
          </React.Fragment>
        </BrowserRouter>
    );
  }
}

export default App;