import React, { useRef, useState } from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import PropTypes from 'prop-types';
import { useIsMobile } from '../../../../util/helpers';
import useMobileLayover from '../../../../hooks/components/useMobileLayover';
import usePlacesAutocompleteInteraction from '../../../../hooks/address/usePlacesAutocompleteInteraction';
import PlacesAutocompleteSuggestionLayover from './shared/PlacesAutocompleteSuggestionLayover';
import AddressInputMobileLayover from './shared/AddressInputMobileLayover';
import EmbellishedAddressInputDesktop from './shared/EmbellishedAddressInputDesktop';
import { trimAutocompleteSuggestion } from '../../../../util/googlePlaces';

function EmbellishedAddressInputWithMobileLayover({
  displayValue,
  placeholder,
  showsValidLocation,
  showError,
  onSelectLocation,
  type,
  containerClassName,
  onInputChange,
  onResetInput,
  autoComplete,
  ...props
}) {
  const isMobile = useIsMobile();
  const mobileInputRef = useRef();

  // focus mobile input when mobile layover opens
  const [isOpenDesktop, setIsOpenDesktop] = useState(false);
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
        const suggestionsExist = !!suggestions && !!suggestions.length;

        const onBlur = () => {
          if (!showsValidLocation && suggestionsExist) {
            onSelectLocation(trimAutocompleteSuggestion(suggestions[0]));
          }
          setIsOpenDesktop(false);
        };

        const { autocompleteInputProps, desktopAutocompleteInputProps } = inferFromRender({
          getInputProps,
          suggestions,
          onBlur,
        });

        return (
          <div className={`flex flex-col w-full ${containerClassName}`}>
            {/* DESKTOP INPUT */}
            <EmbellishedAddressInputDesktop
              value={displayValue}
              placeholder={placeholder}
              loading={loading}
              showsValidLocation={showsValidLocation}
              showError={showError}
              onResetInput={onResetInput}
              onFocus={() => {
                setIsOpenDesktop(true);
                setOpenMobile();
              }}
              {...props}
              {...desktopAutocompleteInputProps}
            />

            {/* SUGGESTION LIST */}
            <PlacesAutocompleteSuggestionLayover
              isOpen={
                (isMobile && mobileLayoverShown) ||
                (!isMobile && isOpenDesktop && suggestionsExist && !showsValidLocation)
              }
              onClose={setClosedMobile}
              loading={loading}
              suggestions={suggestions}
              getSuggestionItemProps={getSuggestionItemProps}
              withMarker
            >
              <AddressInputMobileLayover
                ref={mobileInputRef}
                value={displayValue}
                placeholder={placeholder}
                onClose={setClosedMobile}
                autocompleteInputProps={autocompleteInputProps}
                onResetInput={onResetInput}
              />
            </PlacesAutocompleteSuggestionLayover>

            {showError && (
              <div className="validation-error mt-2">
                Bitte geben Sie Ihre Addresse mit Haus&shy;nummer an.
              </div>
            )}
          </div>
        );
      }}
    </PlacesAutocomplete>
  );
}

EmbellishedAddressInputWithMobileLayover.propTypes = {
  type: PropTypes.string,
  onSelectLocation: PropTypes.func.isRequired,
  displayValue: PropTypes.string,
  placeholder: PropTypes.string,
  showsValidLocation: PropTypes.bool,
  showError: PropTypes.bool,
  containerClassName: PropTypes.string,
  onInputChange: PropTypes.func,
  onResetInput: PropTypes.func,
  autoComplete: PropTypes.string,
};

EmbellishedAddressInputWithMobileLayover.defaultProps = {
  type: 'address',
  displayValue: undefined,
  placeholder: '',
  showsValidLocation: false,
  showError: false,
  onInputChange: undefined,
  onResetInput: undefined,
  containerClassName: 'relative',
  autoComplete: 'new-street',
};

export default EmbellishedAddressInputWithMobileLayover;
