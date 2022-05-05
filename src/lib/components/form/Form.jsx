import React from 'react';
import PropTypes from 'prop-types';
import { jumpToFirstElement } from '../../util/helpers';

export const FormInputContext = React.createContext(undefined);
export const FormValidationErrorsContext = React.createContext({});

class Form extends React.Component {
  constructor(props) {
    super(props);

    // subscribed components / check functions for components populated by register calls
    this.componentValidators = {};
    this.componentFilledChecks = {};
    this.componentJumpRefs = {};

    // internally managed elements
    this.state = {
      validationErrors: props.serverValidationErrors,
      componentGroupsTouched: {},
    };
    this.emptyFields = [];

    // pass state information / manipulation functions to Context
    const { componentGroupsTouched } = this.state;

    this.getComponentsToJumpToEmptyFields = this.getComponentsToJumpToEmptyFields.bind(this);
    this.getComponentsToJumpToForErrors = this.getComponentsToJumpToForErrors.bind(this);
    this.registerComponentFilledCheck = this.registerComponentFilledCheck.bind(this);
    this.unregisterComponentFilledCheck = this.unregisterComponentFilledCheck.bind(this);
    this.triggerComponentFilledChecks = this.triggerComponentFilledChecks.bind(this);
    this.registerComponentValidator = this.registerComponentValidator.bind(this);
    this.unregisterComponentValidator = this.unregisterComponentValidator.bind(this);
    this.markComponentGroupTouched = this.markComponentGroupTouched.bind(this);
    this.registerGroupJumpRef = this.registerGroupJumpRef.bind(this);
    this.unregisterGroupJumpRef = this.unregisterGroupJumpRef.bind(this);
    this.updateErrorMessageForComponent = this.updateErrorMessageForComponent.bind(this);
    this.triggerComponentValidators = this.triggerComponentValidators.bind(this);
    this.testAllComponentValidators = this.testAllComponentValidators.bind(this);
    this.clearValidationErrors = this.clearValidationErrors.bind(this);

    this.formContextValue = {
      isDisabled: props.isDisabled,
      getComponentsToJumpToEmptyFields: this.getComponentsToJumpToEmptyFields,
      getComponentsToJumpToForErrors: this.getComponentsToJumpToForErrors,
      registerComponentFilledCheck: this.registerComponentFilledCheck,
      unregisterComponentFilledCheck: this.unregisterComponentFilledCheck,
      triggerComponentFilledChecks: this.triggerComponentFilledChecks,
      registerComponentValidator: this.registerComponentValidator,
      unregisterComponentValidator: this.unregisterComponentValidator,
      componentGroupsTouched,
      markComponentGroupTouched: this.markComponentGroupTouched,
      registerGroupJumpRef: this.registerGroupJumpRef,
      unregisterGroupJumpRef: this.unregisterGroupJumpRef,
      updateErrorMessageForComponent: this.updateErrorMessageForComponent,
      triggerComponentValidators: this.triggerComponentValidators,
      clearValidationErrors: this.clearValidationErrors,
    };
  }

  componentDidUpdate(prevProps) {
    const { serverValidationErrors } = this.props;

    // every time the serverValidationErrors prop changes, we update the current error messages to show the respecting errors
    if (serverValidationErrors !== prevProps.serverValidationErrors) {
      Object.keys(serverValidationErrors).forEach((key) =>
        this.updateErrorMessageForComponent(key, serverValidationErrors[key])
      );
    }
  }

  /* GETTER FUNCTIONS TO ACCESS STATE */

  getFilteredComponentsToJumpTo(filter) {
    const jumpElements = [];
    Object.entries(this.componentJumpRefs).forEach(([groupName, jumpRef]) => {
      if (jumpRef && jumpRef.current && filter(groupName)) {
        jumpElements.push(jumpRef.current);
      }
    });
    return jumpElements;
  }

  getComponentsToJumpToEmptyFields() {
    this.triggerComponentFilledChecks();
    return this.getFilteredComponentsToJumpTo((groupName) => this.emptyFields.includes(groupName));
  }

  getComponentsToJumpToForErrors() {
    const { validationErrors } = this.state;
    return this.getFilteredComponentsToJumpTo((groupName) =>
      Object.keys(validationErrors).includes(groupName)
    );
  }

  /* FUNCTION REGISTRATION */

  // Elements within this form may register to check whether they are considered 'empty'
  registerComponentFilledCheck(fieldName, fillCheck) {
    this.componentFilledChecks[fieldName] = fillCheck;
  }

  // When registered components unmount or disappear in any way, they have to unregister
  unregisterComponentFilledCheck(fieldName) {
    delete this.componentFilledChecks[fieldName];
  }

  // Elements within this form may register for validation purposes
  registerComponentValidator(fieldName, validator) {
    this.componentValidators[fieldName] = validator;
  }

  // When registered components unmount or disappear in any way, they have to unregister
  unregisterComponentValidator(fieldName) {
    const { [fieldName]: toBeKicked, ...others } = this.componentValidators;
    this.componentValidators = others;
  }

  // (Debounced) validation is only applied to elements the user 'touched'. Elements within the
  // form may report themselves as touched
  markComponentGroupTouched(groupName, touched) {
    this.setState((prevState) => {
      const { [groupName]: previousErrorOfField, ...others } = prevState.componentGroupsTouched;

      return {
        componentGroupsTouched: {
          ...others,
          ...{ [groupName]: touched },
        },
      };
    });
  }

  // Elements within this form may register a ref to a DOM element which should be jumped to to
  // focus on this element
  registerGroupJumpRef(groupName, ref) {
    this.componentJumpRefs[groupName] = ref;
  }

  // When registered components unmount or disappear in any way, they have to unregister
  unregisterGroupJumpRef(groupName) {
    const { [groupName]: toBeKicked, ...others } = this.componentJumpRefs;
    this.componentJumpRefs = others;
  }

  /* HANDLING OF SUBMIT AND OF REGISTERED FUNCTIONS */

  testAllComponentValidators() {
    const validationResults = Object.keys(this.componentValidators).map((componentName) => {
      return this.componentValidators[componentName]({
        markAsTouched: true,
        triggeredBySubmit: true,
      });
    });

    return !validationResults.includes(false);
  }

  jumpToFirstError() {
    const { navIsFixed } = this.props;

    setTimeout(() => {
      jumpToFirstElement(this.getComponentsToJumpToForErrors(), {
        navIsFixed,
        smooth: false,
      });
    }, 1);
  }

  updateErrorMessageForComponent(fieldName, error = null) {
    this.setState((prevState) => {
      const { [fieldName]: previousErrorOfField, ...others } = prevState.validationErrors;
      return {
        validationErrors: {
          ...others,
          ...(error !== null ? { [fieldName]: error } : {}),
        },
      };
    });
  }

  // manual trigger of registered fill checks
  triggerComponentFilledChecks(fieldNames) {
    const emptyFields = [];
    Object.entries(this.componentFilledChecks).forEach(([fieldName, fillCheck]) => {
      if (fieldNames && !fieldNames.includes(fieldName)) {
        return;
      }
      if (!fillCheck()) {
        emptyFields.push(fieldName);
      }
    });
    this.emptyFields = emptyFields;
    return emptyFields;
  }

  // manual trigger of registered validation checks, can be applied to specific fields only
  triggerComponentValidators(
    componentNamesToValidate,
    { markAsTouched = false, triggeredByValidateWith = false, triggeredBySubmit = false } = {}
  ) {
    componentNamesToValidate.forEach((name) => {
      if (typeof this.componentValidators[name] === 'function') {
        this.componentValidators[name]({
          markAsTouched,
          triggeredByValidateWith,
          triggeredBySubmit,
        });
      }
    });
  }

  // dump all current validation errors
  clearValidationErrors() {
    const { serverValidationErrors } = this.props;

    this.setState({ validationErrors: serverValidationErrors });
  }

  render() {
    // transfer the updated state to updated context
    const { onSubmit, children, onSubmitValidationFailed, className } = this.props;
    const { validationErrors } = this.state;
    const { componentGroupsTouched } = this.state;
    this.formContextValue.componentGroupsTouched = componentGroupsTouched;

    return (
      <FormInputContext.Provider value={this.formContextValue}>
        <FormValidationErrorsContext.Provider value={validationErrors}>
          <form
            className={className}
            onSubmit={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!this.testAllComponentValidators()) {
                onSubmitValidationFailed();
                this.jumpToFirstError();
                return;
              }

              if ((await onSubmit(e)) === false) {
                this.testAllComponentValidators();
              }
            }}
            noValidate="novalidate"
          >
            {children}
          </form>
        </FormValidationErrorsContext.Provider>
      </FormInputContext.Provider>
    );
  }
}

Form.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  isDisabled: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  serverValidationErrors: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
  ),
  onSubmitValidationFailed: PropTypes.func,
  className: PropTypes.string,
  navIsFixed: PropTypes.bool,
};

Form.defaultProps = {
  className: '',
  isDisabled: false,
  serverValidationErrors: {},
  onSubmitValidationFailed: () => {},
  navIsFixed: false,
};

export default Form;
