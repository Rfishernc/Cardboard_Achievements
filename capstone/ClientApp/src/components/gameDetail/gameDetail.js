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
    gameId: null,
    selectedUser: null
  }

  componentDidMount() {
    if (window.location.href.search('&') > -1) {
      this.setState({ 
        gameId: window.location.href.slice(window.location.href.search('=') + 1, window.location.href.search('&')),
        selectedUser: window.location.href.slice(window.location.href.search('&') + 6)
      }, () => {
        this.getDetails();
      });
    }
    else {
      this.setState({ 
        gameId: window.location.href.slice(window.location.href.search('=') + 1),
        selectedUser: null}, () => {
          this.getDetails();
        });
    } 
    
  }

  componentDidUpdate() {
    this.checkUserStatus();
  }

  getDetails = () => {
    gameData.getNumberOfPlayers(this.state.gameId)
      .then((playersInfo) => {
        this.setState({ playersInfo });
      });
    gameData.getGamePopularity(this.state.gameId)
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
            <p className='gameInfoUnit'>{this.state.playersInfo} Total Players</p>
            <p className='gameInfoUnit'>Popularity Ranking: #{this.state.popularity}</p>
            {this.state.selectedUser ? <p className='gameInfoUnit'>{((this.state.achievementInfo.length / this.state.gameInfo.length) * 100).toFixed(1)} % Completed</p> : null}
            {this.state.selectedUser ? <p className='gameInfoUnit'>{this.pointsTotalizer(this.state.achievementInfo)} Out of {this.pointsTotalizer(this.state.gameInfo)} Points Earned</p> : null}
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

          const whichUser = () => {
            return this.state.selectedUser && this.state.selectedUser === this.state.currentUser ? this.state.selectedUser : this.state.currentUser;
          }
          console.log(whichUser());
          gameData.getGameDetails(this.state.gameId, whichUser())
          .then((gameInfo) => {
            achievementData.getUsersAchievementsForGame(whichUser(), this.state.gameId)
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
        if (this.state.selectedUser !== null) {
          gameData.getGameDetails(this.state.gameId, this.state.selectedUser)
          .then((gameInfo) => {
            achievementData.getUsersAchievementsForGame(this.state.selectedUser, this.state.gameId)
              .then((achievementInfo) => {
                if (JSON.stringify(this.state.gameInfo) !== JSON.stringify(gameInfo) || JSON.stringify(this.state.achievementInfo) !== JSON.stringify(achievementInfo)) {
                  this.setState({ achievementInfo, gameInfo });
                }
              });
          });
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