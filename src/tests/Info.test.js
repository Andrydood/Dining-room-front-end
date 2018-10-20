import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Info from '../Info';

Enzyme.configure({ adapter: new Adapter() });

describe('Info component', () => {
  it('should display the price with 2 decimal places', () => {
    const component = Enzyme.shallow(<Info bill={10} />);
    expect(component.find('.totalPrice').text()).toEqual('£10.00');
  });
});
