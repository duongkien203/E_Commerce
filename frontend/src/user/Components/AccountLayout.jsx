import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { ExpandLess, ExpandMore } from "@mui/icons-material"; // Import icon từ MUI
import styles from "../CSS/AccountLayout.module.css";

const AccountLayout = () => {
  const location = useLocation(); // Lấy đường dẫn hiện tại
  const [showSubList, setShowSubList] = useState(false);

  // Kiểm tra nếu đường dẫn hiện tại là một trong các mục con của "Tài khoản"
  useEffect(() => {
    const accountPaths = [
      "/user/account/profile",
      "/user/account/address",
      "/verify",
    ];

    if (accountPaths.includes(location.pathname)) {
      setShowSubList(true); // Giữ submenu mở nếu đang ở mục con
    } else {
      setShowSubList(false); // Đóng submenu nếu chuyển sang tab khác
    }
  }, [location.pathname]);

  const toggleSubList = () => {
    setShowSubList((prev) => !prev);
  };

  // Hàm kiểm tra xem tab có active không
  const isActive = (path) => location.pathname === path;

  return (
    <div className={styles.accountContainer}>
      <div className={styles.sidebar}>
        <h2>Tài khoản</h2>
        <ul>
          <li
            className={
              isActive("/user/account/notifications") ? styles.active : ""
            }
          >
            <Link to="/user/account/notifications">
              <img src="/images/frontend_icons/bell.png" size="24" alt="bell" />
              <span className={styles.expandableText}>Thông báo</span>
            </Link>
          </li>
          <li
            className={`${styles.expandableItem} ${
              showSubList ? styles.open : ""
            }`}
          >
            <div className={styles.expandableHeader} onClick={toggleSubList}>
              <img src="/images/frontend_icons/user.png" size="24" alt="user" />
              <span className={styles.expandableText}>Tài khoản</span>
              {showSubList ? (
                <ExpandLess className={styles.arrowIcon} />
              ) : (
                <ExpandMore className={styles.arrowIcon} />
              )}
            </div>
            <ul
              className={`${styles.subList} ${showSubList ? styles.show : ""}`}
            >
              <li
                className={
                  isActive("/user/account/profile") ? styles.active : ""
                }
              >
                <Link to="/user/account/profile">Hồ sơ</Link>
              </li>
              <li
                className={
                  isActive("/user/account/address") ? styles.active : ""
                }
              >
                <Link to="/user/account/address">Địa chỉ của tôi</Link>
              </li>
              <li className={isActive("/verify") ? styles.active : ""}>
                <Link to="/verify">Đổi mật khẩu</Link>
              </li>
            </ul>
          </li>
          <li className={isActive("/user/account/orders") ? styles.active : ""}>
            <Link to="/user/account/orders">
              <img
                src="/images/frontend_icons/invoice.png"
                size="24"
                alt="invoice"
              />
              <span className={styles.expandableText}>Đơn mua</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default AccountLayout;
