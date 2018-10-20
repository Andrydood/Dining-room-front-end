import React from 'react';
import PropTypes from 'prop-types';
import './styles/Info.scss';

const Info = props => (
  <div className='info'>
    <p className='error'>
      {props.error}
    </p>
    <div className='total'>
      <li>Total:</li>
      <li className='totalPrice'>
        £
        {props.bill.toFixed(2)}
      </li>
    </div>
  </div>

);

Info.propTypes = {
  bill: PropTypes.number,
  error: PropTypes.string,
};

Info.defaultProps = {
  bill: 0,
  error: null,
};

export default Info;
