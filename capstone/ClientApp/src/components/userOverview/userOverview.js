import React from 'react';
import Achievement from '../achievement/achievement';
import { Button } from 'reactstrap';
import userData from '../../data/userData';
import './userOverview.scss';

class userOverview extends React.Component {
  state = {
    changeImage: false,
    image: ''
  }

  changeProfilePic = () => {
    this.setState({ changeImage: true });
  }

  cancel = () => {
    this.setState({ changeImage: false });
  }

  submit = () => {
    userData.changeImage(this.props.currentUser, this.state.image)
      .then(() => {
        this.props.refreshPic();
      });
    this.setState({ changeImage: false });
  }

  select = (event) => {
    const val = event.target.value;
    this.setState({ image: val });
  }

  render() {
    return(
      <div className='userOverview'>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-8 overviewAchievement'>
              {this.props.info.achievementName ? <Achievement image={this.props.info.image} name={this.props.info.achievementName}
                dateAdded={this.props.info.dateAdded} difficulty={this.props.info.difficulty} gameName={this.props.info.gameName} 
                description={this.props.info.description} key='overviewAchievement' voteStatus='approved'/> : null}
            </div>
            <div className='userInfoDiv col-3'>
              <div className='overviewContainer'>
                <p className='userInfoUnit'>{this.props.info.username}</p>
                <img src={this.props.info.profilePic} className='profilePic' alt=''/>
                <button className='btn btn-sm btn-link' onClick={this.changeProfilePic}>Change Picture</button>
              </div>
              <div className='profileRight'>
                <p className='userInfoUnit points'>{this.props.info.points} Total Points Earned</p>
                {this.state.changeImage ? <div className='picChange'>
                  <input type='text' id='picInput' onChange={this.select} placeholder='Enter image link'/> 
                  <Button className='btn btn-sm btn-dark picBtn' onClick={this.submit}>Submit</Button>
                  <Button className='btn btn-sm btn-danger picBtn' onClick={this.cancel}>Cancel</Button>
                </div> : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default userOverview;