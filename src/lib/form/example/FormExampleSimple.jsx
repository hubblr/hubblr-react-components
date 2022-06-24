import React, { useState } from 'react';
import Form from '../components/Form';
import Input from '../components/Input';
import { validateNotEmpty } from '../util/validate';

function FormExampleSimple() {
  const [inputValue, setInputValue] = useState('');
  const [isSubmitAccepted, setIsSubmitAccepted] = useState(false);

  const onSubmit = () => {
    setIsSubmitAccepted(true);
  };

  const onChange = (e) => {
    setInputValue(e.target.value);
  };

  const validate = validateNotEmpty('Empty input!');

  return (
    <div className="max-w-[32rem]">
      <h2>Example with simple validation (empty / not empty)</h2>
      <Form onSubmit={onSubmit}>
        <Input
          name="input"
          placeholder="INPUT"
          value={inputValue}
          showValidationError
          inputClasses="input-wrapper"
          onChange={onChange}
          onValidate={validate}
        />
        <button type="submit">SUBMIT</button>
        {isSubmitAccepted && <div>Form submitted correctly!</div>}
      </Form>
    </div>
  );
}

export default FormExampleSimple;
