import React from 'react';
import './searchPage.scss';
import Achievement from '../achievement/achievement';
import { Link } from 'react-router-dom';
import achievementData from '../../data/achievementData';
import gameData from '../../data/gameData';
import userData from '../../data/userData';

class searchPage extends React.Component {
  state = {
    games: false,
    achievements: false,
    users: false,
    gameNames: null,
    achievementNames: null,
    userNames: null,
    results: [],
    gamesInfo: null,
    achievementsInfo: null,
    usersInfo: null
  }
  
  componentDidMount() {
    if (this.props.match.params.query.includes('+games')) {
      this.setState({ games: true });
    } 
    
    if (this.props.match.params.query.includes('+achievements')) {
      this.setState({ achievements: true });
    }
    
    if (this.props.match.params.query.includes('+users')) {
      this.setState({ users: true });
    }
    
    gameData.getNames()
    .then((data) => {
      this.setState({ 
        gameNames: this.state.games ? data.gameNames : null,
        achievementNames: this.state.achievements ? data.achievementNames : null,
        userNames: this.state.users ? data.usernames : null}, () => {
          if (this.state.games) {
            this.getGamesInfo(this.searchBuilder('game'));
          }
          if (this.state.achievements) {
            this.getAchievementsInfo(this.searchBuilder('achievement'));
          }
          if (this.state.users) {
            this.getUsersInfo(this.searchBuilder('user'));
          }
        });
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.query !== this.props.match.params.query) {
      if (this.props.match.params.query.includes('+games')) {
        this.setState({ games: true });
      } 
      
      if (this.props.match.params.query.includes('+achievements')) {
        this.setState({ achievements: true });
      }
      
      if (this.props.match.params.query.includes('+users')) {
        this.setState({ users: true });
      }
      
      gameData.getNames()
      .then((data) => {
        this.setState({ 
          gameNames: this.state.games ? data.gameNames : null,
          achievementNames: this.state.achievements ? data.achievementNames : null,
          userNames: this.state.users ? data.usernames : null}, () => {
            if (this.state.games) {
              this.getGamesInfo(this.searchBuilder('game'));
            }
            if (this.state.achievements) {
              this.getAchievementsInfo(this.searchBuilder('achievement'));
            }
            if (this.state.users) {
              this.getUsersInfo(this.searchBuilder('user'));
            }
          });
      });
    }
  }

  getGamesInfo = (names) => {
    let stringedNames = '';
    if (names !== undefined) {
      names.forEach((name) => {
        stringedNames += `names=${name.name}&`;
      });
      gameData.getSearchedGames(stringedNames)
      .then((gamesInfo) => {
        this.setState({ gamesInfo });
      });
    }
  }

  getAchievementsInfo = (names) => {
    let stringedNames = '';
    if (names !== undefined) {
      names.forEach((name) => {
        stringedNames += `names=${name.name}&`;
      });
      achievementData.getSearchedAchievements(stringedNames)
        .then((achievementsInfo) => {
          this.setState({ achievementsInfo });
        });
    }
  }

  getUsersInfo = (names) => {
    let stringedNames = '';
    if (names !== undefined) {
      names.forEach((name) => {
        stringedNames += `names=${name.name}&`;
      });
      userData.getSearchedUsers(stringedNames)
        .then((usersInfo) => {
          this.setState({ usersInfo });
        });
    }
  }

  searchBuilder = (searchType) => {
    const results = [];
    const searchResultIds = [];
    const searchThis = this.props.match.params.query.slice(this.props.match.params.query.search('\\&') + 1);
    //Splits the seached input into array of individual words.
    const splitSearch = searchThis.split(' ');
  
    //Loops over the lists of seperated words and seperates each word into individual characters.
    splitSearch.forEach((word) => {
      const splitWord = word.split('');
     
    //Loops over the list of game names from database and splits each name into array of individual words.
      this.state[`${searchType}Names`].forEach((dbName) => {
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
          if (counter === splitWord.length && !searchResultIds.includes(searchType + dbName.Id) && counter > 0) {
              searchResultIds.push(searchType + dbName.Id);
                results.push(dbName);
          }
    
        });
      });
    });
    return results;
  }

  gameResultBuilder = () => {
    const renderArray = [];
    if (this.state.gamesInfo !== null) {
      this.state.gamesInfo.forEach((game) => {
        renderArray.push(<Link className='result' to={`/game?Id=${game.id}`} onMouseEnter={this.hovered} onMouseLeave={this.hoveredOut}>
          <img src={game.image} className='profilePic resultUnit' alt=''/>
          <div>
            <p className='resultUnit'>{game.name}</p>
            <p className='resultUnit'>{game.achievementCount} Total Achievements</p>
          </div>
          <div></div>
        </Link>);
      });
    }
    return renderArray;
  }

  achievementResultBuilder = () => {
    const renderArray = [];
    if (this.state.achievementsInfo !== null) {
      this.state.achievementsInfo.forEach((achievement) => {
        renderArray.push(<Achievement name={achievement.achievementName} difficulty={achievement.difficulty}
          description={achievement.description} dateAdded={achievement.dateAdded} gameName={achievement.gameName}
          hovered={this.hovered} hoveredOut={this.hoveredOut} historyPusher={this.historyPusher} gameId={achievement.gameId}/>);
      });
    }
    return renderArray;
  }

  userResultBuilder = () => {
    const renderArray = [];
    if (this.state.usersInfo !== null) {
      this.state.usersInfo.forEach((user) => {
        renderArray.push(<Link className='result' to={`/games+${user.id}`} onMouseEnter={this.hovered} onMouseLeave={this.hoveredOut}>
           <div className='resultUnitContainer'>
            <img src={user.profilePic} className='profilePic resultUnit' alt=''/>
            <p className='joinDate'>{user.joinDate.replace('T00:00:00', '')}</p>  
          </div>
          <div>
            <p className='resultUnit'>{user.username}</p>
            <p className='resultUnit'>{user.points} Total Points</p>
          </div>
          <div></div>
        </Link>);
      });
    }
    return renderArray;
  }

  hovered = (event) => {
    event.preventDefault();
    const link = event.currentTarget;
    if (link.className.includes(' hovered') === false) {
      link.className += ' hovered';
    }
  }

  hoveredOut = (event) => {
    event.preventDefault();
    const link = event.currentTarget;
    if (link.className.includes(' hovered')) {
      link.className = link.className.replace(' hovered', '');
    }
  }

  historyPusher = (event) => {
    const id = event.currentTarget.id.replace('achievement', '');
    this.props.history.push(`/game?Id=${id}`);
  }

  render() {
    return(
      <div className='searchPage'>
        <p className='searchMainTitle'>Search Results for '{this.props.match.params.query.slice(this.props.match.params.query.search('\\&') + 1)}'</p>
        <div className='searchMain'>
          {this.state.gameNames ? <div className='searchPageContainer'>
              <p className='searchPageTitle'>Games</p>
              {this.gameResultBuilder()}
            </div> : null}
          {this.state.achievementNames ? <div className='searchPageContainerA'>
              <p className='searchPageTitleA'>Achievements</p>
              {this.achievementResultBuilder()}
            </div> : null}
          {this.state.userNames ? <div className='searchPageContainer'>
              <p className='searchPageTitle'>Users</p>
              {this.userResultBuilder()}
            </div> : null}
          </div>
      </div>
    );
  }
}

export default searchPage;