import React from 'react';
import PropTypes from 'prop-types';

const ResultLayoverItem = ({ className, children, onClick, ...props }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`hover:bg-brand-ice-blue animate px-4 py-2 overflow-hidden w-full ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
ResultLayoverItem.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
};
ResultLayoverItem.defaultProps = {
  onClick: null,
  className: '',
};
export default ResultLayoverItem;
