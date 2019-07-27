import React from 'react';
import achievementData from '../../data/achievementData';
import Achievement from '../achievement/achievement';
import UserAchievement from '../userAchievement/userAchievement';
import './moderatorPortal.scss';

class moderatorPortal extends React.Component {
  state = {
    achievementsInfo: null
  }

  componentDidMount() {
   this.getAchievementsToCheck();
  }

  getAchievementsToCheck = () => {
    achievementData.getAchievementsToCheck()
    .then((achievementsInfo) => {
      this.setState({ achievementsInfo });
    });
  }

  achievementsBuilder = () => {
    const renderArray = [];
    if (this.state.achievementsInfo != null) {
      this.state.achievementsInfo.forEach((achievement) => {
        renderArray.push(<div className='userAchievementContainer container' id={`UAContainer${achievement.userAchievementId}`} key={`UAContainer${achievement.userAchievementId}`}>

          <Achievement key={`achievement${achievement.achievementId}`} id={`achievement${achievement.achievementId}`}
            name={achievement.achievementName} image={achievement.achievementImage} description={achievement.description} 
            difficulty={achievement.difficulty} gameName={achievement.gameName} gameId={achievement.gameId}
            historyPusher={this.achievementHistoryPusher} hovered={this.hovered} hoveredOut={this.hoveredOut} voteStatus='approved'/>

          <UserAchievement id={`userAchievement${achievement.userAchievementId}`} key={`userAchievement${achievement.userAchievementId}`}
            userId={achievement.userId} username={achievement.username} dateSubmitted={achievement.dateSubmitted} 
            link={achievement.link} refresh={this.getAchievementsToCheck} userAchievementId={achievement.userAchievementId}/>
          </div>);
      });
    }
    return renderArray;
  }

  render() {
    return(
      <div className='moderatorPortal'>
        {this.achievementsBuilder()}
      </div>
    );
  }
}

export default moderatorPortal;