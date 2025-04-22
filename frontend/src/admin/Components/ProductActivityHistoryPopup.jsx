import React, { useState, useEffect } from "react";
import styles from "../CSS/ProductActivityHistoryPopup.module.css";
import axios from "axios";

const ProductActivityHistoryPopup = ({ isOpen, onClose, productId }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (isOpen && productId) {
      axios
        .get(
          `http://localhost/E_Commerce/backend/admin/api/GetProductActivityHistory.php?product_id=${productId}`
        )
        .then((response) => {
          if (response.data.status === "success") {
            setHistory(response.data.data);
          }
        })
        .catch((error) => console.error("Error fetching history:", error));
    }
  }, [isOpen, productId]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✖
        </button>
        <h2>Lịch sử sản phẩm</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Loại tác động</th>
              <th>Người tác động</th>
              <th>Ngày tác động</th>
            </tr>
          </thead>

          <tbody>
            {history.length > 0 ? (
              history.map((item) => (
                <tr key={item.activity_history_id}>
                  <td>{item.activity_history_id}</td>
                  <td>
                    {item.action_type === "create" ? "Thêm mới" : "Cập nhật"}
                  </td>
                  <td>{item.action_by || "N/A"}</td>
                  <td>{item.action_date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className={styles.noData}>
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductActivityHistoryPopup;
