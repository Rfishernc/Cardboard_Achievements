import React from 'react';
import gameData from '../../data/gameData';
import './gameDetail.scss';

class gameDetail extends React.Component {
  state = {
    gameInfo: null
  }

  componentDidMount() {
    const id = window.location.href.slice(window.location.href.search('=') + 1);
    gameData.getGameDetails(id)
      .then((gameInfo) => {
        this.setState({ gameInfo });
      });
  }

  render() {
    return(
      <div className='gameDetail'>

      </div>
    );
  }
}

export default gameDetail;