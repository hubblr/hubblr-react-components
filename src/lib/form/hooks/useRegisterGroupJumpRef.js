import { useContext, useEffect } from 'react';
import { FormInputContext } from '../components/Form';

export default function useRegisterGroupJumpRef(groupName, ref) {
  const { registerGroupJumpRef, unregisterGroupJumpRef } =
    useContext(FormInputContext);

  useEffect(() => {
    registerGroupJumpRef(groupName, ref);
    return () => {
      unregisterGroupJumpRef(groupName);
    };
  }, [groupName, ref, registerGroupJumpRef, unregisterGroupJumpRef]);
}
