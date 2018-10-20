import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Menu from '../Menu';

const mockToggleFunction = jest.fn(() => {});

Enzyme.configure({ adapter: new Adapter() });

describe('Menu component', () => {
  it('should not display the menu if activeDinerId is not equal to dinerId', () => {
    const component = Enzyme.shallow(<Menu
      dinerId={0}
      activeDinerId={1}
      toggleCartItem={() => {}}
      cart={[]}
      info={<div />}
      exitOverlay={() => {}}
    />);

    expect(component.exists('.menu')).toEqual(false);
  });

  it('should display the menu if activeDinerId is equal to dinerId', () => {
    const component = Enzyme.shallow(<Menu
      dinerId={1}
      activeDinerId={1}
      toggleCartItem={() => {}}
      cart={[]}
      info={<div />}
      exitOverlay={() => {}}
    />);

    expect(component.exists('.menu')).toEqual(true);
  });

  it('should correctly display each section', () => {
    const component = Enzyme.shallow(<Menu
      dinerId={1}
      activeDinerId={1}
      toggleCartItem={() => {}}
      cart={[]}
      info={<div />}
      exitOverlay={() => {}}
    />);

    const sectionTitles = component.find('.menuSection').map(node => node.find('h2').text());

    expect(sectionTitles).toEqual(['Starters', 'Mains', 'Desserts']);
  });

  it('should correctly display each item in a section', () => {
    const component = Enzyme.shallow(<Menu
      dinerId={1}
      activeDinerId={1}
      toggleCartItem={() => {}}
      cart={[]}
      info={<div />}
      exitOverlay={() => {}}
    />);

    const itemTitles = component.find('.menuSection').map(section => section.find('.menuItem').map(item => item.find('.name').text()));

    expect(itemTitles).toEqual(
      [['Soup', 'Pâté', 'Bruschetta', 'Prawn cocktail'],
        ['Steak', 'Meatballs', 'Salmon fillet', 'Vegetarian lasagna'],
        ['Sticky toffee', 'Tiramisu', 'Cheesecake', 'Ice cream']],
    );
  });

  it('should not give menuItem the selected classname if item is not in cart', () => {
    const component = Enzyme.shallow(
      <Menu
        dinerId={1}
        activeDinerId={1}
        toggleCartItem={() => {}}
        cart={[]}
        info={<div />}
        exitOverlay={() => {}}
      />,
    );

    const firstItem = component.find('.menuSection').first().find('.menuItem').first();

    expect(firstItem.hasClass('selected')).toEqual(false);
  });

  it('should add the selected classname to menuItem if menuItem is already in cart', () => {
    const component = Enzyme.shallow(
      <Menu
        dinerId={1}
        activeDinerId={1}
        toggleCartItem={() => {}}
        cart={[{
          id: 1,
          price: 3,
        }]}
        info={<div />}
        exitOverlay={() => {}}
      />,
    );

    const firstItem = component.find('.menuSection').first().find('.menuItem').first();

    expect(firstItem.hasClass('selected')).toEqual(true);
  });

  it('should trigger the toggleCartItem with the appropriate variables when menuItem is clicked', () => {
    const component = Enzyme.shallow(<Menu
      dinerId={1}
      activeDinerId={1}
      toggleCartItem={(dinerId, section, itemData) => mockToggleFunction(dinerId, section, itemData)}
      cart={[]}
      info={<div />}
      exitOverlay={() => {}}
    />);

    const firstItem = component.find('.menuSection').first().find('.menuItem').first();
    firstItem.simulate('click');

    expect(mockToggleFunction.mock.calls[0]).toEqual([1, 'starters', { id: 1, name: 'Soup', price: 3 }]);
  });
});
