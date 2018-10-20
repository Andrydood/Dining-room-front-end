import React from 'react';
import PropTypes from 'prop-types';
import './styles/Menu.scss';

import inputMenuData from '../menu-data.json';

const capitaliseWords = string => string.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

class Menu extends React.Component {
  toggleCart(sectionName, itemData) {
    this.props.toggleCartItem(this.props.dinerId, sectionName, itemData);
  }

  menuItem(sectionName, itemData) {
    const isInCart = this.props.cart.map(item => item.id).indexOf(itemData.id) > -1;
    const itemClasses = isInCart ? 'menuItem selected' : 'menuItem';

    return (
      <div
        className={itemClasses}
        key={itemData.id}
        onClick={() => this.toggleCart(sectionName, itemData)}
      >
        <li className='name'>
          {itemData.name}
        </li>
        <li className='price'>
          £
          {' '}
          {itemData.price.toFixed(2)}
        </li>
      </div>
    );
  }

  menuSection(sectionName, sectionData) {
    const sectionItems = sectionData.map(itemData => this.menuItem(sectionName, itemData));

    return (
      <div className='menuSection' key={sectionName}>
        <h2>{capitaliseWords(sectionName)}</h2>
        {sectionItems}
      </div>
    );
  }

  menu(menuData) {
    if (this.props.activeDinerId === this.props.dinerId) {
      const sections = Object
        .keys(menuData)
        .map(sectionName => this.menuSection(sectionName, menuData[sectionName]));

      const menuOverlay = (
        <div className='menu'>
          <div className='exit' onClick={() => this.props.exitOverlay()}> x </div>
          {sections}
          {this.props.info}
        </div>
      );
      return menuOverlay;
    }

    return null;
  }

  render() {
    return this.menu(inputMenuData);
  }
}

Menu.propTypes = {
  activeDinerId: PropTypes.number,
  toggleCartItem: PropTypes.func.isRequired,
  cart: PropTypes.array.isRequired,
  dinerId: PropTypes.number.isRequired,
  info: PropTypes.element.isRequired,
  exitOverlay: PropTypes.func.isRequired,
};

Menu.defaultProps = {
  activeDinerId: -1,
};

export default Menu;
