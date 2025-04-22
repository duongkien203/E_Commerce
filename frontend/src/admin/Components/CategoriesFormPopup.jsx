import React, { useState, useEffect } from "react";
import styles from "../CSS/CategoriesFormPopup.module.css";

const CategoriesFormPopup = ({ isOpen, onClose, categoryData, onSubmit }) => {
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    if (categoryData) {
      setCategoryName(categoryData.category_name);
    } else {
      setCategoryName("");
    }
  }, [categoryData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      category_id: categoryData?.category_id,
      category_name: categoryName,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h2>{categoryData ? "Sửa Danh Mục" : "Thêm Danh Mục"}</h2>
        <form onSubmit={handleSubmit}>
          <label>Tên danh mục:</label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
          <div className={styles.btnGroup}>
            <button type="submit">Lưu</button>
            <button type="button" onClick={onClose}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoriesFormPopup;
