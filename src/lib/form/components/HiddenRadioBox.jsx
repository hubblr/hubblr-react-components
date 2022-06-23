import React from "react";
import PropTypes from "prop-types";
import { generateUniqueID } from "../../shared/util/helpers";
// import { RefPropType } from "../../prop-types/reactPropTypes";

const HiddenRadioBox = ({
  children,
  checked,
  onChange,
  onClick,
  className,
  disabled,
  name,
  forwardedRef,
}) => {
  const id = generateUniqueID();
  return (
    <label
      ref={forwardedRef}
      htmlFor={id}
      className={`cursor-pointer ${className}`}
    >
      {children}

      <input
        id={id}
        className="hidden"
        type="radio"
        name={name}
        onChange={onChange}
        onClick={onClick}
        disabled={disabled}
        checked={checked}
      />
    </label>
  );
};

HiddenRadioBox.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  // TODO: re-create a ref prop type
  forwardedRef: PropTypes.any,
};

HiddenRadioBox.defaultProps = {
  className: "",
  disabled: false,
  forwardedRef: () => {},
};

export default React.forwardRef((props, ref) => {
  return <HiddenRadioBox forwardedRef={ref} {...props} />;
});
