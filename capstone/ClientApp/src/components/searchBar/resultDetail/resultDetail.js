import React from 'react';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import './resultDetail.scss';

class resultDetail extends React.Component {

  gameBuilder = () => {
    return <div>
      <p>{this.props.name}</p>
      <img src={this.props.image} alt=''/>
      <a href={this.props.link}>BoardgameGeek page</a>
      <p>{this.props.achievementCount} Achievements</p>
    </div>
  }

  achievementBuilder = () => {
    return <div>
      <p>{this.props.achievementName}</p>
      <p>Game: {this.props.gameName}</p>
      <img src={this.props.image} alt=''/>
      <p>{this.props.dateAdded.replace('T00:00:00', '')}</p>
      <p>{this.props.description}</p>
      <p>Difficulty: {this.difficultyConverter()}</p>
    </div>
  }

  userBuilder = () => {
    return <div>
      <p>{this.props.username}</p>
      <img src={this.props.profilePic} alt=''/>
      <p>Joined {this.props.joinDate.replace('T00:00:00', '')}</p>
      <p>{this.props.points} Total Points  {this.props.totalAchievements} Total Achievements</p>
    </div>
  }

  difficultyConverter = () => {
    switch (this.props.difficulty) {
      case 1 : return 'Easy';
      case 2 : return 'Normal';
      case 3 : return 'Hard';
      default : break;
    }
  }

  render() {
    return(
      <div className='resultDetail'>
          <Popover placement="bottom" toggle={this.props.toggle} isOpen={this.props.popoverOpen} target={this.props.target}>
            <PopoverHeader>

            </PopoverHeader>
            <PopoverBody>
              {this.props.game ? this.gameBuilder() : null}
              {this.props.achievement ? this.achievementBuilder() : null}
              {this.props.user ? this.userBuilder() : null}
            </PopoverBody>
          </Popover>
      </div>
    );
  }
}

export default resultDetail;