import React, { useEffect } from "react";
import { store } from "../store";
import { initializeAuth } from "../store/authSlice";

const InitAuth = ({ children }) => {
  useEffect(() => {
    store.dispatch(initializeAuth());
  }, []);
  return children;
};

export default InitAuth;
