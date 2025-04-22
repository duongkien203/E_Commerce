import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../CSS/ProductImages.module.css";
import ImagesPopup from "../Components/ImagesPopup";
import ImagesFormPopup from "../Components/ImagesFormPopup";
import { showToast } from "../Components/ToastProvider"; // Import Toast

const ProductImages = () => {
  const [productId, setProductId] = useState("");
  const [prevProductId, setPrevProductId] = useState("");
  const [products, setProducts] = useState([]);
  const [images, setImages] = useState([]);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);

  // Fetch list of products
  useEffect(() => {
    axios
      .get(
        "http://localhost/E_Commerce/backend/admin/api/GetIdAndNameProducts.php"
      )
      .then((response) => {
        if (response.data.status === "success") {
          setProducts(response.data.data);
        }
      })
      .catch(() => showToast("error", "Không thể lấy danh sách sản phẩm."));
  }, []);

  // Fetch images of a product
  const fetchProductImages = (forceUpdate = false) => {
    if (!productId || (!forceUpdate && productId === prevProductId)) return;

    setImages([]);
    setPrevProductId(productId);

    axios
      .get(
        `http://localhost/E_Commerce/backend/admin/api/GetImages.php?product_id=${productId}`
      )
      .then((response) => {
        if (response.data.status === "success") {
          // Sort images to bring the default image to the top
          const sortedImages = response.data.data.sort(
            (a, b) => b.is_default - a.is_default
          );
          setImages(sortedImages.length > 0 ? sortedImages : []);
          if (sortedImages.length === 0) {
            showToast("warning", "Sản phẩm này chưa có ảnh.");
          }
        } else {
          setImages([]);
          showToast("warning", "Sản phẩm này chưa có ảnh.");
        }
      })
      .catch(() => showToast("error", "Lỗi khi gọi API lấy ảnh."));
  };

  // Handle add image
  const handleAddImage = async ({ productId, imageFile, imageUrl }) => {
    const formData = new FormData();
    formData.append("product_id", productId);

    if (imageFile) {
      formData.append("image_file", imageFile);
    } else if (imageUrl) {
      formData.append("image_link", imageUrl);
    }

    try {
      const response = await axios.post(
        "http://localhost/E_Commerce/backend/admin/api/AddImages.php",
        formData
      );

      if (response.data.status === "success") {
        showToast("success", response.data.message);
        fetchProductImages(true); // Bắt buộc làm mới danh sách ảnh
      } else {
        showToast("error", response.data.message);
      }
    } catch (error) {
      showToast("error", "Lỗi khi thêm ảnh.");
    }
  };

  return (
    <div className={styles.containerProductImages}>
      <h2 className={styles.titleProductImages}>Quản Lý Ảnh Sản Phẩm</h2>
      <div className={styles.inputGroupProductImages}>
        <label>Mã Sản Phẩm:</label>
        <input
          type="text"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchProductImages()}
          placeholder="Nhập ID sản phẩm..."
        />
      </div>
      <div className={styles.inputGroupProductImages}>
        <label>Tên Sản Phẩm:</label>
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        >
          <option value="">Chọn sản phẩm</option>
          {products.map((product) => (
            <option key={product.product_id} value={product.product_id}>
              {product.product_name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.buttonContainerProductImages}>
        <button onClick={fetchProductImages}>Xem Ảnh</button>
        <div>
          <button
            onClick={() => {
              if (images.length === 0) {
                showToast("warning", "Không có ảnh để chỉnh sửa.");
              } else {
                setIsEditPopupOpen(true);
              }
            }}
          >
            Chỉnh Sửa Ảnh
          </button>
          <button onClick={() => setIsAddPopupOpen(true)}>Thêm Ảnh</button>
        </div>
      </div>
      <div className={styles.imageListProductImages}>
        {images.length > 0 ? (
          images.map((image) => (
            <div key={image.image_id} className={styles.imageCardProductImages}>
              <p>{image.is_default ? "Ảnh mặc định" : "Ảnh phụ"}</p>
              <img
                src={image.image}
                alt={`Ảnh ${image.image_id}`}
                className={styles.productImage}
              />
            </div>
          ))
        ) : (
          <p>Không có ảnh để hiển thị.</p>
        )}
      </div>
      {isAddPopupOpen && (
        <ImagesFormPopup
          onClose={() => setIsAddPopupOpen(false)}
          productId={productId}
          products={products}
          onSubmit={handleAddImage}
        />
      )}

      {isEditPopupOpen && (
        <ImagesPopup
          isOpen={isEditPopupOpen}
          onClose={() => setIsEditPopupOpen(false)}
          productImages={images}
          fetchProductImages={fetchProductImages} // Truyền vào popup
        />
      )}
    </div>
  );
};

export default ProductImages;
