import React, { FC } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

export const ProtectedRoute: FC<any> = ({ children }) => {
  const user = useAuth((state) => state.user);
  if (!user) return <Navigate to="/" />;
  return children;
};
