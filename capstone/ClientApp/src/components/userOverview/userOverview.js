import React from 'react';
import Achievement from '../achievement/achievement';
import './userOverview.scss';

class userOverview extends React.Component {
  render() {
    return(
      <div className='userOverview'>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-8 overviewAchievement'>
              <Achievement image={this.props.info.image} name={this.props.info.achievementName} gameName={this.props.info.gameName} 
                dateAdded={this.props.info.dateAdded} difficulty={this.props.info.difficulty}
                description={this.props.info.description} key='overviewAchievement' voteStatus='approved'/>
            </div>
            <div className='userInfoDiv col-3'>
              <div className='overviewContainer'>
                <p className='userInfoUnit'>{this.props.info.username}</p>
                <img src={this.props.info.profilePic} className='profilePic' alt=''/>   
              </div>
              <p className='userInfoUnit points'>{this.props.info.points} Total Points Earned</p> 
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default userOverview;