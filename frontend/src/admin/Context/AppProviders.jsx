import React from "react";
import { AdminAuthProvider } from "./AuthContext";

const AdminAppProviders = ({ children }) => {
  return <AdminAuthProvider>{children}</AdminAuthProvider>;
};

export default AdminAppProviders;
