import React from 'react';
import Menu from './menu/menu';
import SearchResults from '../searchBar/searchResults/searchResults';
import gameData from '../../data/gameData';
import achievementData from '../../data/achievementData';
import './submitAchievement.scss';

class submitAchievement extends React.Component {
  state = {
    achievement: '',
    gameText: '',
    game: '',
    gamesInfo: null,
    gameNames: null,
    link: '',
    error: false
  }

  componentDidMount() {
    gameData.getAllGames()
      .then((gamesInfo) => {
        this.setState({ gamesInfo }, () => {
          this.gameNamesMaker();
        });
      });
  }

  validate = () => {
    if (this.state.game === '') {
      this.setState({ error: 'No game selected' });
    }
    else if (this.state.achievement === '') {
      this.setState({ error: 'No achievement selected' });
    }
    else if (this.state.link === '') {
      this.setState({ error: 'No link entered' });
    }
  }

  gameNamesMaker = () => {
    const gameNames = [];
    Object.keys(this.state.gamesInfo).forEach((gameId) => {
      const gameName = this.state.gamesInfo[gameId][0].gameName;
      gameNames.push({name: gameName, id: gameId});
    });
    this.setState({ gameNames });
  }

  submitAchieve = (event) => {
    this.setState({ error: false });
    this.validate();
    event.preventDefault();
    const newAchievement = {
      achievementId: this.state.achievement,
      link: this.state.link,
      userId: this.props.userId
    }
    if (!this.state.error) {
      achievementData.submitAchievement(newAchievement)
      .then(() => {
        this.setState({ link: '', game: '' });
      });
    }
  }

  menuSelector = (selection) => {
    this.setState({ achievement: selection });
  }

  selectGame = (event) => {
    const val = event.target.value;
    this.setState({ gameText: val });
  }

  selection = (gameEvent) => {
    const selectedGame = {
      name: gameEvent.currentTarget.getAttribute('value'),
      id: gameEvent.currentTarget.id.replace('gamesearch', '')
    };
    this.setState({ game: selectedGame, achievement: '', gameText: '' });
  }

  selectLink = () => {
    const val = document.getElementById('linkInput').value;
    this.setState({ link: val });
  }

  render() {
    return(
      <div className='submitAchievement'>
        <p className='submitAchievementTitle'>Submit New Achievement</p>
        <form className='submitAchievementForm'>
          <div className="form-group">
            <label htmlFor="gameInput">Game</label>
            <input type="text" className="form-control" id="gameInput" placeholder="Enter game name" 
              autoComplete='off' onChange={this.selectGame} value={this.state.gameText}/>
          </div>
          {this.state.game? <p className='selectedGamePar'>{this.state.game.name}</p> : null}
          {this.state.gameText === '' ? null 
          : 
          <SearchResults searchText={this.state.gameText} gameNames={this.state.gameNames} classMaker={'searchMenu'}
              games={true} selection={this.selection} noPreview={true}/>}

          <div className="form-group">
            <Menu menuSelector={this.menuSelector} game={this.state.game} currentAchievement={this.state.achievement} 
              achievements={this.state.gamesInfo ? this.state.gamesInfo[this.state.game.id] : null}/>
          </div>
          <div className="form-group">
            <label htmlFor="linkInput">Link</label>
            <input type="text" className="form-control" id="linkInput" placeholder="Enter evidence link" onChange={this.selectLink}/>
          </div>
          <button type="submit" className="btn btn-primary" onClick={this.submitAchieve}>Submit</button>
        </form>
      </div>
    );
  }
}

export default submitAchievement;