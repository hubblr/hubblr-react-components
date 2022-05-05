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

const AnimatedRadioBox = ({ checked, className, innerClassName }) => {
  return (
    <div
      className={`radio-box w-6 h-6 flex-shrink-0 flex flex-col items-center justify-center ${
        checked ? 'checked' : ''
      } ${className}`}
    >
      <motion.div
        animate={checked ? 'visible' : 'hidden'}
        variants={animationVariants}
        initial={false}
        className={`h-3 w-3 flex-shrink-0 ${innerClassName}`}
      />
    </div>
  );
};

AnimatedRadioBox.propTypes = {
  checked: PropTypes.bool,
  className: PropTypes.string,
  innerClassName: PropTypes.string,
};

AnimatedRadioBox.defaultProps = {
  checked: false,
  className: '',
  innerClassName: '',
};

export default AnimatedRadioBox;
