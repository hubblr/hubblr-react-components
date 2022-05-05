import React from "react";
import PropTypes from "prop-types";
import { FormValidationErrorsContext } from "./Form";
import withContext from "../../util/hoc/withContext";

const ValidationError = ({ fieldName, validationErrors, className }) => {
  console.log("RENDERS");

  const fieldNameArr = Array.isArray(fieldName) ? fieldName : [fieldName];
  let errorMessage = "";
  // check all passed fields for errors, display the first if there are multiple
  for (let i = 0; i < fieldNameArr.length; i += 1) {
    const testedFieldName = fieldNameArr[i];
    const validationError = validationErrors[testedFieldName];
    if (validationError) {
      errorMessage = validationError;
      break;
    }
  }

  return errorMessage ? (
    <p className={`validation-error mt-2 ${className}`}>{errorMessage}</p>
  ) : null;
};

ValidationError.propTypes = {
  fieldName: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  validationErrors: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
  ).isRequired,
  className: PropTypes.string,
};

ValidationError.defaultProps = {
  className: "",
};

export default withContext(
  FormValidationErrorsContext,
  "validationErrors"
)(ValidationError);
