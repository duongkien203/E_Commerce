import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Dashboard,
  ShoppingCart,
  People,
  Close,
  Category,
  Receipt,
  Mail,
  Notifications,
  Discount,
  Group,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import styles from "../CSS/Sidebar.module.css";

function Sidebar({ isOpen, closeSidebar }) {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    // Khi đường dẫn thay đổi, kiểm tra nếu nó thuộc submenu nào để mở menu cha
    if (
      location.pathname.startsWith("/admin/categories") ||
      location.pathname.startsWith("/admin/subcategories")
    ) {
      setOpenMenu("category");
    } else if (
      location.pathname.startsWith("/admin/products") ||
      location.pathname.startsWith("/admin/product-details") ||
      location.pathname.startsWith("/admin/product-images")
    ) {
      setOpenMenu("product");
    } else {
      setOpenMenu(null); // Đóng tất cả nếu không thuộc danh mục nào
    }
    setActiveTab(location.pathname);
  }, [location.pathname]);

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.show : ""}`}>
      <button className={styles.closeButton} onClick={closeSidebar}>
        <Close className={styles.closeIcon} />
      </button>
      <h2>Admin Panel</h2>

      <ul className={styles.menuList}>
        <li
          className={`${styles.menuItem} ${
            activeTab === "/admin" ? styles.active : ""
          }`}
        >
          <Link to="/admin">
            <Dashboard className={styles.icon} /> Dashboard
          </Link>
        </li>

        <li
          className={`${styles.menuItem} ${
            activeTab === "/admin/roles" ? styles.active : ""
          }`}
        >
          <Link to="/admin/roles">
            <Group className={styles.icon} /> Phân quyền
          </Link>
        </li>

        <li
          className={`${styles.menuItem} ${
            activeTab === "/admin/accounts" ? styles.active : ""
          }`}
        >
          <Link to="/admin/accounts">
            <People className={styles.icon} /> Người dùng
          </Link>
        </li>

        {/* Danh mục */}
        <li
          className={styles.menuItem}
          onClick={() =>
            setOpenMenu(openMenu === "category" ? null : "category")
          }
        >
          <div className={styles.menuLink}>
            <Category className={styles.icon} /> Danh mục
            {openMenu === "category" ? (
              <ExpandLess className={styles.arrowIcon} />
            ) : (
              <ExpandMore className={styles.arrowIcon} />
            )}
          </div>
          <ul
            className={`${styles.subMenu} ${
              openMenu === "category" ? styles.open : ""
            }`}
          >
            <li
              className={`${styles.subMenuItem} ${
                activeTab === "/admin/categories" ? styles.active : ""
              }`}
            >
              <Link to="/admin/categories">Danh mục lớn</Link>
            </li>
            <li
              className={`${styles.subMenuItem} ${
                activeTab === "/admin/subcategories" ? styles.active : ""
              }`}
            >
              <Link to="/admin/subcategories">Danh mục nhỏ</Link>
            </li>
          </ul>
        </li>

        {/* Sản phẩm */}
        <li
          className={styles.menuItem}
          onClick={() => setOpenMenu(openMenu === "product" ? null : "product")}
        >
          <div className={styles.menuLink}>
            <ShoppingCart className={styles.icon} /> Sản phẩm
            {openMenu === "product" ? (
              <ExpandLess className={styles.arrowIcon} />
            ) : (
              <ExpandMore className={styles.arrowIcon} />
            )}
          </div>
          <ul
            className={`${styles.subMenu} ${
              openMenu === "product" ? styles.open : ""
            }`}
          >
            <li
              className={`${styles.subMenuItem} ${
                activeTab === "/admin/products" ? styles.active : ""
              }`}
            >
              <Link to="/admin/products">Sản phẩm</Link>
            </li>
            <li
              className={`${styles.subMenuItem} ${
                activeTab === "/admin/product-details" ? styles.active : ""
              }`}
            >
              <Link to="/admin/product-details">Chi tiết sản phẩm</Link>
            </li>
            <li
              className={`${styles.subMenuItem} ${
                activeTab === "/admin/product-images" ? styles.active : ""
              }`}
            >
              <Link to="/admin/product-images">Ảnh sản phẩm</Link>
            </li>
          </ul>
        </li>

        <li
          className={`${styles.menuItem} ${
            activeTab === "/admin/invoices" ? styles.active : ""
          }`}
        >
          <Link to="/admin/invoices">
            <Receipt className={styles.icon} /> Hóa đơn
          </Link>
        </li>

        <li
          className={`${styles.menuItem} ${
            activeTab === "/admin/contacts" ? styles.active : ""
          }`}
        >
          <Link to="/admin/contacts">
            <Mail className={styles.icon} /> Liên hệ
          </Link>
        </li>

        <li
          className={`${styles.menuItem} ${
            activeTab === "/admin/notifications" ? styles.active : ""
          }`}
        >
          <Link to="/admin/notifications">
            <Notifications className={styles.icon} /> Thông báo
          </Link>
        </li>

        <li
          className={`${styles.menuItem} ${
            activeTab === "/admin/discounts" ? styles.active : ""
          }`}
        >
          <Link to="/admin/discounts">
            <Discount className={styles.icon} /> Giảm giá
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
