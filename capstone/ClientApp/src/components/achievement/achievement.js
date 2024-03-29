import React from 'react';
import { Button } from 'reactstrap';
import voteData from '../../data/voteData';
import './achievement.scss';

class achievement extends React.Component {
  state = {
    voteStatus: 'approved',
    justVoted: false,
  }

  componentDidMount() {
    this.setState({ voteStatus: this.props.voteStatus });
  }

  componentDidUpdate() {
    if (this.state.voteStatus !== this.props.voteStatus && this.state.justVoted === false) {
      this.setState({ voteStatus: this.props.voteStatus });
    }
  }

  difficultyConverter = () => {
    switch(this.props.difficulty) {
      case 1: return 'Easy';
      case 2: return 'Normal';
      case 3: return 'Hard';
      default: return null;
    }
  }

  voteForAchievement = () => {
    voteData.addVote(this.props.userId, this.props.achievementId)
      .then(() => {
        this.setState({ justVoted: true, voteStatus: 'voted' });
      });
  }

  votingStatusBuilder = () => {
    switch (this.state.voteStatus) {
      case 'approved' : return null;
      case 'voted' : return <p className='votingMsg'>Thanks for voting</p>;
      case 'notVoted' : return <Button className='btn btn-sm btn-dark' onClick={this.voteForAchievement}>Vote</Button>;
      default : break;
    }
  }

  render() {
    return(
      <div className='achievement row' onClick={this.props.gameName ? this.props.historyPusher : null} 
        id={this.props.gameName ? `achievement${this.props.gameId}` : null}
        onMouseEnter={this.props.gameName ? this.props.hovered : null} onMouseLeave={this.props.gameName ? this.props.hoveredOut : null}>
        <div className='achievementImgContainer achievementContainer col-3'>
          <img src={this.props.image} className='achievementImg' alt=''/>
          {this.props.dateAdded ? <p className='achievementDate'>{this.props.dateAdded.replace('T00:00:00', '')}</p> : null}
          {this.votingStatusBuilder()}
        </div>
        <div className='achievementInfoContainer achievementContainer col-6'>
          <p className='achievementInfoUnit achievementTitle'>{this.props.name}</p>
          {this.props.gameName ? <p className='achievementInfoUnit'>Game: {this.props.gameName}</p> : null}
          <p className='achievementInfoUnit'>Difficulty: {this.difficultyConverter()}</p>
          <p className='achievementInfoUnit'>{this.props.description}</p>
        </div>
        <div className='achievementStatusContainer col-1'>
          {this.props.completed ? <p>{this.props.completed}</p> : null}
        </div>
      </div>
    );
  }
}

export default achievement;