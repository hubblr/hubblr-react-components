import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import isEmpty from "validator/es/lib/isEmpty";

import Input from "../Input";
import ValidationError from "../ValidationError";
import useInitialValidationIfSet from "../../hooks/useInitialValidationIfSet";
import useRegisterGroupJumpRef from "../../hooks/useRegisterGroupJumpRef";
import { isStringInteger } from "../../../shared/util/helpers";

const currentYear = new Date().getFullYear();

const DateInput = ({
  value,
  label,
  placeholder,
  onChange,
  labelClassNames,
  inputLabelClassName,
  isOptional,
  restriction,
  inputClasses,
  ...props
}) => {
  const [dayValue, setDayValue] = useState(undefined);
  const [monthValue, setMonthValue] = useState(undefined);
  const [yearValue, setYearValue] = useState(undefined);

  // initial validation of the three input fields
  useInitialValidationIfSet("birthday-day", dayValue);
  useInitialValidationIfSet("birthday-month", monthValue);
  useInitialValidationIfSet("birthday-year", yearValue);

  // register all date input fields to the single related label
  const dateJumpRef = useRef();
  useRegisterGroupJumpRef("birthday-day", dateJumpRef);
  useRegisterGroupJumpRef("birthday-month", dateJumpRef);
  useRegisterGroupJumpRef("birthday-year", dateJumpRef);

  // validation messages from isValidDate must be cleared from input fields by validateWith calls
  const determineOtherValidatedFields = (groupName) => {
    const otherValues = [];
    const otherFieldNames = [];
    if (groupName !== "birthday-day") {
      otherValues.push(dayValue);
      otherFieldNames.push("birthday-day");
    }
    if (groupName !== "birthday-month") {
      otherValues.push(monthValue);
      otherFieldNames.push("birthday-month");
    }
    if (groupName !== "birthday-year") {
      otherValues.push(yearValue);
      otherFieldNames.push("birthday-year");
    }
    const allOtherValuesSet = otherValues.findIndex((val) => !val) === -1;
    return allOtherValuesSet ? otherFieldNames : [];
  };

  const monthComponent = useRef();
  const yearComponent = useRef();

  // field reset if value is set to null
  useEffect(() => {
    if (value === null) {
      setDayValue(undefined);
      setMonthValue(undefined);
      setYearValue(undefined);
    }
  }, [value]);

  // field update after value update
  useEffect(() => {
    if (value && (!dayValue || !monthValue || !yearValue)) {
      const currentValue = moment(value);
      setDayValue(currentValue.format("DD"));
      setMonthValue(currentValue.format("MM"));
      setYearValue(currentValue.format("YYYY"));
    }
    // only react to external setting of value, not to internal changes to day / month / year
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // update of value on field update
  useEffect(() => {
    const currentDateSelect = `${yearValue}-${monthValue}-${dayValue}`;
    if (
      moment(currentDateSelect, "YYYY-MM-DD").isValid() &&
      yearValue &&
      monthValue &&
      dayValue &&
      currentDateSelect !== value
    ) {
      onChange(currentDateSelect);
    }
    // update only on internal field updates, ignore external value changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearValue, monthValue, dayValue]);

  // additional validation on EVERY field after all individual validations are passed
  const isValidDate = () => {
    if (!dayValue || !monthValue || !yearValue) {
      return true;
    }

    const date = moment(`${yearValue}-${monthValue}-${dayValue}`, "YYYY-MM-DD");

    if (!date.isValid()) {
      return false;
    }

    // time based validation
    const now = new Date();
    switch (restriction) {
      case "past":
        return date.isBefore()
          ? true
          : "Bitte geben Sie ein Datum in der Vergangenheit an.";
      case "todayAndFuture":
        return date.isSame(now, "d") || date.isAfter(now)
          ? true
          : "Bitte geben Sie ein noch nicht vergangenes Datum an.";
      default:
        return true;
    }
  };

  return (
    <>
      <div ref={dateJumpRef} className={`form-label ${labelClassNames}`}>
        {label}
      </div>
      <div className="flex flex-col">
        <div className="flex flex-row">
          <div
            className="w-16 flex-shrink-0 mr-2 md:mr-1"
            style={{ maxWidth: "5rem" }}
          >
            <Input
              inputClasses={inputClasses}
              type="text"
              value={dayValue || ""}
              name="birthday-day"
              labelClassNames={inputLabelClassName}
              placeholder="TT"
              maxLength="2"
              min={1}
              max={31}
              onChange={(e) => {
                // check if input is numeric
                const input = e.target.value;
                if (input && !isStringInteger(input)) {
                  return;
                }
                if (input.length <= 2) {
                  setDayValue(input);
                }
                if (input.length === 3) {
                  setMonthValue(input.slice(-1));
                  monthComponent.current.focus();
                }
              }}
              autoComplete="bday-day"
              label="Tag"
              relatedFields={["birthday-month", "birthday-year"]}
              validateWith={determineOtherValidatedFields("birthday-day")}
              onValidate={(v) => {
                if (
                  typeof v !== "string" ||
                  isEmpty(v) ||
                  !(Number(v) <= 31) ||
                  !(Number(v) >= 1)
                ) {
                  return "Bitte geben Sie einen gültigen Tag an.";
                }
                return isValidDate();
              }}
              showValidationError={false}
              isOptional={isOptional}
              {...props}
            />
          </div>
          <div
            className="w-16 flex-shrink-0 mr-2 md:mr-1"
            style={{ maxWidth: "5rem" }}
          >
            <Input
              inputClasses={`${inputClasses}`}
              type="text"
              value={monthValue || ""}
              name="birthday-month"
              placeholder="MM"
              labelClassNames={inputLabelClassName}
              onChange={(e) => {
                // check if input is numeric
                const input = e.target.value;
                if (input && !isStringInteger(input)) {
                  return;
                }
                if (input.length <= 2) {
                  setMonthValue(input);
                }
                if (input.length === 3) {
                  setYearValue(input.slice(-1));
                  yearComponent.current.focus();
                }
              }}
              inputRef={monthComponent}
              autoComplete="bday-month"
              relatedFields={["birthday-day", "birthday-year"]}
              validateWith={determineOtherValidatedFields("birthday-month")}
              label="Monat"
              max={12}
              min={1}
              onValidate={(v) => {
                if (
                  typeof v !== "string" ||
                  isEmpty(v) ||
                  !(Number(v) <= 12) ||
                  !(Number(v) >= 1)
                ) {
                  return "Bitte geben Sie einen gültigen Monat an.";
                }
                return isValidDate();
              }}
              showValidationError={false}
              isOptional={isOptional}
              {...props}
            />
          </div>
          <div className="flex-grow">
            <Input
              inputClasses={`${inputClasses}`}
              type="text"
              value={yearValue || ""}
              name="birthday-year"
              labelClassNames={inputLabelClassName}
              relatedFields={["birthday-month", "birthday-day"]}
              validateWith={determineOtherValidatedFields("birthday-year")}
              placeholder="YYYY"
              onChange={(e) => {
                const input = e.target.value;
                if (input.length > 4) {
                  return;
                }
                // check if input is numeric
                if (input && !isStringInteger(input)) {
                  return;
                }
                setYearValue(input);
              }}
              inputRef={yearComponent}
              autoComplete="bday-year"
              label="Jahr"
              min={restriction === "todayAndFuture" ? currentYear : 1901}
              max={restriction === "past" ? currentYear : 9999}
              onValidate={(v) => {
                if (
                  typeof v !== "string" ||
                  isEmpty(v) ||
                  !(Number(v) > 1900)
                ) {
                  return "Bitte geben Sie ein gültiges Jahr an.";
                }
                return isValidDate();
              }}
              showValidationError={false}
              isOptional={isOptional}
              {...props}
            />
          </div>
        </div>
        <ValidationError
          fieldName={["birthday-day", "birthday-month", "birthday-year"]}
        />
      </div>
    </>
  );
};

DateInput.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.instanceOf(moment),
    PropTypes.string,
  ]),
  placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  onChange: PropTypes.func,
  label: PropTypes.string,
  labelClassNames: PropTypes.string,
  inputLabelClassName: PropTypes.string,
  isOptional: PropTypes.bool,
  restriction: PropTypes.oneOf(["past", "todayAndFuture", null]),
  inputClasses: PropTypes.string,
};

DateInput.defaultProps = {
  value: Date.now(),
  placeholder: "",
  label: "Datum",
  onChange: () => {},
  labelClassNames: "",
  inputLabelClassName: "",
  isOptional: false,
  restriction: null,
  inputClasses: "",
};

export default DateInput;
