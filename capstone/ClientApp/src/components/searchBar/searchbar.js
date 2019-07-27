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
    usernames: null
}

componentDidMount() {
  gameData.getNames()
    .then((data) => {
      this.setState({ 
        gameNames: data.gameNames,
        achievementNames: data.achievementNames,
        usernames: data.usernames });
    });
}

searchText = (event) => {
  this.setState({ searchText: event.target.value });
}

selection = () => {
  this.setState({ searchText: '' });
}

  render() {
    return(
      <div className='searchBar'>
        <InputGroup>
            <Input className="input" type="text" placeholder="Search..." id='searchBar' value={this.state.searchText} onChange={this.searchText}/>
            {this.state.searchText === '' ? null
              :
              <SearchResults selection={this.selection} achievementNames={this.state.achievementNames} searchText={this.state.searchText}
                userNames={this.state.usernames} gameNames={this.state.gameNames} classMaker={'searchMenu'}
                games={this.props.games} achievements={this.props.achievements} users={this.props.users}/>}
            <Button className="btn"><NavLink to="/search-results"><i className="fas fa-search"></i></NavLink></Button>
        </InputGroup>
      </div>
    );
  }
}

export default searchBar;