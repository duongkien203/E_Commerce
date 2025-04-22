import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "./Components/AdminLayout";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import ForgotPassword from "./Pages/ForgotPassword";
import Profile from "./Pages/Profile";
import Verify from "./Pages/Verify";
import EmailLink from "./Pages/EmailLink";
import PhoneLink from "./Pages/PhoneLink";
import VerifyOTP from "./Pages/VerifyOTP";
import ChangePassword from "./Pages/ChangePassword";
import ResetPassword from "./Pages/ResetPassword";
import Roles from "./Pages/Roles";
import Accounts from "./Pages/Accounts";
import Categories from "./Pages/Categories";
import SubCategories from "./Pages/SubCategories";
import Products from "./Pages/Products";
import ProductDetails from "./Pages/ProductDetails";
import ProductImages from "./Pages/ProductImages";
import Invoices from "./Pages/Invoices";
import Contacts from "./Pages/Contacts";
import Notifications from "./Pages/Notifications";
import Discounts from "./Pages/Discount";
import AdminSearch from "./Pages/AdminSearch";

const adminRoutes = createBrowserRouter([
  {
    path: "/admin",
    element: <AdminLayout />, // Không cần truyền children vào đây
    children: [
      {
        index: true, // Khi vào "/admin" sẽ hiển thị Dashboard
        element: <Dashboard />,
      },
      {
        path: "search/:searchKey",
        element: <AdminSearch />,
      },
      {
        path: "account/profile",
        element: <Profile />,
      },
      {
        path: "verify",
        element: <Verify />,
      },
      {
        path: "verify/email-link",
        element: <EmailLink />,
      },
      {
        path: "verify/phone-link",
        element: <PhoneLink />,
      },
      {
        path: "verify/verify-otp",
        element: <VerifyOTP />,
      },
      {
        path: "change-password/:otp",
        element: <ChangePassword />,
      },
      {
        path: "roles",
        element: <Roles />,
      },
      {
        path: "accounts",
        element: <Accounts />,
      },
      {
        path: "categories",
        element: <Categories />,
      },
      {
        path: "subcategories",
        element: <SubCategories />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "product-details",
        element: <ProductDetails />,
      },
      {
        path: "product-images",
        element: <ProductImages />,
      },
      {
        path: "invoices",
        element: <Invoices />,
      },
      {
        path: "contacts",
        element: <Contacts />,
      },
      {
        path: "notifications",
        element: <Notifications />,
      },
      {
        path: "discounts",
        element: <Discounts />,
      },
    ],
  },
  {
    path: "/admin/login",
    element: <Login />,
  },
  {
    path: "/admin/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/admin/reset-password/:token",
    element: <ResetPassword />,
  },
]);

export default adminRoutes;
