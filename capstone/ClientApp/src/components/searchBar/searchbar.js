import React from 'react';
import { InputGroup, Input, Button } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import gameData from '../../data/gameData';
import SearchResults from './searchResults/searchResults';
import './searchBar.scss';

class searchBar extends React.Component {
  state = {
    searchText: "",
    gameNames: null,
    achievementNames: null,
    usernames: null,
    closed: true,
}

componentDidMount() {
  this.searchClose();
  gameData.getNames()
    .then((data) => {
      this.setState({ 
        gameNames: data.gameNames,
        achievementNames: data.achievementNames,
        usernames: data.usernames });
    });
}

searchText = (event) => {
  this.setState({ searchText: event.target.value }, () => {
    if (this.state.searchText !== '') {
      this.setState({ closed: false });
    }
  });
}

selection = () => {
  this.setState({ searchText: '' });
}

searcher = () => {
  let resultString = '';
  if (this.props.games) {
    resultString += '+games';
  }
  if (this.props.achievements) {
    resultString += '+achievements';
  }
  if (this.props.users) {
    resultString += '+users';
  }
  return resultString;
}

searchClose = () => {
  document.getElementsByTagName('body')[0].addEventListener('click', (event) => {
    const parentsArray = [];
    let element = event.target;
    while (element) {
      parentsArray.unshift(element);
      element = element.parentNode;
    }
    parentsArray.forEach((ele) => {
      this.setState({ closed: true });
      if (ele.className !== undefined) {
        if (ele.className.includes('searchResult')) {
          this.setState({ closed: false });
          return;
        }
      }
      
    })
  });
}

searchOpen = () => {
  this.setState({ closed: false });
}

  render() {
    return(
      <div className='searchBar'>
        <InputGroup>
          <div className='searchBarContainer'>
            <Input className="input" type="text" placeholder="Search..." id='searchBar' value={this.state.searchText} onChange={this.searchText} autoComplete='off'/>
            {this.state.searchText === '' ? null
              :
              <SearchResults selection={this.selection} achievementNames={this.state.achievementNames} searchText={this.state.searchText}
                userNames={this.state.usernames} gameNames={this.state.gameNames} classMaker={'searchMenu'}
                games={this.props.games} achievements={this.props.achievements} users={this.props.users} closed={this.state.closed}/>}
          </div>
            <Button className="btn"><NavLink to={`/search-results/${this.searcher()}&${this.state.searchText}`}><i className="fas fa-search"></i></NavLink></Button>
        </InputGroup>
      </div>
    );
  }
}

export default searchBar;