import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import { Link } from 'react-router-dom';
import ResultDetail from '../resultDetail/resultDetail';
import achievementData from '../../../data/achievementData';
import gameData from '../../../data/gameData';
import userData from '../../../data/userData';
import './searchResults.scss';

class searchResults extends React.Component {
  state = {
    popoverOpen: false,
    popOverInfo: null
  }

  searchBuilder = (searchType) => {
    const searchResultRender = [];
    const searchResultIds = [];
    //Splits the seached input into array of individual words.
    const splitSearch = this.props.searchText.split(' ');
  
    //Loops over the lists of seperated words and seperates each word into individual characters.
    splitSearch.forEach((word) => {
      const splitWord = word.split('');
     
    //Loops over the list of game names from database and splits each name into array of individual words.
      this.props[`${searchType}Names`].forEach((dbName) => {
        const splitNames = dbName.name.split(' ');
  
    //Loops over each word in a game name and seperates into an array of individual characters.
        splitNames.forEach((nameWord) => {
          const splitNameWord = nameWord.split('');
    
    //Loops over the seperated search word and trys to match each character vs the character in the corresponding
    //position in the word from the name in database.
          let counter = 0;
          for (let i = 0; i < splitWord.length; i += 1) {
            if (splitNameWord.length > i) {
              if (splitNameWord[i].toLowerCase() === splitWord[i].toLowerCase()) {
                counter += 1;
              }
            }
          }
    //Renders a match if each character in sequence matches their corresponding character. If a game name has already been rendered, will not create a copy.
          if (counter === splitWord.length && searchResultRender.length < 10
            && !searchResultIds.includes(searchType + dbName.Id) && counter > 0) {

              searchResultIds.push(searchType + dbName.Id);
              if (this.props.noPreview) {
                searchResultRender.push(<div id={`${searchType}search${dbName.id}`} key={`${searchType}search${dbName.id}`} 
                  className={`${searchType}Item`} onClick={this.props.selection} value={dbName.name}>
                  {this.iconBuilder(searchType)} {dbName.name}
                </div>);
              } 
              else {
                searchResultRender.push(<Link className={`${searchType}Item`} value={dbName.name} id={`${searchType}search${dbName.id}`}
                  onClick={this.selection} onMouseEnter={this.props.noPreview ? null : this.startCount} to={this.selection(dbName, searchType)}
                  key={`${searchType}search${dbName.id}`}>{this.iconBuilder(searchType)} {dbName.name}</Link>);
              }   
          }
    
        });
      });
    });
    return searchResultRender;
  }

  iconBuilder = (searchType) => {
    switch (searchType) {
      case 'game' : return <p className='resultIcon'>G</p>;
      case 'user' : return <p className='resultIcon'>U</p>;
      case 'achievement' : return <p className='resultIcon'>A</p>;
      default : break;
    }
  }

  startCount = (event) => {
    const tar = event.target;
    tar.addEventListener('mouseout', () => {
      clearTimeout(popOverTimer);
    })
    const popOverTimer = setTimeout(this.popOverBuilder, 2000, tar.id);
  }

  popOverBuilder = (tarId) => {
    const id = tarId.slice(tarId.search('search') + 6);
    if (tarId.includes('gamesearch')) {
      gameData.getGameForSearchResult(id)
        .then((data) => {
          this.setState({ popoverOpen: true });
          this.setState({ popOverInfo: <ResultDetail target={tarId} game={true} popoverOpen={this.state.popoverOpen} toggle={this.toggle}
            name={data.name} link={data.link} image={data.image} achievementCount={data.achievementCount} /> });
          
        });
    } else if (tarId.includes('achievementsearch')) {
      achievementData.getAchievementForSearchResult(id)
        .then((data) => {
          this.setState({ popoverOpen: true });
          this.setState({ popOverInfo: <ResultDetail target={tarId} achievement={true} popoverOpen={this.state.popoverOpen}
            toggle={this.toggle} achievementName={data.achievementName} gameName={data.gameName} description={data.description}
            dateAdded={data.dateAdded} image={data.image} difficulty={data.difficulty}/> });

        }); 
    } else {
      userData.getUserForSearchResult(id)
        .then((data) => {
          this.setState({ popoverOpen: true });
          this.setState({ popOverInfo: <ResultDetail target={tarId} user={true} popoverOpen={this.state.popoverOpen} toggle={this.toggle}
            username={data.username} profilePic={data.profilePic} points={data.points}
            totalAchievements={data.totalAchievements} joinDate={data.joinDate}/> });
          
        });
    }
  }

  selection = (item, searchType) => {
    switch (searchType) {
    case 'game' : return `/game?Id=${item.id}`;
    case 'achievement' : return `/game?Id=${item.id}`;
    case 'user' : return `/games+${item.id}`;
    default : break;
    }
    this.props.selection();
  }

  classMaker = () => {
    if (this.props.classMaker === 'searchMenu') {
      return 'searchMenu';
    }
    return 'searchListings';
  }

  render() {
    return(
      <div className='searchResults'>
        {this.state.popOverInfo ? this.state.popOverInfo : null}
        <Dropdown isOpen={!this.props.closed}>
          <DropdownToggle caret className='dropdownBeGone'>
          </DropdownToggle>
          {!this.props.closed ? <DropdownMenu className={this.classMaker()}>
            {this.props.games ? this.searchBuilder('game') : null}
            {this.props.achievements ? this.searchBuilder('achievement') : null}
            {this.props.users ? this.searchBuilder('user') : null}
          </DropdownMenu> : null}
        </Dropdown>
      </div>
    );
  }
}

export default searchResults;