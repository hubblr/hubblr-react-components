import React from "react";
import PropTypes from "prop-types";
import Input from "../Input";
import { validateTime } from "../../util/validate";
import useInitialValidationIfSet from "../../hooks/useInitialValidationIfSet";

function TimeInput({ value, placeholder, label, name, ...otherProps }) {
  useInitialValidationIfSet(name, value);

  return (
    <Input
      name={name}
      value={value}
      onValidate={validateTime}
      label={label}
      inputClasses="input-wrapper"
      placeholder={placeholder}
      maxLength={5}
      {...otherProps}
    />
  );
}

TimeInput.propTypes = {
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
};

TimeInput.defaultProps = {
  placeholder: "08:00",
  label: "Uhrzeit",
  name: "time",
};

export default TimeInput;
