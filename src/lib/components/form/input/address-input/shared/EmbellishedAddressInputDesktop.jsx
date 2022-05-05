import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/pro-regular-svg-icons';
import Input from '../../../Input';
import Spinner from '../../../../spinner/Spinner';
import AnimatedCheckmark from '../../../../animated/AnimatedCheckmark';
import ClearButtonRound from '../../../../button/ClearButtonRound';

function EmbellishedAddressInputDesktop({
  value,
  loading,
  showsValidLocation,
  showError,
  onResetInput,
  onFocus,
  onBlur,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);

  // determine element to show next to input based on state
  let interactionElementType;
  if (loading) {
    interactionElementType = 'spinner';
  } else if (showsValidLocation && !isFocused) {
    interactionElementType = 'checkmark';
  } else if (value) {
    interactionElementType = 'clearButton';
  }

  // handle "blur" via window listener since close button is not within input
  useEffect(() => {
    const listener = () => {
      setIsFocused(false);

      if (onBlur) {
        onBlur();
      }
    };
    window.addEventListener('pointerdown', listener);
    return () => window.removeEventListener('pointerdown', listener);
  }, [onBlur]);

  return (
    <div
      className={`px-8 input-wrapper py-0 flex flex-row items-center ${
        showError ? 'not-valid' : ''
      }`}
    >
      <div className="flex-shrink-0 pr-3">
        <FontAwesomeIcon
          icon={faMapMarkerAlt}
          size="lg"
          className={showsValidLocation ? 'text-brand-green-neon' : ''}
        />
      </div>
      <Input
        value={value}
        groupClassNames="flex-grow"
        inputClasses="py-4 bg-inherit truncate"
        name="location"
        onPointerDown={(e) => {
          e.stopPropagation();
        }}
        onFocus={() => {
          setIsFocused(true);
          if (onFocus) {
            onFocus();
          }
        }}
        showValidationError={false}
        {...props}
      />
      <div className="flex-shrink-0 w-8 h-8 flex justify-center items-center p-1">
        {interactionElementType === 'spinner' && <Spinner size="sm" />}
        {interactionElementType === 'checkmark' && (
          <AnimatedCheckmark className="stroke-2 w-full h-full text-brand-green-neon" />
        )}
        {interactionElementType === 'clearButton' && (
          <ClearButtonRound
            className="w-full h-full"
            onPointerDown={(e) => {
              e.stopPropagation();
              onResetInput();
            }}
          />
        )}
      </div>
    </div>
  );
}

EmbellishedAddressInputDesktop.propTypes = {
  value: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  showsValidLocation: PropTypes.bool,
  showError: PropTypes.bool,
  onResetInput: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

EmbellishedAddressInputDesktop.defaultProps = {
  loading: false,
  showsValidLocation: false,
  showError: false,
  onResetInput: null,
  onFocus: null,
  onBlur: null,
};

export default EmbellishedAddressInputDesktop;
