import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import usePersistedValue from '../../hooks/usePersistedValue';
import { debounce } from '../../util/helpers';
import useFormConnectedValidation from './hooks/useFormConnectedValidation';
import useValidationClassName from './hooks/useValidationClassName';
import useRegisterComponentFilledCheck from './hooks/useRegisterComponentFilledCheck';

function GroupInput({
  children,
  className,
  inputClassName,
  name,
  value,
  groupName,
  checkFilled,
  onValidate,
  ...other
}) {
  // handle press status
  const [isPressed, setIsPressed] = useState(false);
  useEffect(() => {
    const releasePress = () => {
      if (isPressed) {
        setIsPressed(false);
      }
    };
    window.addEventListener('mouseup', releasePress);
    return () => {
      window.removeEventListener('mouseup', releasePress);
    };
  });

  // track current values of value and validator for callbacks
  const { ref: valueRef, valueChanged } = usePersistedValue(value);
  const { ref: validatorRef } = usePersistedValue(onValidate);

  const appliedCheckFilled = useCallback(() => {
    const curValue = valueRef.current;
    return checkFilled(curValue);
  }, [checkFilled, valueRef]);
  useRegisterComponentFilledCheck(groupName, appliedCheckFilled);

  // create validator which accesses persisted values
  const inputValidationCallback = useCallback(() => {
    const curValue = valueRef.current;
    const curValidator = validatorRef.current;
    return curValidator(curValue);
  }, [validatorRef, valueRef]);
  // connect validator with form update functions
  const formConnectedValidation = useFormConnectedValidation(groupName, inputValidationCallback);

  // debounce connected validator for input update checks
  const ref = React.useRef();
  if (!ref.current) {
    ref.current = debounce(formConnectedValidation, 500);
  }
  const debouncedValidator = ref.current;

  // perform update checks whenever value changes
  if (valueChanged) {
    debouncedValidator();
  }

  const validationClassName = useValidationClassName(groupName);

  return (
    <div className={`input-group ${className}`}>
      <input
        type="text"
        name={name}
        value={value}
        className={`w-full ${inputClassName} ${isPressed ? 'pressed' : validationClassName}`}
        onMouseDown={() => {
          setIsPressed(true);
        }}
        onBlur={debouncedValidator}
        {...other}
      />
      {children}
    </div>
  );
}

GroupInput.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  groupName: PropTypes.string.isRequired,
  checkFilled: PropTypes.func,
  onValidate: PropTypes.func,
};

GroupInput.defaultProps = {
  children: null,
  className: '',
  inputClassName: '',
  checkFilled: null,
  onValidate: null,
};

export default GroupInput;
