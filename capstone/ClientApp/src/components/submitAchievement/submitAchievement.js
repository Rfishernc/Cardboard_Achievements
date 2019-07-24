import React from 'react';
import Menu from './menu/menu';
import gameData from '../../data/gameData';
import achievementData from '../../data/achievementData';
import './submitAchievement.scss';

class submitAchievement extends React.Component {
  state = {
    achievement: '',
    game: '',
    gamesInfo: null,
    gameNames: null,
    link: ''
  }

  componentDidMount() {
    gameData.getAllGames()
      .then((gamesInfo) => {
        this.setState({ gamesInfo }, () => {
          this.gameNamesMaker();
        });
      });
  }

  gameNamesMaker = () => {
    const gameNames = [];
    Object.keys(this.state.gamesInfo).forEach((gameId) => {
      const gameName = this.state.gamesInfo[gameId][0].gameName;
      gameNames.push({gameName, gameId});
    });
    this.setState({ gameNames });
  }

  submitAchieve = (event) => {
    event.preventDefault();
    const newAchievement = {
      achievementId: this.state.achievement,
      link: this.state.link,
      userId: this.props.userId
    }
    achievementData.submitAchievement(newAchievement)
      .then(() => {
        this.setState({ link: '', game: '' });
      });
  }

  menuSelector = (selection) => {
    this.setState({ achievement: selection });
  }

  selectGame = (event) => {
    const val = event.target.value;
    this.state.gameNames.forEach((game) => {
      if (game.gameName === val) {
        this.setState({ game });
      }
    });
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
            <input type="text" className="form-control" id="gameInput" placeholder="Enter game name" onChange={this.selectGame}/>
          </div>
          <div className="form-group">
            <Menu menuSelector={this.menuSelector} game={this.state.game} achievements={this.state.gamesInfo ? this.state.gamesInfo[this.state.game.gameId] : null}/>
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