import React, { useState, useEffect } from "react";
import styles from "../CSS/SubCategoriesFormPopup.module.css";
const SubCategoriesFormPopup = ({
  isOpen,
  onClose,
  subCategoryData,
  onSubmit,
  categories,
}) => {
  const [parentCategory, setParentCategory] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  useEffect(() => {
    if (subCategoryData) {
      setParentCategory(subCategoryData.category_id);
      setSubCategoryName(subCategoryData.subcategory_name);
    } else {
      setParentCategory("");
      setSubCategoryName("");
    }
  }, [subCategoryData]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!parentCategory) {
      alert("Vui lòng chọn danh mục cha.");
      return;
    }
    onSubmit({
      subcategory_id: subCategoryData?.subcategory_id,
      category_id: parentCategory,
      subcategory_name: subCategoryName,
    });
    onClose();
  };
  if (!isOpen) return null;
  return (
    <div className={styles.overlay}>
      {" "}
      <div className={styles.popup}>
        {" "}
        <h2>
          {subCategoryData ? "Sửa Danh Mục Con" : "Thêm Danh Mục Con"}
        </h2>{" "}
        <form onSubmit={handleSubmit}>
          {" "}
          <label>Danh mục cha:</label>{" "}
          <select
            value={parentCategory}
            onChange={(e) => setParentCategory(e.target.value)}
            required
          >
            {" "}
            <option value="">-- Chọn danh mục cha --</option>{" "}
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {" "}
                {category.category_name}{" "}
              </option>
            ))}{" "}
          </select>{" "}
          <label>Tên danh mục con:</label>{" "}
          <input
            type="text"
            value={subCategoryName}
            onChange={(e) => setSubCategoryName(e.target.value)}
            required
          />{" "}
          <div className={styles.btnGroup}>
            {" "}
            <button type="submit">Lưu</button>{" "}
            <button type="button" onClick={onClose}>
              {" "}
              Hủy{" "}
            </button>{" "}
          </div>{" "}
        </form>{" "}
      </div>{" "}
    </div>
  );
};
export default SubCategoriesFormPopup;
