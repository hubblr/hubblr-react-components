import { useCallback, useContext, useEffect } from 'react';
import { FormInputContext, FormValidationErrorsContext } from '../Form';
import useRegisterComponentValidation from './useRegisterComponentValidation';

export default function useFormConnectedValidation(groupName, validate, invocationCondition) {
  const { componentGroupsTouched, markComponentGroupTouched, updateErrorMessageForComponent } =
    useContext(FormInputContext);
  // get currently displayed error message
  const validationErrors = useContext(FormValidationErrorsContext);
  let prevErrorMessage = validationErrors[groupName];
  prevErrorMessage = prevErrorMessage || null;

  // create validation callback. careful: calling this will update form state
  const connectedValidate = useCallback(() => {
    const touched = componentGroupsTouched[groupName];

    // mark as touched if not done before
    if (!touched) {
      markComponentGroupTouched(groupName, true);
    }

    // get values
    const validationResult = validate ? validate() : true;
    const isValid = validationResult === true;
    const errorMessage = isValid ? null : validationResult;

    // update error message
    if (!touched || prevErrorMessage !== errorMessage) {
      updateErrorMessageForComponent(groupName, errorMessage);
    }

    return isValid;
  }, [
    componentGroupsTouched,
    groupName,
    markComponentGroupTouched,
    prevErrorMessage,
    updateErrorMessageForComponent,
    validate,
  ]);

  // register validation callback within the form
  useRegisterComponentValidation(groupName, connectedValidate);

  // execute function if invocation condition is given / met
  useEffect(() => {
    if (invocationCondition) {
      connectedValidate();
    }
  }, [connectedValidate, invocationCondition]);

  return connectedValidate;
}
