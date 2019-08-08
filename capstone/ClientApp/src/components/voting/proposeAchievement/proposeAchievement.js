import React from 'react';
import {
  Modal, ModalHeader, ModalBody, Button
} from 'reactstrap';
import gameData from '../../../data/gameData';
import achievementData from '../../../data/achievementData';
import './proposeAchievement.scss';

class proposeAchievement extends React.Component {
  state = {
    modal: false,
    name: '',
    game: '',
    description: '',
    image: '',
    difficulty: 'easy',
    easy: true,
    normal: false,
    hard: false,
    gamesInfo: null,
    gamenames: null
  }

  componentDidMount() {
    gameData.getAllGames()
      .then((gamesInfo) => {
        this.setState({ gamesInfo }, () => {
          this.gameNamesMaker();
        });
      });
  }

  gameNamesMaker = () => {
    const gameNames = [];
    Object.keys(this.state.gamesInfo).forEach((gameId) => {
      const gameName = this.state.gamesInfo[gameId][0].gameName;
      gameNames.push({gameName, gameId});
    });
    this.setState({ gameNames });
  }

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  }

  select = (event) => {
    const tar = event.target.id.replace('Input', '');
    this.setState({ [tar]: event.target.value });
  }

  selectGame = (event) => {
    const val = event.target.value;
    this.state.gameNames.forEach((game) => {
      if (game.gameName === val) {
        this.setState({ game });
      }
    });
  }

  selectDifficulty = (event) => {

    const convertDifficulty = (tar) => {
      switch(tar) {
        case 'easy' : return 1;
        case 'normal' : return 2;
        case 'hard' : return 3;
        default: break;
      }
    }

    const tar = event.target.id.replace('Input', '');
    this.setState({ easy: false, normal: false, hard: false }, () => {
      this.setState({ [tar]: true, difficulty: convertDifficulty(tar) });
    });
  }

  proposeAchieve = (event) => {
    event.preventDefault();
    const convertDifficulty = (tar) => {
      switch(tar) {
        case 'easy' : return 1;
        case 'normal' : return 2;
        case 'hard' : return 3;
        default: break;
      }
    }

    const newAchievement = {
      name: this.state.name,
      gameId: parseInt(this.state.game.gameId, 10),
      difficulty: convertDifficulty(this.state.difficulty),
      description: this.state.description,
      image: this.state.image
    }
    achievementData.addProposedAchievement(newAchievement)
      .then(() => {
        this.props.refresh();
        this.toggle();
      });
  }

  render() {
    return(
      <div className='proposeAchievement'>
        <Button className='btn btn-info btn-sm' onClick={this.toggle}>Propose New Achievement</Button>
        <Modal className='proposeModal' isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader className='proposeModalHeader' toggle={this.toggle}>
            Propose a New Achievement
          </ModalHeader>
          <ModalBody className='proposeModalBody'>
            <form className='submitAchievementForm'>
              <div className="form-group">
                <label htmlFor="gameInput">Name</label>
                <input type="text" className="form-control" id="nameInput" placeholder="Enter achievement name" onChange={this.select}/>
              </div>
              <div className="form-group">
                <label htmlFor="gameInput">Game</label>
                <input type="text" className="form-control" id="gameInput" placeholder="Enter game name" onChange={this.selectGame}/>
              </div>
              <div className="form-group">
                <label htmlFor="descriptionInput">Description</label>
                <input type="text" className="form-control" id="descriptionInput" placeholder="Enter achievement description" onChange={this.select}/>
              </div>
              <div className="form-group">
                <label htmlFor="imageInput">Image Link</label>
                <input type="text" className="form-control" id="imageInput" placeholder="Enter icon link" onChange={this.select}/>
              </div>
              <div className='difficultyContainer'>
                <p className='difficultyTitle'>Difficulty: </p>
                <div className='form-check form-check-inline'>
                    <label className="form-check-label radioLabel" htmlFor="easyInput">Easy</label>
                    <input type="radio" className="form-check-input" value='option1' id="easyInput" checked={this.state.easy} onChange={this.selectDifficulty}/>
                </div>
                <div className='form-check form-check-inline'>
                  <label className="form-check-label radioLabel" htmlFor="nameInput">Normal</label>
                  <input type="radio" className="form-check-input" value='option1' id="normalInput" checked={this.state.normal} onChange={this.selectDifficulty}/>
                </div>
                <div className='form-check form-check-inline'>
                  <label className="form-check-label radioLabel" htmlFor="hardInput">Hard</label>
                  <input type="radio" className="form-check-input" value='option1' id="hardInput" checked={this.state.hard} onChange={this.selectDifficulty}/>
                </div>
              </div>
              <button type="submit" className="btn btn-primary submitProposal" onClick={this.proposeAchieve}>Submit</button>
            </form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default proposeAchievement;