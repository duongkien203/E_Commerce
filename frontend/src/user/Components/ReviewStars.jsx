import React, { useState, useEffect } from "react";
import axios from "axios";
import Popup from "./Popup";
import styles from "../CSS/ReviewStars.module.css";

const ReviewStars = ({
  account_id,
  product_id,
  invoice_id,
  isOpen,
  onClose,
}) => {
  const [reviewStars, setReviewStars] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Reset reviewStars khi popup mở lại
  useEffect(() => {
    if (isOpen) {
      setReviewStars(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSetReviewStars = (stars) => {
    if (stars >= 1 && stars <= 5) {
      setReviewStars(stars);
    }
  };

  const handleSubmit = () => {
    if (reviewStars === 0) {
      setPopupMessage("Vui lòng chọn số sao để đánh giá!");
      setIsPopupOpen(true);
      return;
    }

    setIsSubmitting(true);
    axios
      .post("http://localhost/E_Commerce/backend/user/api/AddReviewStars.php", {
        account_id,
        product_id,
        reviewStars,
        invoice_id,
      })
      .then((response) => {
        if (response.data.status === "success") {
          setPopupMessage(
            "Đánh giá của bạn đã được gửi. Cảm ơn bạn đã ủng hộ cửa hàng của chúng tôi."
          );
          setIsPopupOpen(true);
          // Xóa setTimeout, không gọi onClose(true) ngay lập tức
        } else {
          setPopupMessage("Không thể gửi đánh giá. Vui lòng thử lại sau!");
          setIsPopupOpen(true);
        }
      })
      .catch((error) => {
        console.error("Error submitting reviewStars:", error);
        setPopupMessage("Có lỗi xảy ra khi gửi đánh giá!");
        setIsPopupOpen(true);
      })
      .finally(() => setIsSubmitting(false));
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    // Chỉ đóng popup chính khi người dùng nhấn OK và đánh giá thành công
    if (
      popupMessage ===
      "Đánh giá của bạn đã được gửi. Cảm ơn bạn đã ủng hộ cửa hàng của chúng tôi."
    ) {
      onClose(true); // Báo cho parent rằng đánh giá thành công
    } else {
      onClose(false); // Đóng mà không báo thành công
    }
  };

  const renderStars = () => {
    return Array(5)
      .fill(0)
      .map((_, index) => {
        const starValue = index + 1;
        return (
          <span
            key={starValue}
            className={
              starValue <= reviewStars
                ? `${styles.star} ${styles.starActive}`
                : styles.star
            }
            onClick={() => handleSetReviewStars(starValue)}
          >
            ★
          </span>
        );
      });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popupContainer}>
        <h3>Đánh giá sản phẩm</h3>
        <div style={{ marginBottom: "10px" }}>{renderStars()}</div>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`${styles.button} ${styles.submitButton}`}
        >
          {isSubmitting ? "Đang gửi..." : "Gửi"}
        </button>
        <button
          onClick={() => onClose(false)}
          className={`${styles.button} ${styles.closeButton}`}
        >
          Đóng
        </button>

        {isPopupOpen && (
          <Popup message={popupMessage} onClose={handlePopupClose} />
        )}
      </div>
    </div>
  );
};

export default ReviewStars;
