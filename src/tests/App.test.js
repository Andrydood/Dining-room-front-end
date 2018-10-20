import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import App from '../App';
import Menu from '../Menu';

Enzyme.configure({ adapter: new Adapter() });

describe('App component', () => {
  it('should create the appropriate resources depending on the specified amount of diners', () => {
    const component = Enzyme.shallow(<App dinerCount={2} />);

    expect(component.find(Menu).length).toEqual(2);
    expect(component.find('.dinerSelector').length).toEqual(2);
    expect(component.state('carts').length).toEqual(2);
  });

  it('should select correct dinerid when corresponding button is clicked', () => {
    const component = Enzyme.shallow(<App dinerCount={2} />);
    const secondDinerButton = component.find('.dinerSelector').at(1);
    secondDinerButton.simulate('click');

    expect(component.state('activeDinerId')).toEqual(1);
  });

  it('should add menu item to diner\'s cart when toggleCartItem is ran', () => {
    const component = Enzyme.shallow(<App dinerCount={2} />);
    component.instance().toggleCartItem(1, 'starters', { id: 1, name: 'Soup', price: 3 });

    expect(component.state('carts')).toEqual([[], [{
      id: 1,
      price: 3,
      section: 'starters',
    }]]);
  });

  it('should remove menu item from diner\'s cart if item is submitted in toggleCartItem while already in cart', () => {
    const component = Enzyme.shallow(<App dinerCount={2} />);
    component.setState({
      carts: [[], [{
        id: 1,
        price: 3,
        section: 'starters',
      }]],
    });
    component.instance().toggleCartItem(1, 'starters', { id: 1, name: 'Soup', price: 3 });

    expect(component.state('carts')).toEqual([[], []]);
  });

  it('should calculate the total bill and modify state after adding items to cart', () => {
    const component = Enzyme.shallow(<App dinerCount={2} />);
    component.instance().toggleCartItem(1, 'starters', { id: 1, name: 'Soup', price: 3 });
    component.instance().toggleCartItem(1, 'desserts', { id: 9, name: 'Sticky toffee', price: 18 });

    expect(component.state('totalBill')).toEqual(21);
  });

  it('should calculate error and modify state after adding items to cart', () => {
    const component = Enzyme.shallow(<App dinerCount={2} />);
    component.instance().toggleCartItem(1, 'starters', { id: 1, name: 'Soup', price: 3 });

    expect(component.state('error')).toBeTruthy();
  });

  it('should display no errors for correct item selection', () => {
    const currentCart = [
      [
        {
          id: 7,
          section: 'mains',
          price: 14,
        },
        {
          id: 2,
          section: 'starters',
          price: 5,
        },
      ],
      [
        {
          id: 12,
          section: 'desserts',
          price: 3.5,
        },
        {
          id: 7,
          section: 'mains',
          price: 14,
        },
      ],
    ];
    const component = Enzyme.shallow(<App dinerCount={2} />);
    component.setState({ carts: currentCart });

    expect(component.instance().checkError()).toEqual(null);
  });

  it('should display correct error if each diner doesn\'t have at least two courses', () => {
    const currentCart = [
      [
        {
          id: 2,
          section: 'starters',
          price: 5,
        },
      ],
      [
        {
          id: 12,
          section: 'desserts',
          price: 3.5,
        },
        {
          id: 7,
          section: 'mains',
          price: 14,
        },
      ],
    ];
    const component = Enzyme.shallow(<App dinerCount={2} />);
    component.setState({ carts: currentCart });

    expect(component.instance().checkError()).toEqual('Each person must have at least two courses, one of which must be a main');
  });

  it('should display correct error if each diner doesn\'t have at least one main', () => {
    const currentCart = [
      [
        {
          id: 2,
          section: 'starters',
          price: 5,
        },
        {
          id: 12,
          section: 'desserts',
          price: 3.5,
        },
      ],
      [
        {
          id: 12,
          section: 'desserts',
          price: 3.5,
        },
        {
          id: 7,
          section: 'mains',
          price: 14,
        },
      ],
    ];
    const component = Enzyme.shallow(<App dinerCount={2} />);
    component.setState({ carts: currentCart });

    expect(component.instance().checkError()).toEqual('Each person must have at least two courses, one of which must be a main');
  });

  it('should display correct error if more than one diner orders a cheesecake', () => {
    const currentCart = [
      [
        {
          id: 7,
          section: 'mains',
          price: 14,
        },
        {
          id: 11,
          section: 'desserts',
          price: 4,
        },
      ],
      [
        {
          id: 11,
          section: 'desserts',
          price: 4,
        },
        {
          id: 7,
          section: 'mains',
          price: 14,
        },
      ],
    ];
    const component = Enzyme.shallow(<App dinerCount={2} />);
    component.setState({ carts: currentCart });

    expect(component.instance().checkError()).toEqual('Sorry! There is only one piece of cheesecake left!');
  });

  it('should display correct error if a diner selects the shrimp and salmon dishes together', () => {
    const currentCart = [
      [
        {
          id: 4,
          section: 'starters',
          price: 6,
        },
        {
          id: 7,
          section: 'mains',
          price: 14,
        },
      ],
      [
        {
          id: 7,
          section: 'mains',
          price: 14,
        },
        {
          id: 8,
          section: 'mains',
          price: 12,
        },
      ],
    ];
    const component = Enzyme.shallow(<App dinerCount={2} />);
    component.setState({ carts: currentCart });

    expect(component.instance().checkError())
      .toEqual('Pierre says you can\'t have prawn cocktail and salmon fillet in the same meal. Sorry, he makes the rules...');
  });
});
