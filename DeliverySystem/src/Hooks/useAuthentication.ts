import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AuthContext,
  AuthContextType,
} from "../Components/AuthForm/AuthProvider";
import { INVALID_ACCESS_URL } from "../constants";

export const useAuthentication = (
  authAttempt: boolean
): AuthContextType | null => {
  const navigate = useNavigate();
  const context = useContext(AuthContext);

  useEffect(() => {
    console.log("AuthContext in useAuthentication:", context);
    if (!context?.authToken && !authAttempt) {
      console.log("Access denied, redirecting...");
      navigate(INVALID_ACCESS_URL);
    }
  }, [context, authAttempt, navigate]);

  return context?.authToken || authAttempt ? context : null;
};
