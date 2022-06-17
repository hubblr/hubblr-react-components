import React from "react";
import PropTypes from "prop-types";
import useRegisterGroupJumpRef from "../hooks/useRegisterGroupJumpRef";
import useFallbackRef from "../../shared/hooks/useFallbackRef";

const FormLabel = React.forwardRef(
  ({ children, className, groupName }, givenRef) => {
    const ref = useFallbackRef(givenRef);
    useRegisterGroupJumpRef(groupName, ref);

    return (
      <div ref={ref} className={`form-label ${className}`}>
        {children}
      </div>
    );
  }
);

FormLabel.propTypes = {
  children: PropTypes.node.isRequired,
  groupName: PropTypes.string.isRequired,
  className: PropTypes.string,
};

FormLabel.defaultProps = {
  className: "",
};

export default FormLabel;
