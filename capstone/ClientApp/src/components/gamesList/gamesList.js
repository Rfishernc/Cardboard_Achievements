import React from 'react';
import gameData from '../../data/gameData';
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

        renderArray.push(<div className="card" style={{width: '18rem'}} key={game[0].gameId}>
        <img src={game[0].gameImage} className="card-img-top" alt="..."/>
        <div className="card-body">
          <h5 className="card-title">{game[0].gameName}</h5>
          <p className="card-text">Achievement Stuff Here</p>
        </div>
      </div>)
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