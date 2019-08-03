import React from 'react';
import Achievement from '../achievement/achievement';
import ProposeAchievement from './proposeAchievement/proposeAchievement';
import './voting.scss';

class voting extends React.Component {

  achievementsBuilder = () => {
    const renderArray = [];
    if (this.props.achievements !== null && this.props.userId) {
      this.props.achievements.forEach((achievement) => {
        renderArray.push(<Achievement name={achievement.achievementName} image={achievement.image} description={achievement.description} 
          difficulty={achievement.difficulty} dateAdded={achievement.dateSubmitted} gameName={achievement.gameName} gameId={achievement.gameId}
          key={`voting${achievement.achievementId}`} userId={this.props.userId}
          voteStatus={achievement.voteId > 0 ? 'voted' : 'notVoted'} achievementId={achievement.achievementId}/>);
      });
    }
    else if (this.props.achievements !== null) {
      this.props.achievements.forEach((achievement) => {
        renderArray.push(<Achievement name={achievement.achievementName} image={achievement.image} description={achievement.description} 
          difficulty={achievement.difficulty} dateAdded={achievement.dateSubmitted} gameName={achievement.gameName} gameId={achievement.gameId}
          key={`voting${achievement.achievementId}`} achievementId={achievement.achievementId}/>);
      });
    }
    return renderArray;
  }

  render() {
    return(
      <div className='voting'>
        <p className='votingTitle'>Vote for New Achievements</p>
        {this.props.userId ? <ProposeAchievement userId={this.props.userId}/> : null}
        {this.achievementsBuilder()}
      </div>
    );
  }
}

export default voting;