import { useContext } from 'react';
import { FormInputContext, FormValidationErrorsContext } from '../Form';

export default function useValidationClassName(groupName, { onlyInvalid = false } = {}) {
  const { componentGroupsTouched } = useContext(FormInputContext);
  const isTouched = componentGroupsTouched[groupName];
  const validationErrors = useContext(FormValidationErrorsContext);
  const isValid = !validationErrors?.[groupName];

  if (!isTouched) {
    return '';
  }

  if (isValid) {
    return onlyInvalid ? '' : 'is-valid';
  }
  return 'not-valid';
}
