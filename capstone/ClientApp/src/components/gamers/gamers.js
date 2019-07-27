import React from 'react';
import userData from '../../data/userData';
import SearchBar from '../searchBar/searchbar';
import Gamer from '../gamer/gamer';
import './gamers.scss';

class gamers extends React.Component {
  state = {
    gamersInfo: null,
    allTimeLeaders: null
  }

  componentDidMount() {
    userData.getGamers()
      .then((gamersInfo) => {
        this.setState({ gamersInfo }, () => {
          this.sortAllTime();
        });
      });
  }

  sortAllTime = () => {
    let allTimeLeaders = this.state.gamersInfo;

    allTimeLeaders = allTimeLeaders.sort(function(a, b) {
      if (a.points > b.points) {
        return -1;
      }
      if (b.points > a.points) {
        return 1;
      }
      return 0;
    });

    this.setState({ allTimeLeaders });
  }

  monthlyLeadersBuilder = () => {
    const renderArray = [];
    if (this.state.gamersInfo !== null) {

      if (this.state.gamersInfo.length < 100) {
        for (let i = 0; i < this.state.gamersInfo.length; i++) {
          renderArray.push(<div className='rankingContainer' id={this.state.gamersInfo[i].id} key={this.state.gamersInfo[i].id}
            onClick={this.historyPusher} onMouseEnter={this.hovered} onMouseLeave={this.hoveredOut}>
            <p className='ranking'>#{i+1}</p>
            <Gamer info={this.state.gamersInfo[i]} isMonthly={true} key={`gamer${this.state.gamersInfo[i].id}`}/>
          </div>);
        }
      } 
      
      else {
        for (let i = 0; i < 100; i++) {
          renderArray.push(<div className='rankingContainer' id={this.state.gamersInfo[i].id} key={this.state.gamersInfo[i].id}
            onClick={this.historyPusher} onMouseEnter={this.hovered} onMouseLeave={this.hoveredOut}>
            <p className='ranking'>#{i+1}</p>
            <Gamer info={this.state.gamersInfo[i]} isMonthly={true} key={`gamer${this.state.gamersInfo[i].id}`}/>
          </div>);
        }
      }
    }
    return renderArray;
  }

  allTimeLeadersBuilder = () => {
    const renderArray = [];
    if (this.state.allTimeLeaders !== null) {

      if (this.state.allTimeLeaders.length < 100) {
        for (let i = 0; i < this.state.allTimeLeaders.length; i++) {
          renderArray.push(<div className='rankingContainer' id={this.state.allTimeLeaders[i].id} key={this.state.allTimeLeaders[i].id}
            onClick={this.historyPusher} onMouseEnter={this.hovered} onMouseLeave={this.hoveredOut}>
            <p className='ranking'>#{i+1}</p>
            <Gamer info={this.state.allTimeLeaders[i]} isMonthly={false} key={`gamer${this.state.allTimeLeaders[i].id}`}/>
          </div>);
        }
      } 
      
      else {
        for (let i = 0; i < 100; i++) {
          renderArray.push(<div className='rankingContainer' id={this.state.allTimeLeaders[i].id} key={this.state.allTimeLeaders[i].id}
            onClick={this.historyPusher} onMouseEnter={this.hovered} onMouseLeave={this.hoveredOut}>
            <p className='ranking'>#{i+1}</p>
            <Gamer info={this.state.allTimeLeaders[i]} isMonthly={false} key={`gamer${this.state.allTimeLeaders[i].id}`}/>
          </div>);
        }
      }
    }
    return renderArray;
  }

  historyPusher = (event) => {
    const id = event.currentTarget.id;
    const link = `/achievements?Id=${id}`;
    this.props.history.push(link);
  }

  hovered = (event) => {
    event.preventDefault();
    const link = event.currentTarget;
    if (link.className.includes(' hovered') === false) {
      link.className += ' hovered';
    }
    link.childNodes.forEach((child) => {
      if (child.className.includes(' hovered') === false) {
        child.className += ' hovered';
      }
      if (child.firstChild !== undefined && child.firstChild.className !== undefined) {
        if (child.firstChild.className.includes(' hovered') === false && child.firstChild.className.includes(' gamerImg') === false) {
          child.firstChild.className += ' hovered';
        }
      }
    });
  }

  hoveredOut = (event) => {
    event.preventDefault();
    const link = event.currentTarget;
    if (link.className.includes(' hovered')) {
      link.className = link.className.replace(' hovered', '');
    }
    link.childNodes.forEach((child) => {
      if (child.className.includes(' hovered')) {
        child.className = child.className.replace(' hovered', '');
      }
      if (child.firstChild !== undefined && child.firstChild.className !== undefined) {
        if (child.firstChild.className.includes(' hovered')) {
          child.firstChild.className = child.firstChild.className.replace(' hovered', '');
        }
      }
    });
  }

  render() {
    return(
      <div className='gamers'>
        <div className='gamersSearch'>
          <p className='gamersSearchTitle'>Search gamers</p>
          <SearchBar users={true}/>
        </div>
        <div className='gamersContainer'>
          <div className='titleContainer'>
            <p className='gamersTitle'>Monthly Leaders</p>
          </div>
          <div className='gamerCardContainer'>
            {this.monthlyLeadersBuilder()}
          </div>
        </div>
        <div className='gamersBotContainer'>
          <div className='titleContainer'>
            <p className='gamersTitle'>All Time Leaders</p>
          </div>
          <div className='gamerCardContainer'>
            {this.allTimeLeadersBuilder()}
          </div>
        </div>  
      </div>
    );
  }
}

export default gamers;