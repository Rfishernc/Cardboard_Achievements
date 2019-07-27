import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import './menu.scss';

class menu extends React.Component {
  state = {
    dropdownOpen: false,
    selection: 'Select Achievement'
  }

  toggle = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  }

  select = (event) => {
    const val = event.target.value;
    const achievementId = event.target.id.replace('achievement', '');
    this.setState({ selection: val }, () => {
      this.props.menuSelector(achievementId);
    });
  }

  menuBuilder = () => {
    const renderArray = [];
    if (this.props.achievements !== undefined && this.props.achievements !== null) {
      this.props.achievements.forEach((achievement) => {
        renderArray.push(<DropdownItem value={achievement.achievementName} onClick={this.select}
          id={`achievement${achievement.achievementId}`} key={`achievement${achievement.achievementId}`}>
        {achievement.achievementName}</DropdownItem>);
      });
    }
    return renderArray;
  }

  render() {
    return(
      <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} className='menu'>
        <DropdownToggle caret>
          {this.state.selection}
        </DropdownToggle>
        <DropdownMenu>
          {this.menuBuilder()}
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default menu;