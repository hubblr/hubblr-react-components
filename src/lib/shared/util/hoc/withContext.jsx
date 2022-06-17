import React from "react";

const withContext = (Context, propName) => (WrappedComponent) => (props) =>
  (
    <Context.Consumer>
      {(contextValue) => (
        <WrappedComponent {...props} {...{ [propName]: contextValue }} />
      )}
    </Context.Consumer>
  );

export default withContext;
