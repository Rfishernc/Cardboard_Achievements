import React from 'react';
import { Button } from 'reactstrap';
import achievementData from '../../data/achievementData';
import DeclineMsg from './declineMsg/declineMsg';
import './userAchievement.scss';

class userAchievement extends React.Component {

  approve = () => {
    achievementData.approveUserAchievement(this.props.userAchievementId)
      .then(() => {
        this.props.refresh();
      });
  }

  decline = (msg) => {
    achievementData.declineUserAchievement(this.props.userAchievementId, msg)
      .then(() => {
        this.props.refresh();
      });
  }

  render() {
    return(
      <div className='userAchievement'>
        <div className='userInfoContainer'>
          <p className='userAchievementUnit'>{this.props.username}</p>
          <p className='userAchievementUnit'>Submitted on {this.props.dateSubmitted.replace('T00:00:00', '')}</p>
          <a href={this.props.link} className='userAchievementUnit'>Evidence Link</a>
        </div>
        <div className='modButtonContainer'>
          <Button className='btn btn-sm btn-dark' onClick={this.approve}>Approve</Button>
          <DeclineMsg decline={this.decline}/>
        </div>
      </div>
    );
  }
}

export default userAchievement;