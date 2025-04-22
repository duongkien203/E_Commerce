import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Menu } from "@mui/icons-material";
import { useAuth } from "../Context/AuthContext";
import styles from "../CSS/AdminLayout.module.css";
import ToastProvider from "./ToastProvider";
import Breadcrumb from "./Breadcrumb";

function AdminLayout() {
  const { accountId } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showToggleButton, setShowToggleButton] = useState(false);

  // Kiểm tra nếu không có accountId thì chuyển hướng về trang login
  useEffect(() => {
    if (!accountId) {
      navigate("/admin/login");
    }
  }, [accountId, navigate]);

  // Khi sidebar đóng, trì hoãn hiển thị nút mở
  useEffect(() => {
    if (!isSidebarOpen) {
      const timer = setTimeout(() => {
        setShowToggleButton(true);
      }, 400);
      return () => clearTimeout(timer);
    } else {
      setShowToggleButton(false);
    }
  }, [isSidebarOpen]);

  return (
    <div
      className={`${styles.adminContainer} ${
        !isSidebarOpen ? styles.sidebarClosed : ""
      }`}
    >
      {/* Sidebar */}
      <div
        className={`${styles.sidebarWrapper} ${
          isSidebarOpen ? styles.open : styles.hidden
        }`}
      >
        <Sidebar closeSidebar={() => setIsSidebarOpen(false)} />
      </div>

      {/* Khu vực bên phải (Header + Breadcrumb + Content) */}
      <div className={styles.rightContainer}>
        {/* Header */}
        <div className={styles.header}>
          <Header />
        </div>
        <div className={styles.breadcrumb}>
          <Breadcrumb />
        </div>
        {/* Content */}
        <ToastProvider /> {/* Thêm ToastProvider để hiển thị thông báo */}
        <div className={styles.adminContent}>
          {showToggleButton && (
            <button
              className={styles.toggleButton}
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu fontSize="large" />
            </button>
          )}
          <div className={styles.pageContent}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
