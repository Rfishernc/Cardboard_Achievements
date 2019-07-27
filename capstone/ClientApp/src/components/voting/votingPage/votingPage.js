import React from 'react';
import achievementData from '../../../data/achievementData';
import Voting from '../voting';
import './votingPage.scss';

class votingPage extends React.Component {
  state = {
    achievementInfo: null,
    currentUser: 2,
  }

  componentDidMount() {
    const gameId = window.location.href.slice(window.location.href.search('=') + 1);
    achievementData.getProposedAchievementsForGame(gameId, this.state.currentUser)
      .then((achievementInfo) => {
        this.setState({ achievementInfo });
      })
  }

  render() {
    return(
      <div className='votingPage'>
        <Voting userId={this.state.currentUser} achievements={this.state.achievementInfo}/>
      </div>
    );
  }
}

export default votingPage;