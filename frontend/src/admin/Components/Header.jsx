import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import styles from "../CSS/Header.module.css";

function Header() {
  const { accountId, avatar, fullName, logout } = useAuth();
  const [searchKey, setSearchKey] = useState("");
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isSearchExpanded, setSearchExpanded] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKey.trim()) {
      // Chuyển hướng đến trang tìm kiếm admin với từ khóa
      navigate(`/admin/search/${encodeURIComponent(searchKey)}`);
    }
  };

  const handleSearchClick = () => {
    setSearchExpanded(true);
  };

  const handleBlur = () => {
    if (!searchKey.trim()) {
      setSearchExpanded(false);
    }
  };

  return (
    <div className={styles.headerContainer}>
      <div className={styles.header}>
        {/* Logo */}
        <div className={styles.logo}>
          <Link to="/admin">
            <img src="/emkshop.ico" alt="logo" className={styles.logoImage} />
          </Link>
        </div>

        {/* Search */}
        <form
          className={`${styles.searchBar} ${
            isSearchExpanded ? styles.expanded : ""
          }`}
          onSubmit={handleSearch}
        >
          <input
            type="text"
            placeholder="Tìm kiếm trong admin..."
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            className={styles.input}
            onBlur={handleBlur}
          />
          <button
            type="submit" // Đổi thành submit để khớp với form
            className={styles.searchIcon}
            onClick={handleSearchClick}
          >
            <FaSearch />
          </button>
        </form>

        {/* Tài khoản */}
        <div className={styles.headerLinks}>
          {accountId ? (
            <li
              className={styles.accountInfo}
              onMouseEnter={() => setDropdownVisible(true)}
              onMouseLeave={() => setDropdownVisible(false)}
            >
              <Link to="/admin/account/profile" className={styles.profileLink}>
                {avatar ? (
                  <img src={avatar} alt="avatar" className={styles.avatar} />
                ) : (
                  <FaUserCircle className={styles.avatar} />
                )}
                <span>{fullName}</span>
              </Link>
              {isDropdownVisible && (
                <ul className={styles.dropdownMenu}>
                  <li>
                    <Link to="/admin/account/profile">Tài khoản của tôi</Link>
                  </li>
                  <li>
                    <Link to="/admin/verify">Đổi mật khẩu</Link>
                  </li>
                  <li onClick={logout}>Đăng xuất</li>
                </ul>
              )}
            </li>
          ) : (
            <>
              <li>
                <Link to="/admin/login">Đăng nhập</Link>
              </li>
              <li>
                <Link to="/admin/register">Đăng ký</Link>
              </li>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
