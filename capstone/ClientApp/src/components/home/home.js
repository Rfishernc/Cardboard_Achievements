import React from 'react';
import achievementData from '../../data/achievementData';
import blogData from '../../data/blogData';
import userData from '../../data/userData';
import Achievement from '../achievement/achievement';
import BlogPost from '../blogPost/blogPost';
import UserOverview from '../userOverview/userOverview';
import Voting from '../voting/voting';
import './home.scss';

class home extends React.Component {
  state = {
    blogInfo: null,
    achievementsInfo: null,
    userInfo: null,
    votingInfo : null,
    currentUser: 2
  }

  componentDidMount() {
    blogData.getBlogPosts()
      .then((blogInfo) => {
        this.setState({ blogInfo });
      });
    achievementData.getRecentAchievements(this.state.currentUser)
      .then((achievementsInfo) => {
        this.setState({ achievementsInfo });
      });
    if (this.state.currentUser !== null) {
      userData.getUserOverview(this.state.currentUser)
      .then((userInfo) => {
        this.setState({ userInfo });
      });
      achievementData.getRecentProposedAchievements(this.state.currentUser)
        .then((votingInfo) => {
          this.setState({ votingInfo });
        });
    }  
  }

  blogBuilder = () => {
    const renderArray = [];
    if (this.state.blogInfo !== null) {
      this.state.blogInfo.forEach((blogPost) => {
        renderArray.push(<BlogPost key={`blogPost${blogPost.id}`} id={`blogPost${blogPost.id}`} blogContent={blogPost.blogContent}
          author={blogPost.author} blogTitle={blogPost.blogTitle} datePosted={blogPost.datePosted}/>);
      })
    }
    return renderArray;
  }

  achievementsBuilder = () => {
    const renderArray = [];
    if (this.state.achievementsInfo !== null) {
      this.state.achievementsInfo.forEach((achievement) => {
        renderArray.push(<Achievement name={achievement.achievementName} image={achievement.image} description={achievement.description} 
          difficulty={achievement.difficulty} dateAdded={achievement.dateAdded} gameName={achievement.gameName} gameId={achievement.gameId}
          historyPusher={this.achievementHistoryPusher} hovered={this.hovered} hoveredOut={this.hoveredOut}
          key={`achievement${achievement.achievementId}`} voteStatus='approved' completed={this.state.currentUser ? (achievement.completed ? 'Completed' : 'Not Completed') : null}/>);
      });
    }
    return renderArray;
  }
  
  achievementHistoryPusher = (event) => {
    const id = event.currentTarget.id.replace('achievement', '');
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

  render() {
    return(
      <div className='home'>
        {this.state.userInfo ? <UserOverview info={this.state.userInfo}/> : null}
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-3'>
              <Voting achievements={this.state.votingInfo} userId={this.state.currentUser}/>
            </div>
            <div className='col-5'>
              {this.blogBuilder()}
            </div>
            <div className='col-4'>
              <p className='recentAchievementsHomeTitle'>Newly Added Achievements</p>
              {this.achievementsBuilder()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default home;