import React from 'react';
import achievementData from '../../data/achievementData';
import gameData from '../../data/gameData';
import Achievement from '../achievement/achievement';
import SubmitAchievement from '../submitAchievement/submitAchievement';
import './myAchievements.scss';

class myAchievements extends React.Component {
  state = {
    achievementsInfo: null,
    gamesInfo: null,
    isUser: true,
  }

  componentDidMount() {
    this.checkUserState();
  }

  componentDidUpdate() {
    this.checkUserState();
  }

  recentAchievementsBuilder = () => {
    let renderArray = [];
    if (this.state.achievementsInfo !== null) {
      
      Object.keys(this.state.achievementsInfo).forEach((game) => {
        this.state.achievementsInfo[game].forEach((achievement) => {
          renderArray.push(<Achievement image={achievement.achievementImage} name={achievement.achievementName} key={`achievement${achievement.achievementId}`}
            difficulty={achievement.difficulty} description={achievement.description}
            dateAdded={achievement.dateAdded} dateSubmitted={achievement.dateSubmitted} voteStatus='approved'/>);
        });
      });
      renderArray = renderArray.sort(function(a, b) {
        if (a.props.dateSubmitted > b.props.dateSubmitted) {
          return -1;
        }
        if (b.props.dateSubmitted > a.props.dateSubmitted) {
          return 1;
        }
        return 0;
      });
      if (renderArray.length > 5) {
        renderArray = renderArray.slice(0, 5);
      }
    }
    return renderArray;
  }

  gamesCardBuilder = () => {
    let renderArray = [];
    if (this.state.gamesInfo !== null) {
      Object.keys(this.state.gamesInfo).forEach((gameId) => {
        const game = this.state.gamesInfo[gameId];
        let points = 0;
        game.forEach((achievement) => {
          points+= achievement.difficulty * 10;
        });

        renderArray.push(<div className="card gameCard" style={{width: '18rem'}} id={game[0].gameId} key={game[0].gameId}
          onMouseEnter={this.hovered} onMouseLeave={this.hoveredOut} onClick={this.historyPusher}>
        <img src={game[0].gameImage} className="card-img-top gameImg" alt="..."/>
        <div className="card-body">
          <h5 className="card-title">{game[0].gameName}</h5>
          <p className="card-text">{game.length} Achievements</p>
          <p className="card-text">{points} Total Points</p>
        </div>
      </div>)
      });
    }
    return renderArray;
  }

  historyPusher = (event) => {
    const id = event.currentTarget.id;
    const link = `/game?Id=${id}`;
    this.props.history.push(link);
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

  checkUserState = () => {
    if (this.props.currentUser) {
      if (this.state.currentUser) {
        return;
      }
      else {
        this.setState({ currentUser: this.props.currentUser }, () => {
          gameData.getUsersGames(this.props.currentUser)
          .then((gamesInfo) => {
            achievementData.getUsersAchievements(this.props.currentUser)
            .then((achievementsInfo) => {
              this.setState({ achievementsInfo, gamesInfo });
            });
          });
        });
      }
    }
    else {
      if (this.state.currentUser) {
        this.setState({ currentUser: null });
      }
    }
  }

  render() {
    return(
      <div className='myAchievements'>
        <div className="container-fluid">
          <div className="row achievementsUpper">
            <div className="col-9 recentAchievements">
              <div className='titleContainer'>
                <p className='recentAchievementsTitle'>Your Recent Achievements</p>
              </div>
              <div className='recentAchievementsContainer'>
                {this.recentAchievementsBuilder()}
              </div>
            </div>
            {this.state.isUser ? <div className="col-3 submitAchievementContainer">
              <SubmitAchievement userId={this.state.userId}/>
            </div> : null}
          </div>
          <div className='myAchievementsLower'>
            <div className='titleContainer'>
              <p className='myAchievementsTitle'>Your Achievements By Game</p>
            </div>
            <div className='myAchievementsContainer'>
              {this.gamesCardBuilder()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default myAchievements;