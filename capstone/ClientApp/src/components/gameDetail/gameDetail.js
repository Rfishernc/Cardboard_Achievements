import React from 'react';
import gameData from '../../data/gameData';
import achievementData from '../../data/achievementData';
import Achievement from '../achievement/achievement';
import { Button } from 'reactstrap';
import './gameDetail.scss';

class gameDetail extends React.Component {
  state = {
    gameInfo: null,
    playersInfo: null,
    achievementInfo: [],
  }

  componentDidMount() {
    const gameId = window.location.href.slice(window.location.href.search('=') + 1);
    gameData.getGameDetails(gameId, this.props.currentUser)
      .then((gameInfo) => {
        this.setState({ gameInfo });
      });
    achievementData.getUsersAchievementsForGame(this.props.currentUser, gameId)
      .then((achievementInfo) => {
        this.setState({ achievementInfo });
      });
    gameData.getNumberOfPlayers(gameId)
      .then((playersInfo) => {
        this.setState({ playersInfo });
      });
    gameData.getGamePopularity(gameId)
      .then((popularity) => {
        this.setState({ popularity });
      });
  }

  pointsTotalizer = (target) => {
    let points = 0;
    target.forEach((achievement) => {
      points+= achievement.difficulty * 10;
    });
    return points;
  }

  viewProposed = () => {
    this.props.history.push(`/voting/game?Id=${this.state.gameInfo[0].gameId}`);
  }

  detailsBuilder = () => {
    if (this.state.gameInfo !== null) {
      return <div>
        <div className='gameInfoContainer'>
          <div className="card gameCard" style={{width: '18rem'}}>
            <img src={this.state.gameInfo[0].gameImage} className="card-img-top gameImg" alt="..."/>
          </div>
          <div className='gameInfo'>
            <p className='gameInfoUnit'>{this.state.gameInfo.length} Total Achievements</p>
            <p className='gameInfoUnit'>{this.pointsTotalizer(this.state.gameInfo)} Total Points</p>
            <p className='gameInfoUnit'>{((this.state.achievementInfo.length / this.state.gameInfo.length) * 100).toFixed(1)} % Completed</p>
            <p className='gameInfoUnit'>{this.pointsTotalizer(this.state.achievementInfo)} Out of {this.pointsTotalizer(this.state.gameInfo)} Points Earned</p>
            <p className='gameInfoUnit'>{this.state.playersInfo} Total Players</p>
            <p className='gameInfoUnit'>Popularity Ranking: #{this.state.popularity}</p>
          </div>
        </div>
        <div className='detailsLinksContainer'>
          <a href={this.state.gameInfo[0].link} className='gameLink'>BoardgameGeek Page</a>
          <Button className='btn btn-dark btn-sm' onClick={this.viewProposed}>
            View Proposed Achievements For {this.state.gameInfo[0].gameName}</Button>
        </div>
      </div>
    }
  }

  achievementsBuilder = () => {
    if (this.state.gameInfo !== null) {
      const renderArray = [];
      this.state.gameInfo.forEach((achievement) => {
        renderArray.push(<Achievement image={achievement.achievementImage} name={achievement.achievementName} key={achievement.achievementId}
          difficulty={achievement.difficulty} description={achievement.description} dateAdded={achievement.dateAdded}
          completed={this.props.currentUser ? (achievement.completed ? <i className="fas fa-trophy completed"></i> : <i className="fas fa-trophy fail"></i>) : null} voteStatus='approved'/>);
      });
      return renderArray;
    }
  }

  render() {
    return(
      <div className='gameDetail'>
        {this.detailsBuilder()}
        <div className='gameAchievementsContainer'>
          {this.achievementsBuilder()}
        </div>
      </div>
    );
  }
}

export default gameDetail;