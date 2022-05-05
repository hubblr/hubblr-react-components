import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/pro-regular-svg-icons';
import ResultLayoverItem from '../../../../common/result-layover/ResultLayoverItem';
import ResultLayover from '../../../../common/result-layover/ResultLayover';
import { useIsMobile } from '../../../../../util/helpers';
import { trimAutocompleteSuggestion } from '../../../../../util/googlePlaces';

function PlacesAutocompleteSuggestionLayover({
  children,
  isOpen,
  onClose,
  loading,
  suggestions,
  getSuggestionItemProps,
  withMarker,
}) {
  const isMobile = useIsMobile();

  return (
    // prevent body manipulation used by ResultLayover by default - should be handled further up
    <>
      {(!loading || isMobile) && (
        <ResultLayover
          customMobileHeader
          preventBodyManipulations
          isOpen={isOpen}
          onClose={onClose}
        >
          {children}
          {!loading && (
            <div className="autocomplete-dropdown-container">
              {suggestions.map((suggestion, i) => {
                return (
                  <div
                    key={suggestion.description}
                    data-med-test="patient-address-layover-items"
                    {...getSuggestionItemProps(suggestion)}
                  >
                    <ResultLayoverItem
                      key={suggestion.description}
                      className={`flex flex-row text-left px-8 py-4 ${
                        suggestion.active ? 'bg-brand-ice-blue' : ''
                      }`}
                      data-med-test={`patient-address-layover-item-${i}`}
                    >
                      {withMarker && (
                        <div className="pr-3">
                          <FontAwesomeIcon icon={faMapMarkerAlt} size="lg" />
                        </div>
                      )}
                      <div data-recording-sensitive="true">
                        {trimAutocompleteSuggestion(suggestion)}
                      </div>
                    </ResultLayoverItem>
                  </div>
                );
              })}
            </div>
          )}
        </ResultLayover>
      )}
    </>
  );
}

PlacesAutocompleteSuggestionLayover.propTypes = {
  children: PropTypes.node,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  loading: PropTypes.bool,
  suggestions: PropTypes.arrayOf(
    PropTypes.shape({
      active: PropTypes.bool,
      description: PropTypes.string,
    })
  ),
  getSuggestionItemProps: PropTypes.func,
  withMarker: PropTypes.bool,
};

PlacesAutocompleteSuggestionLayover.defaultProps = {
  children: null,
  isOpen: false,
  onClose: null,
  loading: false,
  suggestions: [],
  getSuggestionItemProps: null,
  withMarker: false,
};

export default PlacesAutocompleteSuggestionLayover;
