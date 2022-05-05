import { useContext, useEffect } from 'react';
import { FormInputContext } from '../Form';

export default function useRegisterComponentFilledCheck(groupName, fillCheck) {
  const { registerComponentFilledCheck, unregisterComponentFilledCheck } =
    useContext(FormInputContext);

  useEffect(() => {
    registerComponentFilledCheck(groupName, fillCheck);
    return () => {
      unregisterComponentFilledCheck(groupName);
    };
  }, [fillCheck, groupName, registerComponentFilledCheck, unregisterComponentFilledCheck]);
}
