import React from 'react';
import gameData from '../../data/gameData';
import { Link } from 'react-router-dom';
import './gamesList.scss';

class gamesList extends React.Component {
  state = {
    gamesInfo: null
  }

  componentDidMount() {
    gameData.getAllGames()
      .then((gamesInfo) => {
        this.setState({ gamesInfo });
      });
  }

  gamesBuilder = () => {
    if (this.state.gamesInfo !== null) {
      const renderArray = [];
      Object.keys(this.state.gamesInfo).forEach((gameId) => {

        const game = this.state.gamesInfo[gameId];
        let points = 0;
        game.forEach((achievement) => {
          points+= achievement.difficulty * 10;
        });

        renderArray.push(<Link className="card gameCard" style={{width: '18rem'}} key={game[0].gameId} to={`/game?Id=${game[0].gameId}`}>
        <img src={game[0].gameImage} className="card-img-top gameImg" alt="..."/>
        <div className="card-body">
          <h5 className="card-title">{game[0].gameName}</h5>
          <p className="card-text">{game.length} Achievements</p>
          <p className="card-text">{points} Total Points</p>
        </div>
      </Link>)
      });
      return renderArray;
    }
  }

  render() {
    return(
      <div className='gamesList'>
        {this.gamesBuilder()}
      </div>
    );
  }
}

export default gamesList;