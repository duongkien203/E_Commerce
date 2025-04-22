import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "../CSS/AdminSearch.module.css"; // Import file CSS

const AdminSearch = () => {
  const { searchKey } = useParams(); // Lấy từ khóa từ URL
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(
          `http://localhost/E_Commerce/backend/admin/api/SearchAdmin.php?searchKey=${encodeURIComponent(
            searchKey
          )}`
        );
        if (response.data.status === "success") {
          setResults(response.data.data || {}); // Tránh lỗi nếu `data` không tồn tại
        } else {
          setResults({});
        }
      } catch (error) {
        console.error("Lỗi khi tìm kiếm:", error);
        setResults({});
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchKey]);

  if (loading) {
    return <div className={styles.loading}>Đang tải...</div>;
  }

  const isEmptyResults = Object.values(results).every(
    (list) => list.length === 0
  );

  return (
    <div className={styles.searchContainer}>
      <h2>
        Kết quả tìm kiếm cho:{" "}
        <span className={styles.searchKey}>"{searchKey}"</span>
      </h2>

      {isEmptyResults ? (
        <p className={styles.noResults}>Không tìm thấy kết quả nào.</p>
      ) : (
        <div className={styles.results}>
          {Object.entries(results).map(([key, items]) =>
            items.length > 0 ? (
              <div key={key} className={styles.section}>
                <h3>{getSectionTitle(key)}</h3>
                <ul>
                  {items.map((item) => (
                    <li
                      key={
                        item.id ||
                        `${key}-${item.name || item.email || Math.random()}`
                      }
                      className={styles.listItem}
                    >
                      {getItemContent(key, item)}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Trả về tiêu đề tương ứng với từng nhóm kết quả.
 */
const getSectionTitle = (key) => {
  const titles = {
    accounts: "Tài khoản",
    roles: "Quyền",
    categories: "Danh mục lớn",
    subcategories: "Danh mục nhỏ",
    products: "Sản phẩm",
    productDetails: "Chi tiết sản phẩm",
    productImages: "Ảnh sản phẩm",
    invoices: "Hóa đơn",
    contacts: "Liên hệ",
    notifications: "Thông báo",
    discounts: "Giảm giá",
  };
  return titles[key] || key;
};

/**
 * Xử lý nội dung hiển thị cho từng loại kết quả.
 */
const getItemContent = (key, item) => {
  switch (key) {
    case "accounts":
      return `${item.username} - ${item.email}`;
    case "roles":
      return item.role_name;
    case "categories":
      return item.category_name;
    case "subcategories":
      return item.subcategory_name;
    case "products":
      return item.product_name;
    case "productDetails":
      return `${item.product_name} - ${item.color_name}`;
    case "productImages":
      return (
        <img
          src={item.image_url}
          alt="Ảnh sản phẩm"
          className={styles.productImage}
        />
      );
    case "invoices":
      return `${item.invoice_code} - ${item.total_amount}`;
    case "contacts":
      return `${item.full_name} - ${item.email}`;
    case "notifications":
      return item.title;
    case "discounts":
      return item.code;
    default:
      return JSON.stringify(item); // Hiển thị toàn bộ dữ liệu nếu chưa định nghĩa
  }
};

export default AdminSearch;
