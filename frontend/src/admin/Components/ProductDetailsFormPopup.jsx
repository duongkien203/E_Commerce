import React, { useState, useEffect } from "react";
import styles from "../CSS/ProductDetailsFormPopup.module.css";
import axios from "axios";

const ProductDetailsFormPopup = ({ isOpen, onClose, detailData, onSubmit }) => {
  const [productId, setProductId] = useState(""); // Mã sản phẩm
  const [colorId, setColorId] = useState(""); // Mã màu
  const [sizeId, setSizeId] = useState(""); // Mã size
  const [quantity, setQuantity] = useState(""); // Số lượng
  const [products, setProducts] = useState([]); // Danh sách sản phẩm
  const [colors, setColors] = useState([]); // Danh sách màu
  const [sizes, setSizes] = useState([]); // Danh sách size

  // Fetch danh sách sản phẩm (chỉ khi thêm mới)
  useEffect(() => {
    if (!detailData) {
      axios
        .get(
          "http://localhost/E_Commerce/backend/admin/api/GetIdAndNameProducts.php"
        )
        .then((response) => {
          if (response.data.status === "success") {
            setProducts(response.data.data);
          }
        })
        .catch((error) =>
          console.error("Lỗi khi lấy danh sách sản phẩm:", error)
        );
    }
  }, [detailData]);

  // Fetch danh sách màu
  useEffect(() => {
    axios
      .get("http://localhost/E_Commerce/backend/admin/api/GetColors.php")
      .then((response) => {
        if (response.data.status === "success") {
          setColors(response.data.data);
        }
      })
      .catch((error) => console.error("Lỗi khi lấy danh sách màu:", error));
  }, []);

  // Fetch danh sách size
  useEffect(() => {
    axios
      .get("http://localhost/E_Commerce/backend/admin/api/GetSizes.php")
      .then((response) => {
        if (response.data.status === "success") {
          setSizes(response.data.data);
        }
      })
      .catch((error) => console.error("Lỗi khi lấy danh sách size:", error));
  }, []);

  // Khi edit, set giá trị ban đầu
  useEffect(() => {
    if (detailData) {
      setProductId(detailData.product_id || "");
      setColorId(detailData.color_id || "");
      setSizeId(detailData.size_id || "");
      setQuantity(detailData.quantity || "");
    } else {
      setProductId("");
      setColorId("");
      setSizeId("");
      setQuantity("");
    }
  }, [detailData]);

  // Xử lý khi chọn sản phẩm từ dropdown
  const handleSelectProduct = (selectedId) => {
    setProductId(selectedId);
  };

  // Xử lý khi nhập ID sản phẩm
  const handleInputProductId = (enteredId) => {
    setProductId(enteredId);
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      product_detail_id: detailData?.product_detail_id, // Giữ ID nếu là edit
      product_id: productId,
      color_id: colorId,
      size_id: sizeId,
      quantity,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h2>
          {detailData ? "Sửa Chi Tiết Sản Phẩm" : "Thêm Chi Tiết Sản Phẩm"}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Mã sản phẩm */}
          <label>Mã Sản Phẩm:</label>
          {detailData ? (
            // Khi sửa, chỉ hiển thị mã sản phẩm
            <p className={styles.productId}>
              <input
                type="text"
                value={productId}
                readOnly
                className={styles.readOnlyInput}
              />
            </p>
          ) : (
            // Khi thêm mới, nhập hoặc chọn mã sản phẩm
            <input
              type="text"
              value={productId}
              onChange={(e) => handleInputProductId(e.target.value)}
              required
              placeholder="Nhập mã sản phẩm..."
            />
          )}

          {/* Chọn sản phẩm */}
          {!detailData && (
            <>
              <label>Chọn Sản Phẩm:</label>
              <select
                value={productId}
                onChange={(e) => handleSelectProduct(e.target.value)}
                required
              >
                <option value="">Chọn sản phẩm</option>
                {products.map((product) => (
                  <option key={product.product_id} value={product.product_id}>
                    {product.product_name}
                  </option>
                ))}
              </select>
            </>
          )}

          {/* Chọn màu */}
          <label>Chọn Màu:</label>
          <select
            value={colorId}
            onChange={(e) => setColorId(e.target.value)}
            required
          >
            <option value="">Chọn màu</option>
            {colors.map((color) => (
              <option key={color.color_id} value={color.color_id}>
                {color.color_name}
              </option>
            ))}
          </select>

          {/* Chọn size */}
          <label>Chọn Size:</label>
          <select
            value={sizeId}
            onChange={(e) => setSizeId(e.target.value)}
            required
          >
            <option value="">Chọn size</option>
            {sizes.map((size) => (
              <option key={size.size_id} value={size.size_id}>
                {size.size_name}
              </option>
            ))}
          </select>

          {/* Nhập số lượng */}
          <label>Số Lượng:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (!isNaN(value) && value > 0) {
                setQuantity(value);
              }
            }}
            min="1"
            required
          />

          {/* Nút lưu và hủy */}
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

export default ProductDetailsFormPopup;
