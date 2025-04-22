import React from "react";
import { RouterProvider } from "react-router-dom";
import AppProviders from "./user/Context/AppProviders";
import AdminAppProviders from "./admin/Context/AppProviders";
import userRoutes from "./user/userRoutes";
import adminRoutes from "./admin/adminRoutes";

// Hàm kiểm tra xem URL hiện tại có phải admin không
const isAdminRoute = window.location.pathname.startsWith("/admin");

function App() {
  return isAdminRoute ? (
    <AdminAppProviders>
      <RouterProvider router={adminRoutes} />
    </AdminAppProviders>
  ) : (
    <AppProviders>
      <RouterProvider router={userRoutes} />
    </AppProviders>
  );
}

export default App;
