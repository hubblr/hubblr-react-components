import useRegisterComponentFilledCheck from './useRegisterComponentFilledCheck';
import useFormConnectedValidation from './useFormConnectedValidation';
import useValidationClassName from './useValidationClassName';

export default function useFormRegister(
  groupName,
  { fillCheck, validate, invocationCondition }
) {
  useRegisterComponentFilledCheck(groupName, fillCheck);
  useFormConnectedValidation(groupName, validate, invocationCondition);
  const validationClassName = useValidationClassName(groupName);

  return {
    validationClassName,
  };
}
