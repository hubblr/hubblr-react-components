import {
  ComponentClass,
  FormEvent,
  InputHTMLAttributes,
  ReactNode,
  RefObject,
} from 'react';

type ServerValidationError = string | boolean;

interface FormProps {
  children: ReactNode;
  isDisabled: boolean;
  onSubmit: (e?: FormEvent<HTMLFormElement>) => boolean | void;
  serverValidationError?: ServerValidationError;
  onSubmitValidationFailed?: () => void;
  className?: string;
  navIsFixed?: boolean;
}

export const Form: ComponentClass<FormProps>;

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  children?: ReactNode;
  name: string;
  groupName?: string;
  placeholder: string;
  inputClasses?: string;
  groupClassNames?: string;
  innerGroupClassNames?: string;
  labelClassNames?: string;
  type?: string;
  onValidate?: () => true | string;
  onBlur?: () => void;
  value?: string | number;
  inputRef?: RefObject<HTMLInputElement>;
  label?: string;
  showValidationErrors?: boolean;
  stickPlaceholderHint?: boolean;
  validateWith?: string[];
  relatedFields?: string[];
  hideValidateOnEmpty?: boolean;
  isOptional?: boolean;
}

export const Input: ComponentClass<InputProps>;
