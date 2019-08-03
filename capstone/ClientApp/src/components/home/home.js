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
      
    }  
  }

  componentDidUpdate() {
    this.checkUserState();
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
    if (this.state.achievementsInfo !== null) {
      const renderArray = [];
      this.state.achievementsInfo.forEach((achievement) => {
        renderArray.push(<Achievement name={achievement.achievementName} image={achievement.image} description={achievement.description} 
          difficulty={achievement.difficulty} dateAdded={achievement.dateAdded} gameName={achievement.gameName} gameId={achievement.gameId}
          historyPusher={this.achievementHistoryPusher} hovered={this.hovered} hoveredOut={this.hoveredOut}
          key={`achievement${achievement.achievementId}`} voteStatus='approved' completed={this.props.currentUser ? (achievement.completed ? <i className="fas fa-trophy completed"></i> : <i className="fas fa-trophy fail"></i>) : null}/>);
      });
    return renderArray;
    }
  }

  votingBuilder = () => {
    if (this.state.currentUser) {
      if (this.state.votingInfo !== null) {
        return <Voting achievements={this.state.votingInfo} userId={this.state.currentUser}/>;
      }
    }
    else {
      if (this.state.votingInfo !== null) {
        return <Voting achievements={this.state.votingInfo}/>;
      }
    }
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

  checkUserState = () => {
    if (this.props.currentUser) {
      if (this.state.currentUser) {
        return;
      }
      else {
        this.setState({ currentUser: this.props.currentUser }, () => {
          userData.getUserOverview(this.state.currentUser)
          .then((userInfo) => {
            achievementData.getRecentProposedAchievements(this.state.currentUser)
              .then((votingInfo) => {
                achievementData.getRecentAchievements(this.state.currentUser) 
                .then((achievementsInfo) => {
                  this.setState({ userInfo, achievementsInfo, votingInfo });
                })
              });
          });
        });
      }
    }
    else 
    {
      if (this.state.currentUser) {
        this.setState({ currentUser: null });
      }
      achievementData.getRecentProposedAchievementsNoUser()
        .then((votingInfo) => {
          achievementData.getRecentAchievements(0)
            .then((achievementsInfo) => {
              if (JSON.stringify(this.state.votingInfo) !== JSON.stringify(votingInfo) || JSON.stringify(this.state.achievementsInfo) !== JSON.stringify(achievementsInfo)) {
                this.setState({ votingInfo, achievementsInfo });
              }
            });
        });
    }
  }

  render() {
  

    return(
      <div className='home'>
        {this.state.userInfo && this.state.currentUser ? <UserOverview info={this.state.userInfo}/> : null}
        <div className='container-fluid'>
          <div className='row homelow'>
            <div className='col-3'>
              {this.votingBuilder()}
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