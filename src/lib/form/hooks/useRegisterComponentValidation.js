import { useContext, useEffect } from 'react';
import { FormInputContext } from '../components/Form';

export default function useRegisterComponentValidation(groupName, validate) {
  const { registerComponentValidator, unregisterComponentValidator } =
    useContext(FormInputContext);

  useEffect(() => {
    registerComponentValidator(groupName, validate);
    return () => {
      unregisterComponentValidator(groupName);
    };
  }, [
    groupName,
    registerComponentValidator,
    unregisterComponentValidator,
    validate,
  ]);
}
