import React from "react";
import PropTypes from "prop-types";

export const CheckIconDefault = (checkMarkColor) => (
  <svg viewBox="0 0 15 11">
    <g id="Symbols" stroke="none" strokeWidth="3" fill="none">
      <g
        id="input-group/check-radio/misc/check"
        transform="translate(-3.000000, -4.000000)"
        stroke={checkMarkColor}
        strokeWidth="3"
      >
        <polyline id="Path" points="4 9 8 13 16 5" />
      </g>
    </g>
  </svg>
);

const Checkbox = ({
  label,
  className,
  labelClassName,
  checked,
  onChange,
  hiddenCheckBox,
  resetDefaultLabelClassName,
  disabled,
  sizeXl,
  borderColorClass,
  checkMarkColor,
  textColorClass,
}) => {
  const hasLabel = !!(label && label.length) || React.isValidElement(label);

  return (
    <div className={className}>
      {!hiddenCheckBox ? (
        <button
          type="button"
          className={` ${
            sizeXl ? "w-5 h-5" : "w-4 h-4"
          } rounded border-2 ${borderColorClass} focus:outline-none p-px flex-shrink-0`}
          onClick={() => onChange(!checked)}
          disabled={disabled}
        >
          {checked ? CheckIconDefault(checkMarkColor) : null}
        </button>
      ) : null}

      {hasLabel ? (
        <button
          onClick={() => onChange(!checked)}
          type="button"
          disabled={disabled}
          tabIndex="0"
          className={`${
            !resetDefaultLabelClassName
              ? `ml-2 cursor-pointer leading-tight ${textColorClass} ${
                  checked ? "font-bold" : "font-semibold"
                }`
              : ""
          }  ${labelClassName}`}
        >
          {label}
        </button>
      ) : null}
    </div>
  );
};

Checkbox.propTypes = {
  onChange: PropTypes.func,
  label: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
    PropTypes.string,
    PropTypes.node,
  ]),
  className: PropTypes.string,
  labelClassName: PropTypes.string,
  resetDefaultLabelClassName: PropTypes.bool,

  checked: PropTypes.bool,
  hiddenCheckBox: PropTypes.bool,
  disabled: PropTypes.bool,
  sizeXl: PropTypes.bool,
  borderColorClass: PropTypes.string,
  checkMarkColor: PropTypes.string,
  textColorClass: PropTypes.string,
};

Checkbox.defaultProps = {
  onChange: () => {},
  label: "",
  className: "",
  labelClassName: "",
  resetDefaultLabelClassName: false,
  checked: false,
  hiddenCheckBox: false,
  disabled: false,
  sizeXl: false,
  borderColorClass: "border-blue-500",
  checkMarkColor: "#016AFF",
  textColorClass: " text-blue-500",
};

export default Checkbox;
