import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./Components/Layout";
import LayoutLoginAndRegister from "./Components/LayoutLoginAndRegister";
import Home from "./Pages/Home";
import ProductList from "./Pages/Products";
import ProductDetail from "./Pages/ProductDetail";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import ChangePassword from "./Pages/ChangePassword";
import Verify from "./Pages/Verify";
import EmailLink from "./Pages/EmailLink";
import PhoneLink from "./Pages/PhoneLink";
import VerifyOTP from "./Pages/VerifyOTP";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import OrderResult from "./Pages/OrderResult";

import AccountLayout from "./Components/AccountLayout";
import Notifications from "./Pages/Notitfications";
import Profile from "./Pages/Profile";
import Address from "./Pages/Address";
import Orders from "./Pages/Orders";

const userRoutes = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  {
    path: "/:category",
    element: (
      <Layout>
        <ProductList />
      </Layout>
    ),
  },
  {
    path: "/products/search/:searchKey",
    element: (
      <Layout>
        <ProductList />
      </Layout>
    ),
  },
  {
    path: "/products/:productId",
    element: (
      <Layout>
        <ProductDetail />
      </Layout>
    ),
  },
  {
    path: "/about",
    element: (
      <Layout>
        <About />
      </Layout>
    ),
  },
  {
    path: "/contact",
    element: (
      <Layout>
        <Contact />
      </Layout>
    ),
  },
  {
    path: "/login",
    element: (
      <LayoutLoginAndRegister>
        <Login />
      </LayoutLoginAndRegister>
    ),
  },
  {
    path: "/register",
    element: (
      <LayoutLoginAndRegister>
        <Register />
      </LayoutLoginAndRegister>
    ),
  },
  {
    path: "/user/account",
    element: (
      <Layout>
        <AccountLayout />
      </Layout>
    ),
    children: [
      {
        index: true,
        element: <Profile />,
      },
      {
        path: "notifications",
        element: <Notifications />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "address",
        element: <Address />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
    ],
  },
  {
    path: "/forgot-password",
    element: (
      <Layout>
        <ForgotPassword />
      </Layout>
    ),
  },
  {
    path: "/reset-password/:token",
    element: (
      <Layout>
        <ResetPassword />
      </Layout>
    ),
  },
  {
    path: "/change-password/:otp",
    element: (
      <Layout>
        <ChangePassword />
      </Layout>
    ),
  },
  {
    path: "/verify",
    element: (
      <Layout>
        <Verify />
      </Layout>
    ),
  },
  {
    path: "verify/email-link",
    element: (
      <Layout>
        <EmailLink />
      </Layout>
    ),
  },
  {
    path: "verify/phone-link",
    element: (
      <Layout>
        <PhoneLink />
      </Layout>
    ),
  },
  {
    path: "verify/verify-otp",
    element: (
      <Layout>
        <VerifyOTP />
      </Layout>
    ),
  },
  {
    path: "/cart",
    element: (
      <Layout>
        <Cart />
      </Layout>
    ),
  },
  {
    path: "/cart/checkout",
    element: (
      <Layout>
        <Checkout />
      </Layout>
    ),
  },
  {
    path: "/order-result",
    element: (
      <Layout>
        <OrderResult />
      </Layout>
    ),
  },
]);

export default userRoutes;
