import React from 'react';
import PropTypes from 'prop-types';
import Menu from './Menu';
import Info from './Info';
import './styles/App.scss';

const sumPrices = items => items.reduce((total, currentItem) => total + currentItem.price, 0);
const cartContainsSection = (section, cart) => cart.map(item => item.section).indexOf(section) > -1;
const cartContainsItem = (itemId, cart) => cart.map(item => item.id).indexOf(itemId) > -1;

const arrayOfArrays = (arrayCount) => {
  const output = [];
  for (let i = 0; i < arrayCount; i += 1) {
    output.push([]);
  }
  return output;
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeDinerId: -1,
      totalBill: 0,
      error: null,
      carts: arrayOfArrays(this.props.dinerCount),
    };
  }

  totalBill() {
    return this.state.carts.reduce((total, cart) => total + sumPrices(cart), 0);
  }

  checkError() {
    let dinersHaveCorrectCourses = true;
    this.state.carts.forEach((cart) => {
      if ((cart.length < 2) || !cartContainsSection('mains', cart)) {
        dinersHaveCorrectCourses = false;
      }
    });

    if (!dinersHaveCorrectCourses) {
      return 'Each person must have at least two courses, one of which must be a main';
    }

    let cheesecakeCount = 0;
    this.state.carts.forEach((cart) => {
      cheesecakeCount += cartContainsItem(11, cart) ? 1 : 0;
    });

    if (cheesecakeCount > 1) {
      return 'Sorry! There is only one piece of cheesecake left!';
    }

    let dinersMealsClash = false;
    this.state.carts.forEach((cart) => {
      if (cartContainsItem(4, cart) && cartContainsItem(7, cart)) {
        dinersMealsClash = true;
      }
    });

    if (dinersMealsClash) {
      return 'Pierre says you can\'t have prawn cocktail and salmon fillet in the same meal. Sorry, he makes the rules...';
    }

    return null;
  }

  exitOverlay() {
    return this.setState({ activeDinerId: -1 });
  }

  menuOverlay() {
    if (this.state.activeDinerId !== -1) {
      return <div id='menuOverlay' onClick={() => this.exitOverlay()} />;
    }
    return null;
  }

  toggleCartItem(dinerId, section, itemData) {
    this.setState((currentState) => {
      const currentCarts = currentState.carts;
      const { id, price } = itemData;
      const menuItemCartIndex = currentCarts[dinerId].map(item => item.id).indexOf(id);

      if (menuItemCartIndex > -1) {
        currentCarts[dinerId].splice(menuItemCartIndex, 1);
      } else {
        currentCarts[dinerId].push({
          id,
          section,
          price,
        });
      }

      return { carts: currentCarts };
    }, () => this.setState({ totalBill: this.totalBill(), error: this.checkError() }));
  }

  info() {
    return <Info bill={this.state.totalBill} error={this.state.error} />;
  }

  menu(dinerId) {
    return (
      <Menu
        key={dinerId}
        dinerId={dinerId}
        activeDinerId={this.state.activeDinerId}
        toggleCartItem={(id, section, itemData) => this.toggleCartItem(id, section, itemData)}
        cart={this.state.carts[dinerId]}
        info={this.info()}
        exitOverlay={() => this.exitOverlay()}
      />
    );
  }

  dinerSelector(dinerId) {
    return (
      <div
        className='dinerSelector'
        onClick={() => this.setState({ activeDinerId: dinerId })}
        key={dinerId}
      >
        <p>
          Diner
          {' '}
          {dinerId}
        </p>
      </div>
    );
  }

  render() {
    const dinerSelectors = [];
    const menus = [];
    for (let i = 0; i < this.props.dinerCount; i += 1) {
      dinerSelectors.push(this.dinerSelector(i));
      menus.push(this.menu(i));
    }

    return (
      <main>
        <div id='openingScreen'>
          <div id='title'>
            <h1> Dining Room </h1>
            <h2> Click on the diner to confirm their dish selection </h2>
          </div>
          <div id='dinerSelectorContainer'>
            {dinerSelectors}
          </div>
          {this.info()}
        </div>
        {this.menuOverlay()}
        {menus}
      </main>
    );
  }
}

App.propTypes = {
  dinerCount: PropTypes.number,
};

App.defaultProps = {
  dinerCount: 2,
};

export default App;
