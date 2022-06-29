import React from 'react';
import PropTypes from 'prop-types';
import isEmail from 'validator/es/lib/isEmail';
import Input from '../Input';

function EmailInput({
  value,
  valueSetter,
  placeholder,
  label,
  name,
  maxLength,
  errorMsg,
  skipValidation,
  ...otherProps
}) {
  return (
    <Input
      placeholder={placeholder}
      label={label}
      name={name}
      value={value}
      onChange={(e) => {
        valueSetter(e.target.value);
      }}
      onValidate={(v) => {
        // overridden validation
        if (skipValidation) {
          return true;
        }
        // base e-mail validation
        if (!v) {
          return errorMsg;
        }
        const trimmedEmail = v.trim();
        if (!isEmail(trimmedEmail)) {
          return errorMsg;
        }

        valueSetter(trimmedEmail);
        return true;
      }}
      maxLength={maxLength}
      {...otherProps}
    />
  );
}

EmailInput.propTypes = {
  value: PropTypes.string.isRequired,
  valueSetter: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  maxLength: PropTypes.number,
  errorMsg: PropTypes.string,
  skipValidation: PropTypes.bool,
};

EmailInput.defaultProps = {
  placeholder: 'email address',
  label: 'email address',
  name: 'email',
  maxLength: 255,
  errorMsg: 'Please enter a valid email address.',
  skipValidation: false,
};

export default EmailInput;
