import React from 'react';
import PropTypes from 'prop-types';
import { m as motion } from 'framer-motion';

const animationVariants = {
  visible: {
    opacity: 1,
    scale: 1,
    transitionStart: {
      opacity: 0,
      scale: 0,
    },
  },
  hidden: {
    scale: 0,
    opacity: 0,
    transitionStart: {
      opacity: 1,
      scale: 1,
    },
  },
};

const AnimatedCheckboxLabelSquare = ({ checked, className }) => (
  <div
    className={`checkbox-label-square flex-shrink-0 flex flex-col items-center justify-center w-6 h-6 ${
      checked ? 'checked' : ''
    } ${className}`}
  >
    <motion.div
      animate={checked ? 'visible' : 'hidden'}
      variants={animationVariants}
      initial={false}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        className="stroke-current fill-current"
      >
        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
      </svg>
    </motion.div>
  </div>
);

AnimatedCheckboxLabelSquare.propTypes = {
  checked: PropTypes.bool,
  className: PropTypes.string,
};

AnimatedCheckboxLabelSquare.defaultProps = {
  checked: false,
  className: '',
};

export default AnimatedCheckboxLabelSquare;
