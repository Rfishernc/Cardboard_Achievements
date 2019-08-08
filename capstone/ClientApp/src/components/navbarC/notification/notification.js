import React from 'react';
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import userData from '../../../data/userData';
import './notification.scss';

class notification extends React.Component {
 
  notified = (event) => {
    userData.clearNotification(event.target.id.replace('notification', ''))
      .then(() => {
        this.props.refresh();
      });
  }

  notificationsBuilder = () => {
    const renderArray = [];
    if (this.props.notificationsInfo !== null) {
    this.props.notificationsInfo.forEach((notification) => {
      renderArray.push(<div key={`notification${notification.id}`}>{notification.isApproved ?
        <div>
          <PopoverHeader>
            {notification.isApproved ? `Your ${notification.achievementName} achievement was approved` : 
              `Your ${notification.achievementName} achievement was declined`}
          </PopoverHeader>
          <p className='notificationUnit'>Congragulations your submission for {notification.achievementName} was approved.</p>
          <div>
            <div>
             <p>{notification.achievementName}</p>
              <img src={notification.image} alt=''/>
            </div>
            <p>{notification.gameName}</p>
            <p>{notification.description}</p>  
          </div>
          <Button className='btn btn-sm btn-dark' id={`notification${notification.id}`} onClick={this.notified}>Ok</Button>
        </div>
        :
        <div key={`notification${notification.id}`}>
          <PopoverHeader>
            {notification.isApproved ? `Your ${notification.achievementName} achievement was approved` : 
              `Your ${notification.achievementName} achievement was declined`}
          </PopoverHeader>
          <p className='notificationMsg'>Reason for Decline: {notification.declineMsg}</p>
          <div className='notificationAchievement'>
            <div className='achievementImgContainer'>
             <p>{notification.achievementName}</p>
              <img src={notification.image} alt='' className='achievementImg'/>
            </div>
            <div className='notificationInfoContainer'>
              <p>{notification.gameName}</p>
              <p>{notification.description}</p>  
            </div>
          </div>
          <Button className='btn btn-sm btn-dark' id={`notification${notification.id}`} onClick={this.notified}>Ok</Button>
      </div>}</div>);
    });
  }
    return renderArray;
  }

  render() {
    return(
      <div className='notification'>
          <Popover placement="bottom" toggle={this.props.toggle} isOpen={this.props.popoverOpen} target="notificationsButton">
            <PopoverBody>
              {this.notificationsBuilder()}
            </PopoverBody>
          </Popover>
      </div>
    );
  }
}

export default notification;