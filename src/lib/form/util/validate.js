import isEmpty from "validator/es/lib/isEmpty";
import { findPhoneNumbersInText } from "libphonenumber-js/max";
import { isTime } from "../../shared/util/helpers";

export function validateNotEmpty(errMsg) {
  return (v) => !isEmpty(v) || errMsg;
}

export const validateFirstName = validateNotEmpty(
  "Bitte geben Sie Ihren Vornamen an."
);

export const validateLastName = validateNotEmpty(
  "Bitte geben Sie Ihren Nachnamen an."
);

export const validateFullName = validateNotEmpty(
  "Bitte geben Sie Ihren Namen an."
);

// FIXME: add back functionality to differentiate fixed line from mobile numbers
export function validatePhoneNumber(errMsg, setPhoneNumber) {
  return (v) => {
    const parsedNumbers = findPhoneNumbersInText(v, "DE");

    if (parsedNumbers.length !== 1) {
      return errMsg;
    }
    const parsedNumber = parsedNumbers[0];

    if (setPhoneNumber) {
      setPhoneNumber(parsedNumber.number.number);
    }

    return true;
  };
}

export function validateTime(v) {
  if (!v || !isTime(v)) {
    return "Bitte geben Sie eine valide Uhrzeit an.";
  }
  return true;
}
