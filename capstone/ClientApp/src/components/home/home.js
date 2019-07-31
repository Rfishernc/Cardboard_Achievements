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
  }

  componentDidMount() {
    blogData.getBlogPosts()
      .then((blogInfo) => {
        this.setState({ blogInfo });
      });
    if (this.props.currentUser !== null && this.props.currentUser !== undefined) {
      userData.getUserOverview(this.props.currentUser)
      .then((userInfo) => {
        this.setState({ userInfo });
      });
      achievementData.getRecentProposedAchievements(this.props.currentUser)
        .then((votingInfo) => {
          this.setState({ votingInfo });
        });
      achievementData.getRecentAchievements(this.props.currentUser)
      .then((achievementsInfo) => {
        this.setState({ achievementsInfo });
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
          key={`achievement${achievement.achievementId}`} voteStatus='approved' completed={this.props.currentUser ? (achievement.completed ? <i className="fas fa-trophy completed"></i> : <i className="fas fa-trophy fail"></i>) : null}/>);
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
          <div className='row homelow'>
            <div className='col-3'>
              <Voting achievements={this.state.votingInfo} userId={this.props.currentUser}/>
            </div>
            <div className='col-5 blogCol'>
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