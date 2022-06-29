import React, { useState } from 'react';
import '../../../index.scss';
import Form from '../components/Form';
import FormLabel from '../components/FormLabel';
import Input from '../components/Input';
import DateInput from '../components/input/DateInput';
import EmailInput from '../components/input/EmailInput';
import {
  validateFirstName,
  validateLastName,
  validatePhoneNumber,
} from '../util/validate';

function FormExampleUser() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  const inputNames = {
    firstName: 'patient-firstname-input',
    lastName: 'patient-lastname-input',
    birthdate: {
      day: 'birthday-day',
      month: 'birthday-month',
      year: 'birthday-year',
    },
    phoneNumber: 'patient-phonenumber-input',
    email: 'patient-email-input',
  };

  const [isSubmitAccepted, setIsSubmitAccepted] = useState(false);

  const onSubmit = () => {
    setIsSubmitAccepted(true);
  };

  return (
    <Form className="max-w-[32rem]" onSubmit={onSubmit}>
      <div className="flex gap-2">
        <div className="flex-1">
          <FormLabel groupName={inputNames.firstName} className="mt-6">
            First Name
          </FormLabel>
          <Input
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            labelClassNames="hidden"
            inputClasses="input-wrapper"
            name={inputNames.firstName}
            placeholder="Muster"
            onValidate={validateFirstName}
            showValidationError
            maxLength={128}
          />
        </div>
        <div className="flex-1">
          <FormLabel groupName={inputNames.lastName} className="mt-6">
            Last Name
          </FormLabel>
          <Input
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
            }}
            labelClassNames="hidden"
            inputClasses="input-wrapper"
            name={inputNames.lastName}
            placeholder="Mustermann"
            onValidate={validateLastName}
            showValidationError
            maxLength={128}
          />
        </div>
      </div>

      <DateInput
        value={birthdate}
        onChange={setBirthdate}
        label="Geburtstag"
        labelClassNames="mt-6"
        inputLabelClassName="hidden"
        inputClasses="input-wrapper"
        placeholder="DD.MM.YYYY"
        restriction="past"
      />

      <div>
        <FormLabel groupName={inputNames.phoneNumber} className="mt-6">
          Telefonnummer
        </FormLabel>
        <Input
          type="tel"
          value={phoneNumber}
          onChange={(e) => {
            setPhoneNumber(e.target.value);
          }}
          labelClassNames="hidden"
          inputClasses="input-wrapper"
          name={inputNames.phoneNumber}
          placeholder="+49176846...."
          onValidate={validatePhoneNumber(
            'Bitte geben Sie eine gültige Festnetz- oder Mobiltelefonnummer an.',
            (n) => {
              setPhoneNumber(n);
            }
          )}
          showValidationError
          maxLength={128}
        />
      </div>

      <div>
        <FormLabel groupName={inputNames.email} className="mt-6">
          E-Mail-Adresse
        </FormLabel>
        <EmailInput
          type="email"
          value={email}
          valueSetter={(v) => {
            setEmail(v);
          }}
          labelClassNames="hidden"
          inputClasses="input-wrapper"
          name={inputNames.email}
          placeholder="Mustermann"
          showValidationError
          maxLength={128}
        />
      </div>
      <button type="submit">SUBMIT</button>
      {isSubmitAccepted && <div>Form submitted correctly!</div>}
    </Form>
  );
}

export default FormExampleUser;
