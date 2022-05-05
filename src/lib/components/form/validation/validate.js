import isEmpty from 'validator/es/lib/isEmpty';
import { parsePhoneNumberFromString } from 'libphonenumber-js/max';
import { isTime } from '../../../util/helpers';

export function validateNotEmpty(errMsg) {
  return (v) => !isEmpty(v) || errMsg;
}

export const validateFirstName = validateNotEmpty('Bitte geben Sie Ihren Vornamen an.');

export const validateLastName = validateNotEmpty('Bitte geben Sie Ihren Nachnamen an.');

export const validateFullName = validateNotEmpty('Bitte geben Sie Ihren Namen an.');

export function validatePhoneNumber(errMsg, setPhoneNumber, allowFixedLineNumbers = true) {
  const allowedNumberTypes = ['MOBILE'];
  if (allowFixedLineNumbers) {
    allowedNumberTypes.push('FIXED_LINE');
  }
  const allowedNumberTypesRegex = new RegExp(`^(?:${allowedNumberTypes.join('|')})$`);

  return (v) => {
    const parsedNumber = parsePhoneNumberFromString(v, 'DE');
    const parsedNumberType = parsedNumber?.getType();
    if (!parsedNumberType || !allowedNumberTypesRegex.test(parsedNumberType)) {
      return errMsg;
    }
    if (setPhoneNumber) {
      setPhoneNumber(parsedNumber.number);
    }

    return true;
  };
}

export function validateTime(v) {
  if (!v || !isTime(v)) {
    return 'Bitte geben Sie eine valide Uhrzeit an.';
  }
  return true;
}
