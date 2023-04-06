import React from "react";

const userContext = React.createContext({
    undefined,
  setCurrentUser: () => {},
});

export { userContext };
