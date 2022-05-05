import React, { useRef } from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import PropTypes from 'prop-types';
import Input from '../../Input';
import { useIsMobile } from '../../../../util/helpers';
import useMobileLayover from '../../../../hooks/components/useMobileLayover';
import PlacesAutocompleteSuggestionLayover from './shared/PlacesAutocompleteSuggestionLayover';
import usePlacesAutocompleteInteraction from '../../../../hooks/address/usePlacesAutocompleteInteraction';
import AddressInputMobileLayover from './shared/AddressInputMobileLayover';

function AddressInputWithMobileLayover({
  displayValue,
  placeholder,
  onSelectLocation,
  selectedLocation,
  type,
  containerClassName,
  onInputChange,
  onResetInput,
  ...props
}) {
  const isMobile = useIsMobile();
  const mobileInputRef = useRef();

  // focus mobile input when mobile layover opens
  const { mobileLayoverShown, setOpenMobile, setClosedMobile } = useMobileLayover({
    mobileInputRef,
  });

  const { inferFromRender, onChange, onSelect } = usePlacesAutocompleteInteraction({
    onInputChange,
    onSelectLocation,
    setClosedMobile,
  });

  return (
    <PlacesAutocomplete
      value={displayValue}
      onChange={onChange}
      onSelect={onSelect}
      highlightFirstSuggestion={!isMobile}
      searchOptions={{
        types: [type],
        componentRestrictions: {
          country: 'de',
        },
      }}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => {
        const { autocompleteInputProps, desktopAutocompleteInputProps, suggestionsExist } =
          inferFromRender({ getInputProps, suggestions });

        return (
          <div className={`flex flex-col w-full ${containerClassName}`}>
            {/* DESKTOP INPUT */}
            <Input
              name="location"
              onFocus={() => {
                setOpenMobile();
              }}
              placeholder={placeholder}
              {...props}
              {...desktopAutocompleteInputProps}
            />

            {/* SUGGESTION LIST */}
            <PlacesAutocompleteSuggestionLayover
              isOpen={mobileLayoverShown || suggestionsExist}
              onClose={setClosedMobile}
              loading={loading}
              suggestions={suggestions}
              getSuggestionItemProps={getSuggestionItemProps}
            >
              <AddressInputMobileLayover
                value={displayValue}
                placeholder={placeholder}
                onClose={setClosedMobile}
                autocompleteInputProps={autocompleteInputProps}
                onResetInput={onResetInput}
              />
            </PlacesAutocompleteSuggestionLayover>
          </div>
        );
      }}
    </PlacesAutocomplete>
  );
}

AddressInputWithMobileLayover.propTypes = {
  type: PropTypes.string,
  onSelectLocation: PropTypes.func.isRequired,
  selectedLocation: PropTypes.shape({
    description: PropTypes.string,
  }),
  displayValue: PropTypes.string,
  placeholder: PropTypes.string,
  containerClassName: PropTypes.string,
  onInputChange: PropTypes.func,
  onResetInput: PropTypes.func,
};

AddressInputWithMobileLayover.defaultProps = {
  type: 'address',
  selectedLocation: null,
  displayValue: undefined,
  placeholder: '',
  onInputChange: undefined,
  onResetInput: undefined,
  containerClassName: 'relative',
};

export default AddressInputWithMobileLayover;
