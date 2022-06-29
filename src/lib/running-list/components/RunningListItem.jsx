import React from 'react';
import PropTypes from 'prop-types';
import '../styles/animation.css';

function RunningListItem({ children }) {
  return (
    <li className="running-list-item text-center uppercase mx-2">
      <span>{children}</span>
    </li>
  );
}

RunningListItem.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RunningListItem;
