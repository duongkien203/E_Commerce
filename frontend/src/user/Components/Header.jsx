import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { useCart } from "../Context/CartContext";
import { useNotification } from "../Context/NotificationContext";
import { FaSearch, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import styles from "../CSS/Header.module.css";

function Header() {
  const { accountId, avatar, fullName, logout } = useAuth();
  const [searchKey, setSearchKey] = useState("");
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isNotificationVisible, setNotificationVisible] = useState(false);
  const [isSearchBoxVisible, setSearchBoxVisible] = useState(false);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [imageError, setImageError] = useState(false);
  const { cartCount, fetchCartCount } = useCart();
  const { notifications, fetchNotifications } = useNotification();
  const [hasFetched, setHasFetched] = useState(false);
  const searchBoxRef = useRef(null);
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (accountId) {
      fetchCartCount(accountId);
    }
  }, [accountId, fetchCartCount]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target) &&
        isSearchBoxVisible
      ) {
        setSearchBoxVisible(false);
      }
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        isSidebarVisible
      ) {
        setSidebarVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchBoxVisible, isSidebarVisible]);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKey.trim()) {
      navigate(`/products/search/${searchKey}`);
      setSearchBoxVisible(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleMenuItemClick = () => {
    setDropdownVisible(false);
  };

  const toggleSearchBox = () => {
    setSearchBoxVisible(!isSearchBoxVisible);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const closeSidebar = () => {
    setSidebarVisible(false);
  };

  const formatTimeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    if (seconds < 60) return `${seconds} giây trước`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
  };

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  if (!accountId && isAuthPage) {
    return (
      <div className={styles.headerContainer}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <Link to="/">
              <img src="/emkshop.ico" alt="logo" className={styles.logoImage} />
            </Link>
          </div>
          <div className={styles.headerTitle}>
            <span>
              {location.pathname === "/login"
                ? "Đăng nhập"
                : location.pathname === "/register"
                ? "Đăng ký"
                : location.pathname === "/forgot-password"
                ? "Quên mật khẩu"
                : null}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.headerContainer}>
      <div className={styles.header}>
        {/* Nút hamburger cho mobile */}
        <button className={styles.hamburgerButton} onClick={toggleSidebar}>
          <FaBars />
        </button>
        <div className={styles.logo}>
          <Link to="/">
            <img src="/emkshop.ico" alt="logo" className={styles.logoImage} />
          </Link>
        </div>

        {/* Thanh tìm kiếm full cho màn hình lớn */}
        <form
          className={`${styles.searchBar} ${styles.desktopSearch}`}
          onSubmit={handleSearch}
        >
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            className={styles.input}
          />
          <button type="submit" className={styles.searchButton}>
            <FaSearch />
          </button>
        </form>

        {/* Icon tìm kiếm cho màn hình nhỏ */}
        <div className={styles.mobileSearch} ref={searchBoxRef}>
          <button onClick={toggleSearchBox} className={styles.searchIconButton}>
            <FaSearch />
          </button>
          {isSearchBoxVisible && (
            <form className={styles.searchBoxDropdown} onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                className={styles.input}
                autoFocus
              />
              <button type="submit" className={styles.searchButton}>
                <FaSearch />
              </button>
            </form>
          )}
        </div>

        {/* Sidebar cho mobile */}
        <div
          className={`${styles.sidebar} ${
            isSidebarVisible ? styles.active : ""
          }`}
          ref={sidebarRef}
        >
          <button className={styles.closeButton} onClick={closeSidebar}>
            <FaTimes />
          </button>
          <ul className={styles.sidebarMenu}>
            <li>
              <Link to="/" onClick={closeSidebar}>
                Trang chủ
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={closeSidebar}>
                Giới thiệu
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={closeSidebar}>
                Liên hệ
              </Link>
            </li>
            <li>
              <Link to="/user/account/notifications" onClick={closeSidebar}>
                Thông báo
              </Link>
            </li>
            <li>
              <Link to="/user/account/orders" onClick={closeSidebar}>
                Đơn hàng
              </Link>
            </li>
            <li>
              <Link to="/user/account/profile" onClick={closeSidebar}>
                Thông tin tài khoản
              </Link>
            </li>
            <li>
              <Link to="/user/account/address" onClick={closeSidebar}>
                Địa chỉ giao hàng
              </Link>
            </li>
            <li>
              <Link to="/verify" onClick={closeSidebar}>
                Đổi mật khẩu
              </Link>
            </li>
            <li onClick={handleLogout}>
              <Link>Đăng xuất</Link>
            </li>
          </ul>
        </div>

        <div className={styles.headerLinks}>
          <li className={styles.desktopLink}>
            <Link to="/">Trang chủ</Link>
          </li>
          <li className={styles.desktopLink}>
            <Link to="/about">Giới thiệu</Link>
          </li>
          <li className={styles.desktopLink}>
            <Link to="/contact">Liên hệ</Link>
          </li>
          <li className={styles.cartIconContainer}>
            <Link to="/cart">
              <img
                src="/images/frontend_icons/cart.png"
                size={24}
                className={styles.cartIcon}
                alt="cart"
              />
              {cartCount > 0 && (
                <span className={styles.cartBadge}>{cartCount}</span>
              )}
            </Link>
          </li>
          <li
            className={`${styles.notificationIcon} ${styles.desktopLink}`}
            onMouseEnter={() => {
              setNotificationVisible(true);
              if (!hasFetched) {
                fetchNotifications();
                setHasFetched(true);
              }
            }}
            onMouseLeave={() => setNotificationVisible(false)}
          >
            <Link
              to="/user/account/notifications"
              className={styles.notificationLink}
            >
              <img src="/images/frontend_icons/bell.png" size={24} alt="bell" />
              {notifications.length > 0 && !hasFetched && (
                <span className={styles.cartBadge}>{notifications.length}</span>
              )}
            </Link>
            {isNotificationVisible && (
              <ul className={styles.notificationPanel}>
                {notifications.length > 0 ? (
                  [...notifications]
                    .sort(
                      (a, b) => new Date(b.created_at) - new Date(a.created_at)
                    )
                    .map((notification, index) => (
                      <li key={index} className={styles.notificationItem}>
                        <div className={styles.notificationTitle}>
                          {notification.title}
                        </div>
                        <div className={styles.notificationMessage}>
                          {notification.message}
                        </div>
                        <div className={styles.notificationTime}>
                          {formatTimeAgo(notification.created_at)}
                        </div>
                      </li>
                    ))
                ) : (
                  <li>Không có thông báo nào</li>
                )}
              </ul>
            )}
          </li>
          {accountId ? (
            <li
              className={styles.accountInfo}
              onMouseEnter={() => setDropdownVisible(true)}
              onMouseLeave={() => setDropdownVisible(false)}
            >
              <Link to="/user/account" className={styles.profileLink}>
                {imageError ? (
                  <FaUserCircle className={styles.avatar} />
                ) : (
                  <img
                    src={avatar}
                    alt="avatar"
                    className={styles.avatar}
                    onError={handleImageError}
                    key={imageError ? "error" : "valid"}
                  />
                )}
                <span>{fullName}</span>
              </Link>
              {isDropdownVisible && (
                <ul className={styles.dropdownMenu}>
                  <li onClick={handleMenuItemClick}>
                    <Link to="/user/account/profile">Tài khoản của tôi</Link>
                  </li>
                  <li onClick={handleMenuItemClick}>
                    <Link to="/verify">Đổi mật khẩu</Link>
                  </li>
                  <li onClick={handleLogout}>Đăng xuất</li>
                </ul>
              )}
            </li>
          ) : (
            <>
              <li>
                <Link to="/login">Đăng nhập</Link>
              </li>
              <li>
                <Link to="/register">Đăng ký</Link>
              </li>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
