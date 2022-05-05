import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/pro-regular-svg-icons';
import ClearButtonRound from '../../../../button/ClearButtonRound';
import { MobileQuery } from '../../../../../util/helpers';

const AddressInputMobileLayover = forwardRef(
  ({ value, placeholder, onClose, autocompleteInputProps, onResetInput }, mobileInputRef) => {
    return (
      <MobileQuery>
        <div className="relative flex flex-row w-full py-4 px-2">
          <button
            type="button"
            aria-label="Overlay schließen"
            className="pl-2 pr-2 mr-2 flex-shrink-0"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          <input
            ref={mobileInputRef}
            name="location-mobile"
            className="search-bar-input-padding outline-none w-full"
            {...autocompleteInputProps}
            placeholder={placeholder}
          />

          {value && (
            <div className="absolute top-0 right-0 pr-5 h-full flex flex-row items-center">
              <ClearButtonRound onClick={onResetInput} />
            </div>
          )}
        </div>
      </MobileQuery>
    );
  }
);

AddressInputMobileLayover.propTypes = {
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  autocompleteInputProps: PropTypes.objectOf(PropTypes.any),
  onResetInput: PropTypes.func.isRequired,
};

AddressInputMobileLayover.defaultProps = {
  placeholder: '',
  autocompleteInputProps: null,
};

export default AddressInputMobileLayover;
