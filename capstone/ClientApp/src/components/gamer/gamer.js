import React from 'react';
import './gamer.scss';

class gamer extends React.Component {
  render() {
    return(
      <div className='gamer'>
        <div className="card mb-3 gamerCard" style={{maxWidth: '540px'}}>
          <div className="row no-gutters">
            <div className="col-md-4">
              <img src={this.props.info.profilePic} className="card-img gamerImg" alt="..."/>
            </div>
            <div className="col-md-8">
              {this.props.isMonthly ? 
              <div className="card-body gamerCardBody">
                <h5 className="card-title gamerCardTitle">{this.props.info.username}</h5>
                <p className="card-text">{this.props.info.monthlyAchievements} Achievements this month</p>
                <p className="card-text">{this.props.info.monthlyPoints} Points this month</p>
                <p className="card-text"><small className="text-muted">{this.props.info.totalAchievements} Total Achievements  {this.props.info.points} Total Points</small></p>
              </div>
              :
              <div className="card-body gamerCardBody">
                <h5 className="card-title gamerCardTitle">{this.props.info.username}</h5>
                <p className="card-text">{this.props.info.totalAchievements} Total Achievements</p>
                <p className="card-text">{this.props.info.points} Total Points</p>
              </div>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default gamer;