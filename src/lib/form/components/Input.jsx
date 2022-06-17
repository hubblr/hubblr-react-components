import React from "react";
import PropTypes from "prop-types";
import isEmpty from "validator/es/lib/isEmpty";
import { debounce } from "../../shared/util/helpers";
import { FormInputContext, FormValidationErrorsContext } from "./Form";
import ValidationError from "./ValidationError";
import withContext from "../../shared/util/hoc/withContext";

class Input extends React.Component {
  validateAfterChangeDebounce = debounce(
    () => this.validateInput({ markAsTouched: true }),
    500
  );

  constructor(props) {
    super(props);

    this.state = {
      showPlaceholderHint: false,
      isValueEmpty: true,
      isPressed: false,
      showValidationError: props.showValidationError,
    };

    this.validateInput = this.validateInput.bind(this);
    this.checkIfFilled = this.checkIfFilled.bind(this);
    this.setPressed = this.setPressed.bind(this);
    this.setNotPressed = () => {
      this.setPressed(false);
    };
  }

  componentDidMount() {
    const { value: initialValue, formInputContext } = this.props;
    const groupName = this.getGroupName();

    this.checkIfFilled(undefined, initialValue);

    if (formInputContext && formInputContext.registerComponentValidator) {
      formInputContext.registerComponentValidator(
        groupName,
        this.validateInput
      );
    }
    if (formInputContext && formInputContext.registerComponentFilledCheck) {
      formInputContext.registerComponentFilledCheck(groupName, () => {
        const { isValueEmpty } = this.state;
        return !isValueEmpty;
      });
    }
    if (formInputContext && formInputContext.markComponentGroupTouched) {
      formInputContext.markComponentGroupTouched(groupName, false);
    }

    window.addEventListener("mouseup", this.setNotPressed);
  }

  componentDidUpdate(prevProps) {
    const { value: oldValue } = prevProps;
    const {
      value: currValue,
      label,
      formInputContext,
      name,
      stickPlaceholderHint,
    } = this.props;
    const groupName = this.getGroupName();

    if (oldValue !== currValue && label !== undefined) {
      // eslint-disable-next-line
      this.setState({
        showPlaceholderHint:
          stickPlaceholderHint || (currValue && currValue.length),
      });
    }

    const touched = formInputContext?.componentGroupsTouched[groupName];
    if (!touched && oldValue !== currValue) {
      if (formInputContext && formInputContext.markComponentGroupTouched) {
        formInputContext.markComponentGroupTouched(groupName, true);
      }
    }

    if (formInputContext && oldValue !== currValue) {
      formInputContext.updateErrorMessageForComponent(name, null);
      this.validateAfterChangeDebounce();
    }

    this.checkIfFilled(oldValue, currValue);
  }

  componentWillUnmount() {
    const { formInputContext } = this.props;
    const groupName = this.getGroupName();

    if (formInputContext && formInputContext.unregisterComponentValidator) {
      formInputContext.unregisterComponentValidator(groupName);
    }
    if (formInputContext && formInputContext.unregisterComponentFilledCheck) {
      formInputContext.unregisterComponentFilledCheck(groupName);
    }

    window.removeEventListener("mouseup", this.setNotPressed);
  }

  getGroupName() {
    const { name, groupName } = this.props;
    return groupName || name;
  }

  setPressed(pressed) {
    const { isPressed } = this.state;
    if (isPressed === pressed) {
      return;
    }
    this.setState(() => {
      return {
        isPressed: pressed,
      };
    });
  }

  checkIfFilled(oldValue, currValue) {
    const { label, stickPlaceholderHint } = this.props;

    if (oldValue !== currValue) {
      // eslint-disable-next-line
      this.setState({
        isValueEmpty: !currValue || !currValue.length,
      });

      if (label !== undefined) {
        this.setState({
          showPlaceholderHint:
            stickPlaceholderHint || (currValue && currValue.length),
        });
      }
    }
  }

  validateInput({
    markAsTouched = false,
    triggeredByValidateWith = false,
    triggeredBySubmit = false,
  } = {}) {
    const {
      value: currValue,
      onValidate,
      formInputContext,
      isOptional,
      hideValidateOnEmpty,
      showValidationError: passedShowValidationError,
      validateWith,
      relatedFields,
    } = this.props;

    const groupName = this.getGroupName();
    const isValueEmpty = !currValue.length || currValue === "";

    // perform validation function and check validity / note potential error messages
    const validationResult = onValidate ? onValidate(currValue) : true;
    const isValid = validationResult === true;
    const errorMessage = validationResult === true ? null : validationResult;

    // validation might be hidden if hideValidateOnEmpty is set, but not on submit
    const isValidationHidden =
      hideValidateOnEmpty && isValueEmpty && !triggeredBySubmit;
    let allRelatedFieldsEmpty = isValueEmpty;
    if (relatedFields.length > 0) {
      const emptyFieldsValidateWith =
        formInputContext.triggerComponentFilledChecks(relatedFields);
      allRelatedFieldsEmpty =
        allRelatedFieldsEmpty &&
        emptyFieldsValidateWith.length === relatedFields.length;
    }
    // validation might be hidden for optional input, but must be careful if related fields are not
    // empty on submit
    const isValidationOptional =
      isOptional &&
      ((!triggeredBySubmit && isValueEmpty) ||
        (triggeredBySubmit && allRelatedFieldsEmpty));

    // determine further necessary actions
    let newShowValidationError;
    let newComponentGroupTouchStatus;
    if (isValidationHidden || isValidationOptional) {
      newShowValidationError = false;
      newComponentGroupTouchStatus = false;
    } else if (markAsTouched) {
      newShowValidationError = passedShowValidationError;
      newComponentGroupTouchStatus = true;
    }

    // update validation error display if error is not to be hidden
    if (typeof newShowValidationError === "boolean") {
      const { showValidationError: curShowValidationError } = this.state;
      // prevent recursion (especially important for validateWith calls)
      if (newShowValidationError !== curShowValidationError) {
        this.setState({ showValidationError: newShowValidationError });
      }
    }

    // update touched status
    if (
      typeof newComponentGroupTouchStatus === "boolean" &&
      formInputContext &&
      formInputContext.markComponentGroupTouched
    ) {
      formInputContext.markComponentGroupTouched(
        groupName,
        newComponentGroupTouchStatus
      );
    }

    // update validation error messages if input is touched
    const { validationErrors } = this.props;
    if (
      newComponentGroupTouchStatus &&
      validationErrors[groupName] !== errorMessage
    ) {
      formInputContext.updateErrorMessageForComponent(groupName, errorMessage);
    } else if (!newComponentGroupTouchStatus) {
      formInputContext.updateErrorMessageForComponent(groupName, null);
    }

    // feature to trigger other field's validation (use-case is for example the 3-step birthday input)
    // to prevent recursion this only works one level deep. Prevent redundant calls in submit
    if (
      !triggeredByValidateWith &&
      validateWith.length > 0 &&
      !triggeredBySubmit
    ) {
      formInputContext.triggerComponentValidators(validateWith, {
        markAsTouched: true,
        triggeredByValidateWith: true,
      });
    }

    return isValid || isValidationOptional;
  }

  render() {
    const {
      children,
      placeholder,
      inputClasses,
      groupClassNames,
      innerGroupClassNames,
      labelClassNames,
      onValidate,
      inputRef,
      onBlur,
      label,
      name,
      groupName,
      formInputContext,
      showValidationError: passedShowValidationError,
      validationErrors,
      value,
      stickPlaceholderHint,
      relatedFields,
      validateWith,
      isOptional,
      hideValidateOnEmpty,
      ...otherProps
    } = this.props;
    const usedGroupName = this.getGroupName();

    const {
      showPlaceholderHint,
      isValueEmpty,
      isPressed,
      type,
      showValidationError,
    } = this.state;

    const touched = formInputContext?.componentGroupsTouched[usedGroupName];
    const isValid = !(usedGroupName in validationErrors);

    let validationClasses = "";
    if (isPressed) {
      validationClasses += "pressed";
    } else if (
      (onValidate && touched) ||
      (!onValidate && isOptional && !isValueEmpty)
    ) {
      if (isValid === true) {
        validationClasses += "is-valid";
      } else {
        validationClasses += "not-valid";
      }
    }

    return (
      <div className={`input-group ${groupClassNames}`}>
        {showPlaceholderHint && (
          <div className={`${labelClassNames} placeholder-hint`}>
            {label || placeholder}
          </div>
        )}
        <div className={innerGroupClassNames}>
          <input
            type={type}
            name={name}
            value={value}
            placeholder={placeholder}
            className={`w-full ${inputClasses} ${validationClasses} ${
              showPlaceholderHint ? "placeholder-hint-visible" : ""
            } ${!isValueEmpty ? "filled" : ""}`}
            ref={inputRef}
            onBlur={() => {
              if (typeof value !== "string" || isEmpty(value)) {
                this.validateInput({ markAsTouched: true });
              }
              if (onBlur) {
                onBlur();
              }
            }}
            onMouseDown={() => {
              this.setPressed(true);
            }}
            {...otherProps}
          />
          {children}
        </div>
        {showValidationError && <ValidationError fieldName={name} />}
      </div>
    );
  }
}

Input.propTypes = {
  children: PropTypes.node,
  name: PropTypes.string.isRequired,
  // The field in which validation errors are written. Use for complex validation cases, e.g.,
  // when a group of inputs have to be evaluated together. If empty, defaults to name
  groupName: PropTypes.string,
  placeholder: PropTypes.string.isRequired,
  inputClasses: PropTypes.string,
  groupClassNames: PropTypes.string,
  innerGroupClassNames: PropTypes.string,
  labelClassNames: PropTypes.string,
  type: PropTypes.string,
  onValidate: PropTypes.func,
  onBlur: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  label: PropTypes.string,
  formInputContext: PropTypes.shape({
    registerComponentFilledCheck: PropTypes.func.isRequired,
    unregisterComponentFilledCheck: PropTypes.func.isRequired,
    registerComponentValidator: PropTypes.func.isRequired,
    unregisterComponentValidator: PropTypes.func.isRequired,
    componentGroupsTouched: PropTypes.objectOf(PropTypes.bool).isRequired,
    markComponentGroupTouched: PropTypes.func.isRequired,
    updateErrorMessageForComponent: PropTypes.func.isRequired,
    triggerComponentValidators: PropTypes.func.isRequired,
    triggerComponentFilledChecks: PropTypes.func.isRequired,
  }),
  validationErrors: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
  ).isRequired,
  showValidationError: PropTypes.bool,
  stickPlaceholderHint: PropTypes.bool,
  validateWith: PropTypes.arrayOf(PropTypes.string),
  relatedFields: PropTypes.arrayOf(PropTypes.string),
  hideValidateOnEmpty: PropTypes.bool,
  isOptional: PropTypes.bool,
};

Input.defaultProps = {
  children: null,
  groupName: "",
  inputClasses: "",
  groupClassNames: "",
  innerGroupClassNames: "",
  labelClassNames: "",
  onValidate: undefined,
  onBlur: undefined,
  value: undefined,
  type: "text",
  inputRef: undefined,
  label: undefined,
  formInputContext: undefined,
  showValidationError: false,
  stickPlaceholderHint: false,
  validateWith: [],
  relatedFields: [],
  hideValidateOnEmpty: false,
  isOptional: false,
};

export default withContext(
  FormValidationErrorsContext,
  "validationErrors"
)(withContext(FormInputContext, "formInputContext")(Input));
