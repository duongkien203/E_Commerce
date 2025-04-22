import React, { useState, useEffect } from "react";
import styles from "../CSS/ProductFormPopup.module.css";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";

const ProductFormPopup = ({ isOpen, onClose, productData, onSubmit }) => {
  const { fullName } = useAuth();
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [sale, setSale] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [description, setDescription] = useState("");

  const [categories, setCategories] = useState([]); // Danh mục cha
  const [subCategories, setSubCategories] = useState([]); // Danh mục con

  // Lấy danh mục cha từ API
  useEffect(() => {
    axios
      .get("http://localhost/E_Commerce/backend/admin/api/GetCategories.php")
      .then((response) => {
        if (response.data.status === "success") {
          setCategories(response.data.data); // Lưu danh mục cha
        }
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  // Cập nhật các giá trị khi chỉnh sửa sản phẩm
  useEffect(() => {
    if (productData) {
      setProductName(productData.product_name || "");
      setPrice(productData.price || "");
      setSale(productData.sale || "");
      setCategory(productData.category_id || "");
      setSubCategory(productData.subcategory_id || "");
      setDescription(productData.description || "");

      // Lấy danh mục con dựa trên danh mục cha
      if (productData.category_id) {
        fetchSubCategories(productData.category_id);
      }
    } else {
      setProductName("");
      setPrice("");
      setSale("");
      setCategory("");
      setSubCategory("");
      setDescription("");
      setSubCategories([]); // Reset danh mục con
    }
  }, [productData]);

  // Lấy danh mục con khi danh mục cha thay đổi
  const fetchSubCategories = (categoryId) => {
    axios
      .get(
        `http://localhost/E_Commerce/backend/admin/api/GetSubCategories.php?category_id=${categoryId}`
      )
      .then((response) => {
        if (response.data.status === "success") {
          setSubCategories(response.data.data); // Lưu danh mục con
        }
      })
      .catch((error) => console.error("Error fetching subcategories:", error));
  };

  // Xử lý thay đổi danh mục cha
  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setCategory(selectedCategoryId); // Cập nhật danh mục cha
    setSubCategory(""); // Reset danh mục con
    fetchSubCategories(selectedCategoryId); // Lấy danh mục con tương ứng
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      product_id: productData?.product_id,
      product_name: productName,
      price,
      sale,
      category_id: category,
      subcategory_id: subCategory,
      description,
      action_by: fullName,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h2>{productData ? "Sửa Sản Phẩm" : "Thêm Sản Phẩm"}</h2>
        <form onSubmit={handleSubmit}>
          <label>Tên sản phẩm:</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />

          <label>Giá gốc (VND):</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <label>Sale (%):</label>
          <input
            type="number"
            value={sale}
            onChange={(e) => setSale(e.target.value)}
          />

          <label>Danh mục cha:</label>
          <select value={category} onChange={handleCategoryChange} required>
            <option value="">Chọn danh mục cha</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.category_name}
              </option>
            ))}
          </select>

          <label>Danh mục con:</label>
          <select
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            required
            disabled={!category} // Vô hiệu hóa nếu chưa chọn danh mục cha
          >
            <option value="">Chọn danh mục con</option>
            {subCategories.map((sub) => (
              <option key={sub.subcategory_id} value={sub.subcategory_id}>
                {sub.subcategory_name}
              </option>
            ))}
          </select>

          <label>Mô tả:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

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

export default ProductFormPopup;
