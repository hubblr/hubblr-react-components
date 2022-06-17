import React from 'react';
import PropTypes from 'prop-types';
import TextareaAutosize from './textarea/TextareaAutosize';

const Textarea = ({ placeholder, className, inputClassName, textSize, required, ...props }) => {
  return (
    <div className={`input-group ${className} size-${textSize}`}>
      <TextareaAutosize
        placeholder={placeholder}
        required={required}
        className={`w-full ${inputClassName}`}
        {...props}
      />
    </div>
  );
};

Textarea.propTypes = {
  placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  textSize: PropTypes.string,
  required: PropTypes.bool,
};

Textarea.defaultProps = {
  placeholder: '',
  className: '',
  inputClassName: '',
  textSize: '',
  required: false,
};

export default Textarea;
