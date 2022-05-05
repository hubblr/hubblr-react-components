import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/pro-light-svg-icons';
import Form from './Form';

const FormWithErrorHint = ({ children, ...props }) => {
  const scrollRef = useRef();
  const [errorHint, setErrorHint] = useState();

  const scrollToHint = () => {
    const scrollY = window.scrollY + scrollRef.current.getBoundingClientRect().top - 90;
    window.scrollTo({
      top: scrollY,
      behavior: 'smooth',
    });
  };

  const showError = (error) => {
    setErrorHint(error);
    if (error && scrollRef && scrollRef.current) {
      scrollToHint();
    }
  };

  const onSubmitValidationFailed = async () => {
    if (!props.onSubmitValidationFailed) {
      showError(null);
      return;
    }

    const error = await Promise.resolve(props.onSubmitValidationFailed());
    if (error && error !== true) {
      showError(error);
    }
  };

  const onSubmit = async () => {
    showError(null);

    if (!props.onSubmit) {
      return;
    }

    const error = await Promise.resolve(props.onSubmit());
    if (error && error !== true) {
      showError(error);
    }
  };

  return (
    <div ref={scrollRef}>
      <Form {...props} onSubmitValidationFailed={onSubmitValidationFailed} onSubmit={onSubmit}>
        {errorHint && (
          <div className="flex-col flex-shrink-0 p-2 bg-orange-100 rounded-lg mb-4 w-full">
            <div className="flex flex-row items-center text-orange-500">
              <div className="flex-col flex-shrink-0">
                <FontAwesomeIcon icon={faExclamationCircle} size="lg" className="flex-shrink-0" />
              </div>
              <div className="flex flex-col pl-1">
                <span className="font-bold uppercase text-sm">Unvollständige Angaben</span>
              </div>
            </div>
            <div className="flex flex-row text-black mt-2">
              <span className="font-light">{errorHint}</span>
            </div>
          </div>
        )}

        {children}
      </Form>
    </div>
  );
};

FormWithErrorHint.propTypes = {
  onSubmit: PropTypes.func,
  onSubmitValidationFailed: PropTypes.func,
  children: PropTypes.node.isRequired,
};

FormWithErrorHint.defaultProps = {
  onSubmit: undefined,
  onSubmitValidationFailed: () => 'Bitte überprüfen Sie Ihre Angaben im Formular.',
};

export default FormWithErrorHint;
