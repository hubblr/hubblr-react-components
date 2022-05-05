import { useEffect, useContext } from 'react';
import { FormInputContext } from '../Form';

export default function useInitialValidationIfSet(groupName, value) {
  const { triggerComponentValidators } = useContext(FormInputContext);

  useEffect(() => {
    setTimeout(() => {
      if (value) {
        triggerComponentValidators([groupName], { markAsTouched: true });
      }
    }, 0);
    // disable exhaustive-deps bc we only want to trigger this on first render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
