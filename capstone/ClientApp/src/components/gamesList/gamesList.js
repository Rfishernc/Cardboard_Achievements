import React from 'react';
import gameData from '../../data/gameData';
import achievementData from '../../data/achievementData';
import userData from '../../data/userData';
import SearchBar from '../searchBar/searchbar';
import { Progress } from 'reactstrap';
import './gamesList.scss';

class gamesList extends React.Component {
  state = {
    gamesInfo: null,
    popularityInfo: null,
    userInfo: null,
    selectedUser: window.location.pathname.slice(7),
    popularity: false,
    name: true,
    new: false,
    card: true,
    list: false,
    sort: 'name',
  }

  componentDidMount() {
    if (this.state.selectedUser === 'all') {
      gameData.getAllGames()
      .then((gamesInfo) => {
        this.setState({ gamesInfo }, () => {

          achievementData.getPopularity()
          .then((popularityInfo) => {
            this.setState({ popularityInfo }, () => {

              const games = this.state.gamesInfo;
              const popularity = this.state.popularityInfo;

              Object.keys(games).forEach((gameId) => {
                const game = games[gameId];
                popularity.forEach((ref) => {
                  if (game[0].gameId === ref.gameId) {
                    game[0].popularity = ref.popularity;
                  }
                });
              });
              this.setState({ gamesInfo: games });
            });
          });
        });
      });
    } 
    
    else {
      gameData.getUsersGames(this.state.selectedUser)
        .then((gamesInfo) => {
          this.setState({ gamesInfo }, () => {
            
            achievementData.getPopularity()
            .then((popularityInfo) => {
              this.setState({ popularityInfo }, () => {

                const games = this.state.gamesInfo;
                const popularity = this.state.popularityInfo;

                Object.keys(games).forEach((gameId) => {
                  const game = games[gameId];
                  popularity.forEach((ref) => {
                    if (game[0].gameId === ref.gameId) {
                      game[0].popularity = ref.popularity;
                    }
                  });
                });
                this.setState({ gamesInfo: games });
              });
            });
          });
        });
    }
  }

  componentDidUpdate() {
    this.checkUserState();
  }

  gamesCardBuilder = () => {
    if (this.state.gamesInfo !== null) {
      let renderArray = [];
      let sortingOrder = Object.keys(this.state.gamesInfo);
      sortingOrder = this.applySort(sortingOrder);
      sortingOrder.forEach((gameId) => {
        const game = this.state.gamesInfo[gameId];
        let points = 0;
        game.forEach((achievement) => {
          points+= achievement.difficulty * 10;
        });

        renderArray.push(<div className="card gameCard" style={{width: '18rem'}} id={game[0].gameId} key={game[0].gameId}
          onMouseEnter={this.hovered} onMouseLeave={this.hoveredOut} onClick={this.historyPusher}>
        <img src={game[0].gameImage} className="card-img-top gameImg" alt="..."/>
        <div className="card-body">
          <h5 className="card-title">{game[0].gameName}</h5>
          <p className="card-text">{game.length} Achievements</p>
          <p className="card-text">{points} Total Points</p>
          {this.state.selectedUser !== 'all' ? 
            <Progress value={(game[0].userPoints / points) * 100} color='warning'>{((game[0].userPoints / points) * 100).toFixed(1)}%</Progress>
            : null}
        </div>
      </div>)
      });
      return renderArray;
    }
  }

  
  gamesListBuilder = () => {
    if (this.state.gamesInfo !== null) {
      let renderArray = [];
      let sortingOrder = Object.keys(this.state.gamesInfo);
      sortingOrder = this.applySort(sortingOrder);
      sortingOrder.forEach((gameId) => {

        const game = this.state.gamesInfo[gameId];
        let points = 0;
        game.forEach((achievement) => {
          points+= achievement.difficulty * 10;
        });

        renderArray.push(<li className="gameListing list-group-item" id={game[0].gameId} key={game[0].gameId} onClick={this.historyPusher}
          onMouseEnter={this.hovered} onMouseLeave={this.hoveredOut}>
            <p className='listText'>{game[0].gameName}</p>
            <p className='listText'>{game.length} Achievements</p>
            <p className='listText'>{points} Total Points</p>
            {this.state.selectedUser !== 'all' ? 
            <Progress value={(game[0].userPoints / points) * 100} color='warning' className='listProgress'>{((game[0].userPoints / points) * 100).toFixed(1)}%</Progress>
            : null}
        </li>);
      });
      return renderArray;
    }
  }

  historyPusher = (event) => {
    if (this.state.currentUser == this.state.selectedUser) {
      const id = event.currentTarget.id;
      const link = `/game?Id=${id}&user=${this.state.currentUser}`;
      this.props.history.push(link);
    }
    else if (this.state.currentUser && this.state.selectedUser === 'all') {
      const id = event.currentTarget.id;
      const link = `/game?Id=${id}&user=${this.state.currentUser}`;
      this.props.history.push(link);
    }
    else if (this.state.selectedUser !== 'all') {
      const id = event.currentTarget.id;
      const link = `/game?Id=${id}&user=${this.state.selectedUser}`;
      this.props.history.push(link);
    }
    else {
      const id = event.currentTarget.id;
      const link = `/game?Id=${id}`;
      this.props.history.push(link);
    }
  }

  applySort = (sortingOrder) => {
    const games = this.state.gamesInfo;

    switch(this.state.sort) {
      
      case 'popularity' :  return sortingOrder.sort(function(a,b) {
        if (games[a][0].popularity > games[b][0].popularity) {
          return -1;
        } if (games[b][0].popularity > games[a][0].popularity) {
          return 1;
        } return 0;
      });

      case 'name' : return sortingOrder.sort(function(a,b) {
        if (games[b][0].gameName > games[a][0].gameName) {
          return -1;
        } if (games[a][0].gameName > games[b][0].gameName) {
          return 1;
        } return 0;
      });

      case 'new' : return sortingOrder.sort(function(a,b) {
        if (games[b][0].dateAdded > games[a][0].dateAdded) {
          return -1;
        } if (games[a][0].dateAdded > games[b][0].dateAdded) {
          return 1;
        } return 0;
      });

      default : break;
    }
  }

  selectSort = (event) => {
    const tar = event.target.id.replace('Input', '');
    this.setState({ popularity: false, name: false, new: false }, () => {
      this.setState({ [tar]: true, sort: tar });
    });
  }

  selectView = () => {
    this.setState({ card: !this.state.card, list: !this.state.list  });
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

  userInfoBuilder = () => {
    if (this.state.userInfo !== null) {
          return <div className='userInfoContainer'>
            <div>
              <p className='userInfoTitle'>{this.state.userInfo.username}</p>
              <img src={this.state.userInfo.profilePic} alt='' className='profilePic'/>
            </div>
            <div className='userMiscContainer'>
              <p className='userInfoDate'>Joined {this.state.userInfo.joinDate.replace('T00:00:00', '')}</p>
              <p className='userInfoMisc'>{this.state.userInfo.points} Total Points  {this.state.userInfo.totalAchievements} Total Achievements</p>
            </div>
          </div>;
    }
  }

  checkUserState = () => {
    if (this.props.currentUser) {
      if (this.state.currentUser) {
        return;
      }
      else if (this.props.currentUser !== parseInt(this.state.selectedUser, 10) && this.state.selectedUser !== 'all') {
        userData.getUserForSearchResult(this.state.selectedUser)
          .then((userInfo) => {
            this.setState({ userInfo, currentUser: this.props.currentUser });
          });
      }
      else {
        this.setState({ currentUser: this.props.currentUser });
      }
    }
    else {
      if (this.state.currentUser) {
        this.setState({ currentUser: null });
      }
      if (this.state.selectedUser !== 'all') {
        userData.getUserForSearchResult(this.state.selectedUser)
          .then((userInfo) => {
            this.setState({ userInfo });
          });
      }
    }
  }

  render() {
    return(
      <div className='gamesList container-fluid'>
        <div className='row gameListRow'>
        <div className='searchAndSort col-2'>
          <SearchBar games={true}/>
          <div className='sortContainer'>
            <p className='sortTitle'>Sort By: </p>
            <div className='form-check form-check-inline'>
              <label className="form-check-label radioLabel" htmlFor="popularityInput">Popularity</label>
              <input type="radio" className="form-check-input" value='option1' id="popularityInput" checked={this.state.popularity} onChange={this.selectSort}/>
            </div>
            <div className='form-check form-check-inline'>
              <label className="form-check-label radioLabel" htmlFor="nameInput">Name</label>
              <input type="radio" className="form-check-input" value='option1' id="nameInput" checked={this.state.name} onChange={this.selectSort}/>
            </div>
            <div className='form-check form-check-inline'>
              <label className="form-check-label radioLabel" htmlFor="newInput">New</label>
              <input type="radio" className="form-check-input" value='option1' id="newInput" checked={this.state.new} onChange={this.selectSort}/>
            </div>
          </div>
          <div className='sortContainer'>
            <p className='sortTitle'>View: </p>
            <div className='form-check form-check-inline'>
              <label className="form-check-label radioLabel" htmlFor="cardInput">Card</label>
              <input type="radio" className="form-check-input" value='option1' id="cardInput" checked={this.state.card} onChange={this.selectView}/>
            </div>
            <div className='form-check form-check-inline'>
              <label className="form-check-label radioLabel" htmlFor="listInput">List</label>
              <input type="radio" className="form-check-input" value='option1' id="listInput" checked={this.state.list} onChange={this.selectView}/>
            </div>
          </div>
        </div>
        <div className='infoContainer col-10'>
          {this.state.selectedUser !== 'all' && this.state.currentUser != this.state.selectedUser ? this.userInfoBuilder() : null}
          <div className='gameListingContainer'>
            {this.state.card ? this.gamesCardBuilder() : <ul class="list-group">{this.gamesListBuilder()}</ul>}
          </div>
        </div>
        </div>
      </div>
    );
  }
}

export default gamesList;