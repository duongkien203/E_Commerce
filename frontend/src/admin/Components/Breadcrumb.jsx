import React from "react";
import { useLocation, Link } from "react-router-dom";
import styles from "../CSS/Breadcrumb.module.css";
import HomeIcon from "@mui/icons-material/Home"; // Import icon Trang chủ từ Material UI

const Breadcrumb = () => {
  const location = useLocation();

  const breadcrumbMapping = {
    products: "Sản phẩm",
    "product-details": "Chi tiết sản phẩm",
    categories: "Danh mục",
    subcategories: "Danh mục con",
    invoices: "Hóa đơn",
    accounts: "Người dùng",
    roles: "Phân quyền",
    contacts: "Liên hệ",
    notifications: "Thông báo",
    discounts: "Giảm giá",
    search: "Tìm kiếm",
  };

  const getBreadcrumbs = () => {
    const paths = location.pathname.split("/").filter((path) => path);
    const breadcrumbs = [];

    // Thêm Trang chủ với icon
    breadcrumbs.push(
      <span key="home" className={styles.breadcrumbItem}>
        <Link to="/admin" className={styles.breadcrumbLink}>
          <HomeIcon className={styles.breadcrumbHomeIcon} />
          Trang chủ
        </Link>
      </span>
    );

    if (paths.includes("search")) {
      // Nếu đường dẫn có "search", hiển thị Trang chủ / Tìm kiếm
      breadcrumbs.push(
        <span key="search" className={styles.breadcrumbItem}>
          <Link to="#" className={styles.breadcrumbLink}>
            Tìm kiếm
          </Link>
        </span>
      );
    } else {
      // Xử lý các đường dẫn khác
      const relevantPaths = paths.slice(1); // Bỏ "admin"
      relevantPaths.forEach((path, index) => {
        const fullPath =
          "/admin/" + relevantPaths.slice(0, index + 1).join("/");
        const displayName =
          breadcrumbMapping[path] ||
          path.charAt(0).toUpperCase() + path.slice(1);

        breadcrumbs.push(
          <span key={index} className={styles.breadcrumbItem}>
            <Link to={fullPath} className={styles.breadcrumbLink}>
              {displayName}
            </Link>
          </span>
        );
      });
    }

    return breadcrumbs;
  };

  return <div className={styles.breadcrumbContainer}>{getBreadcrumbs()}</div>;
};

export default Breadcrumb;
