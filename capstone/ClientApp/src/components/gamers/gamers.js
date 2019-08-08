import React from 'react';
import userData from '../../data/userData';
import SearchBar from '../searchBar/searchbar';
import Gamer from '../gamer/gamer';
import './gamers.scss';

class gamers extends React.Component {
  state = {
    gamersInfo: null,
    monthlyInfo: null,
    allTimeLeaders: null,
    monthLeaders: null,
    monthRange: 10,
    allTimeRange: 10
  }

  componentDidMount() {
    userData.getGamers()
      .then((gamersInfo) => {
        this.setState({ gamersInfo, monthlyInfo: gamersInfo.slice(0) }, () => {
          this.sortAllTime();
          this.sortThisMonth();
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

  sortThisMonth = () => {
    let monthLeaders = this.state.monthlyInfo;

    monthLeaders = monthLeaders.sort(function(a, b) {
      if (a.monthlyPoints > b.monthlyPoints) {
        return -1;
      }
      if (b.monthlyPoints > a.monthlyPoints) {
        return 1;
      }
      return 0;
    });

    this.setState({ monthLeaders });
  }

  monthlyLeadersBuilder = () => {
    const renderArray = [];
    if (this.state.monthLeaders !== null) {

      if (this.state.monthLeaders.length < 100) {
        for (let i = 0; i < this.state.monthLeaders.length; i++) {
          if (this.state.monthRange >= i + 1) { renderArray.push(<div className='rankingContainer' id={this.state.monthLeaders[i].id} key={this.state.monthLeaders[i].id}
          onClick={this.historyPusher} onMouseEnter={this.hovered} onMouseLeave={this.hoveredOut}>
          <p className='ranking'>#{i+1}</p>
          <Gamer info={this.state.monthLeaders[i]} isMonthly={true} key={`gamer${this.state.monthLeaders[i].id}`}/>
        </div>);}
        }
      } 
      
      else {
        for (let i = 0; i < 100; i++) {
          if (this.state.monthRange >= i + 1) {
            renderArray.push(<div className='rankingContainer' id={this.state.monthLeaders[i].id} key={this.state.monthLeaders[i].id}
            onClick={this.historyPusher} onMouseEnter={this.hovered} onMouseLeave={this.hoveredOut}>
            <p className='ranking'>#{i+1}</p>
            <Gamer info={this.state.monthLeaders[i]} isMonthly={true} key={`gamer${this.state.monthLeaders[i].id}`}/>
          </div>);
          }   
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
          if (this.state.allTimeRange >= i + 1) {
            renderArray.push(<div className='rankingContainer' id={this.state.allTimeLeaders[i].id} key={this.state.allTimeLeaders[i].id}
            onClick={this.historyPusher} onMouseEnter={this.hovered} onMouseLeave={this.hoveredOut}>
            <p className='ranking'>#{i+1}</p>
            <Gamer info={this.state.allTimeLeaders[i]} isMonthly={false} key={`gamer${this.state.allTimeLeaders[i].id}`}/>
          </div>);
          }    
        }
      } 
      
      else {
        for (let i = 0; i < 100; i++) {
          if (this.state.allTimeRange >= i + 1) {
            renderArray.push(<div className='rankingContainer' id={this.state.allTimeLeaders[i].id} key={this.state.allTimeLeaders[i].id}
            onClick={this.historyPusher} onMouseEnter={this.hovered} onMouseLeave={this.hoveredOut}>
            <p className='ranking'>#{i+1}</p>
            <Gamer info={this.state.allTimeLeaders[i]} isMonthly={false} key={`gamer${this.state.allTimeLeaders[i].id}`}/>
          </div>);
          }   
        }
      }
    }
    return renderArray;
  }

  historyPusher = (event) => {
    const id = event.currentTarget.id;
    const link = `/games+${id}`;
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

  seeMoreMonth = () => {
    this.setState({ monthRange: this.state.monthRange + 10 });
  }

  seeMoreAllTime = () => {
    this.setState({ allTimeRange: this.state.allTimeRange + 10 });
  }

  render() {
    return(
      <div className='gamers'>
        <div className='gamersSearch'>
          <p className='gamersSearchTitle'>Search gamers</p>
          <SearchBar users={true}/>
        </div>
        <div className='container-fluid'>
          <div className='row'>
          <div className='gamersContainer col-6'>
            <div className='titleContainer'>
              <p className='gamersTitle'>Monthly Leaders</p>
            </div>
            <div className='gamerCardContainer gamerTop'>
              {this.monthlyLeadersBuilder()}
            </div>
            <button className='seeMore' onClick={this.seeMoreMonth}>{`${this.state.monthRange + 1} - ${this.state.monthRange + 10}`}</button>
          </div>
          <div className='gamersBotContainer col-6'>
            <div className='titleContainer'>
              <p className='gamersTitle'>All Time Leaders</p>
            </div>
            <div className='gamerCardContainer'>
              {this.allTimeLeadersBuilder()}
            </div>
            <button className='seeMore' onClick={this.seeMoreAllTime}>{`${this.state.allTimeRange + 1} - ${this.state.allTimeRange + 10}`}</button>
          </div>
          </div>
        </div>  
      </div>
    );
  }
}

export default gamers;