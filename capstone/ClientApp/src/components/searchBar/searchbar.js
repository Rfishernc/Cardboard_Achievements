import React from 'react';
import { InputGroup, Input, Button} from 'reactstrap';
import { NavLink } from 'react-router-dom';
import './searchBar.scss';

class searchBar extends React.Component {
  state = {
    value: "",
    dropdownOpen: false
}

  render() {
    return(
      <div className='searchBar'>
        <InputGroup>
            <Input className="input" type="text" value={this.state.value} placeholder="Search..." />
            <Button className="btn"><NavLink to="/search-results"><i className="fas fa-search"></i></NavLink></Button>
        </InputGroup>
      </div>
    );
  }
}

export default searchBar;