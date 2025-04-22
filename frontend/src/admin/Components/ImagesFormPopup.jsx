import React, { useState, useEffect } from "react";
import styles from "../CSS/ImagesFormPopup.module.css";
import { showToast } from "./ToastProvider";

const ImagesFormPopup = ({ onClose, productId, products, onSubmit }) => {
  const [selectedProductId, setSelectedProductId] = useState(productId || ""); // ID sản phẩm
  const [selectedProductName, setSelectedProductName] = useState(""); // Tên sản phẩm
  const [imageFile, setImageFile] = useState(null); // File ảnh
  const [imageUrl, setImageUrl] = useState(""); // Link ảnh

  // Cập nhật tên sản phẩm khi ID thay đổi
  useEffect(() => {
    const selectedProduct = products.find(
      (product) => product.product_id.toString() === selectedProductId
    );
    setSelectedProductName(selectedProduct ? selectedProduct.product_name : "");
  }, [selectedProductId, products]);

  // Khi nhập ID sản phẩm, cập nhật ID
  const handleProductIdChange = (id) => {
    setSelectedProductId(id);
  };

  // Khi chọn tên sản phẩm, cập nhật ID
  const handleProductNameChange = (name) => {
    const selectedProduct = products.find(
      (product) => product.product_name === name
    );
    setSelectedProductId(
      selectedProduct ? selectedProduct.product_id.toString() : ""
    );
  };

  // Xử lý khi chọn file ảnh
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
    setImageUrl(""); // Nếu chọn file, reset link URL
  };

  // Xử lý khi nhập link ảnh
  const handleUrlChange = (e) => {
    setImageUrl(e.target.value);
    setImageFile(null); // Nếu nhập link, reset file ảnh
  };

  // Submit dữ liệu
  const handleSubmit = () => {
    if (imageFile || imageUrl) {
      onSubmit({
        productId: selectedProductId,
        imageFile,
        imageUrl,
      });
      onClose();
    } else {
      showToast("error", "Chưa chọn ảnh.");
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h2>Thêm Ảnh</h2>
        <form>
          {/* Nhập ID sản phẩm */}
          <label>Nhập ID sản phẩm:</label>
          <input
            type="text"
            value={selectedProductId}
            onChange={(e) => handleProductIdChange(e.target.value)}
            placeholder="Nhập ID sản phẩm..."
          />

          {/* Chọn tên sản phẩm */}
          <label>Chọn tên sản phẩm:</label>
          <select
            value={selectedProductName}
            onChange={(e) => handleProductNameChange(e.target.value)}
          >
            <option value="">Chọn sản phẩm</option>
            {products.map((product) => (
              <option key={product.product_id} value={product.product_name}>
                {product.product_name}
              </option>
            ))}
          </select>

          {/* Upload file ảnh */}
          <label>Chọn ảnh từ máy tính:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={imageUrl !== ""} // Vô hiệu hóa nếu nhập URL
          />

          {/* Nhập URL ảnh */}
          <label>Hoặc nhập URL ảnh:</label>
          <input
            type="text"
            value={imageUrl}
            onChange={handleUrlChange}
            placeholder="Dán link ảnh..."
            disabled={imageFile !== null} // Vô hiệu hóa nếu chọn file
          />
        </form>

        <div className={styles.btnGroup}>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!imageFile && !imageUrl}
          >
            Thêm
          </button>
          <button type="button" onClick={onClose}>
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImagesFormPopup;
