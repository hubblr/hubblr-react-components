import React from 'react';
import PropTypes from 'prop-types';
import PlacesAutocomplete from 'react-places-autocomplete';
import { useIsMobile } from '../../../../util/helpers';
import usePlacesAutocompleteInteraction from '../../../../hooks/address/usePlacesAutocompleteInteraction';
import Input from '../../Input';
import ResultLayoverItem from '../../../common/result-layover/ResultLayoverItem';
import { trimAutocompleteSuggestion } from '../../../../util/googlePlaces';

function AddressInput({
  displayValue,
  placeholder,
  onInputChange,
  onSelectLocation,
  containerClassName,
  showError,
  hideSuggestions,
  ...props
}) {
  const isMobile = useIsMobile();

  const { inferFromRender, onChange, onSelect } = usePlacesAutocompleteInteraction({
    onInputChange,
    onSelectLocation,
  });

  return (
    <PlacesAutocomplete
      value={displayValue}
      onChange={onChange}
      onSelect={onSelect}
      highlightFirstSuggestion={!isMobile}
      searchOptions={{
        types: ['address'],
        componentRestrictions: {
          country: 'de',
        },
      }}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps }) => {
        const { autocompleteInputProps, suggestionsExist } = inferFromRender({
          getInputProps,
          suggestions,
        });

        return (
          <div className={`flex flex-col w-full ${containerClassName}`}>
            {/* DESKTOP INPUT */}
            <Input
              name="location"
              placeholder={placeholder}
              {...autocompleteInputProps}
              {...props}
            />

            {/* SUGGESTION LIST */}
            {!hideSuggestions && suggestionsExist && (
              <div className="relative">
                <div className="mt-2 w-full border-t border-brand-gray rounded-lg absolute top-0 left-0 z-20 max-h-80 overflow-auto shadow-modal bg-white p-4 autocomplete-dropdown-container">
                  {suggestions.map((suggestion) => {
                    return (
                      <div key={suggestion.description} {...getSuggestionItemProps(suggestion)}>
                        <ResultLayoverItem
                          key={suggestion.description}
                          className={`flex flex-row text-left px-8 py-4 ${
                            suggestion.active ? 'bg-brand-ice-blue' : ''
                          }`}
                        >
                          <div data-recording-sensitive="true">
                            {trimAutocompleteSuggestion(suggestion)}
                          </div>
                        </ResultLayoverItem>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      }}
    </PlacesAutocomplete>
  );
}

AddressInput.propTypes = {
  displayValue: PropTypes.string,
  placeholder: PropTypes.string,
  onInputChange: PropTypes.func,
  onSelectLocation: PropTypes.func,
  containerClassName: PropTypes.string,
  showError: PropTypes.bool,
  hideSuggestions: PropTypes.bool,
};

AddressInput.defaultProps = {
  displayValue: '',
  placeholder: '',
  onInputChange: null,
  onSelectLocation: null,
  containerClassName: '',
  showError: false,
  hideSuggestions: false,
};

export default AddressInput;
