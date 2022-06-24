import React from "react";
import PropTypes from "prop-types";
import Checkbox from "./Checkbox";

const HiddenCheckBox = ({
  children,
  checked,
  onChange,
  className,
  labelClassName,
  resetLabelClassName,
  ...Props
}) => {
  return (
    <Checkbox
      hiddenCheckBox
      checked={checked}
      onChange={onChange}
      label={children}
      resetDefaultLabelClassName
      className={className}
      labelClassName={
        resetLabelClassName
          ? labelClassName
          : `border-2 rounded animate w-full cursor-pointer leading-tight ${
              checked
                ? "bg-blue-300 text-white border-brand-blue"
                : "bg-gray-100 text-gray-800 border-gray-300"
            } ${labelClassName}`
      }
      {...Props}
    />
  );
};

HiddenCheckBox.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  labelClassName: PropTypes.string,
  resetLabelClassName: PropTypes.bool,
};

HiddenCheckBox.defaultProps = {
  className: "",
  labelClassName: "",
  resetLabelClassName: false,
};

export default HiddenCheckBox;
