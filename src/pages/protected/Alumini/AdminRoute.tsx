
import { Navigate } from "react-router";

import type { ReactNode } from "react";

const AdminRoute = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminRoute;
