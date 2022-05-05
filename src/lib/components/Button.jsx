import React from "react";
const Button = ({ children, handleClick }) => {
  return (
    <button className={`btn CTA`} onClick={handleClick}>
      <h4>{children}</h4>
    </button>
  );
};
export default Button;
