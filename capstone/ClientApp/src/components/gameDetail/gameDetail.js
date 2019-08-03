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
    gameId: window.location.href.slice(window.location.href.search('=') + 1)
  }

  componentDidMount() {
    gameData.getNumberOfPlayers(this.state.gameId)
      .then((playersInfo) => {
        this.setState({ playersInfo });
      });
    gameData.getGamePopularity(this.state.gameId)
      .then((popularity) => {
        this.setState({ popularity });
      });
  }

  componentDidUpdate() {
    this.checkUserStatus();
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
          {this.props.currentUser ? <Button className='btn btn-dark btn-sm' onClick={this.viewProposed}>
            View Proposed Achievements For {this.state.gameInfo[0].gameName}</Button> : null}
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

  checkUserStatus = () => {
    if (this.props.currentUser) {
      if (this.state.currentUser) {
        return;
      }
      else {
        this.setState({ currentUser: this.props.currentUser }, () => {
          gameData.getGameDetails(this.state.gameId, this.state.currentUser)
          .then((gameInfo) => {
            achievementData.getUsersAchievementsForGame(this.props.currentUser, this.state.gameId)
              .then((achievementInfo) => {
                this.setState({ achievementInfo, gameInfo });
              });
          });
        });
      }
    }
    else {
      if (this.state.currentUser) {
        this.setState({ currentUser: null, achievementInfo: [] });
      }
      else {
        gameData.getGameDetailsNoUser(this.state.gameId)
        .then((gameInfo) => {
          if (JSON.stringify(this.state.gameInfo) !== JSON.stringify(gameInfo)) {
            this.setState({ gameInfo });
          }
        });
      }  
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