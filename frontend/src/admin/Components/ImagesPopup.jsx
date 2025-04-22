import React, { useEffect, useState } from "react";
import styles from "../CSS/ImagesPopup.module.css";
import { showToast } from "../Components/ToastProvider";
import axios from "axios"; // Import axios
import ConfirmPopup from "../Components/ConfirmPopup"; // Import ConfirmPopup

const ImagesPopup = ({
  isOpen,
  onClose,
  productImages,
  fetchProductImages,
}) => {
  const [images, setImages] = useState([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // Lưu thông tin ảnh cần xóa

  useEffect(() => {
    if (productImages.length > 0) {
      const sortedImages = [...productImages].sort(
        (a, b) => b.is_default - a.is_default
      );
      setImages(sortedImages);
    }
  }, [productImages]);

  const handleSetDefaultImage = async (imageId, productId) => {
    try {
      const response = await axios.put(
        "http://localhost/E_Commerce/backend/admin/api/SetDefaultImage.php",
        {
          image_id: imageId,
          product_id: productId,
        }
      );

      if (response.data.status === "success") {
        showToast("success", "Cập nhật ảnh mặc định thành công");

        // Gọi lại API trong `ProductImages.jsx`
        fetchProductImages(true);
      } else {
        showToast("error", "Lỗi khi cập nhật ảnh mặc định.");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      showToast("error", "Lỗi khi cập nhật ảnh.");
    }
  };

  const handleDeleteImage = async () => {
    if (!selectedImage) return;

    try {
      const response = await axios.post(
        "http://localhost/E_Commerce/backend/admin/api/DeleteImage.php",
        {
          image_id: selectedImage.image_id,
          product_id: selectedImage.product_id,
          image_path: selectedImage.image_path, // Truyền đường dẫn ảnh
        }
      );

      if (response.data.status === "success") {
        showToast("success", "Xóa ảnh thành công");

        // Cập nhật danh sách ảnh sau khi xóa
        const updatedImages = images.filter(
          (img) => img.image_id !== selectedImage.image_id
        );
        setImages(updatedImages);

        setIsConfirmOpen(false); // Đóng ConfirmPopup
        setSelectedImage(null);

        // Gọi lại API trong `ProductImages.jsx`
        fetchProductImages(true);

        // Nếu không còn ảnh nào, đóng luôn popup
        if (updatedImages.length === 0) {
          onClose();
        }
      } else {
        showToast("error", "Lỗi khi xóa ảnh.");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      showToast("error", "Lỗi khi xóa ảnh.");
    }
  };

  const confirmDeleteImage = (image) => {
    setSelectedImage(image); // Lưu thông tin ảnh cần xóa
    setIsConfirmOpen(true); // Hiển thị popup xác nhận
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <h2>Danh sách ảnh sản phẩm</h2>
        <button className={styles.closeBtn} onClick={onClose}>
          ✖
        </button>

        {images.length === 0 ? (
          <p>Không có ảnh nào!</p>
        ) : (
          <ul className={styles.imageList}>
            {images.map((img) => (
              <li
                key={img.image_id}
                className={styles.imageItem}
                onClick={() =>
                  handleSetDefaultImage(img.image_id, img.product_id)
                } // Click cả dòng
              >
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="selectedImage"
                    checked={img.is_default === 1}
                    readOnly // Chỉ đọc để ngăn việc chỉnh sửa trực tiếp
                  />
                  <img
                    src={img.image}
                    alt="Ảnh sản phẩm"
                    className={styles.productImage}
                  />
                </label>
                {img.is_default === 1 && (
                  <span className={styles.defaultBadge}>Mặc định</span>
                )}
                <button
                  className={styles.deleteBtn}
                  onClick={(e) => {
                    e.stopPropagation(); // Ngăn chặn việc click vào cả dòng khi nhấn xóa
                    confirmDeleteImage({
                      image_id: img.image_id,
                      product_id: img.product_id,
                      image_path: img.image, // Truyền cả đường dẫn ảnh
                    });
                  }}
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Hiển thị popup xác nhận */}
      {isConfirmOpen && (
        <ConfirmPopup
          message="Bạn có chắc chắn muốn xóa ảnh này?"
          onConfirm={handleDeleteImage}
          onClose={() => {
            setIsConfirmOpen(false);
            setSelectedImage(null);
          }}
        />
      )}
    </div>
  );
};

export default ImagesPopup;
