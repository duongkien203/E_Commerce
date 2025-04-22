import React, { useState, useEffect } from "react";
import styles from "../CSS/NotificationFormPopup.module.css";

const NotificationFormPopup = ({
  isOpen,
  onClose,
  notificationData,
  onSubmit,
}) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  // Khi nhận dữ liệu từ `notificationData`, cập nhật các trường input
  useEffect(() => {
    if (notificationData) {
      setTitle(notificationData.title);
      setMessage(notificationData.message);
      setCreatedAt(notificationData.created_at?.slice(0, 16) || "");
    } else {
      // Lấy thời gian hiện tại theo định dạng datetime-local
      const now = new Date();
      now.setHours(now.getHours() + 7); // Thêm 7 giờ (nếu cần phù hợp với múi giờ Việt Nam)
      const localTime = now.toISOString().slice(0, 16);
      setCreatedAt(localTime);
    }
  }, [notificationData]);

  // Xử lý form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra các trường input
    if (!title.trim() || !message.trim() || !createdAt.trim()) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    // Gọi hàm `onSubmit` truyền dữ liệu thông báo
    onSubmit({
      notification_id: notificationData?.notification_id,
      title,
      message,
      created_at: createdAt,
    });

    // Đóng form sau khi gửi
    onClose();
  };

  // Nếu không mở form, không hiển thị gì
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h2>{notificationData ? "Sửa Thông Báo" : "Thêm Thông Báo"}</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Tiêu đề:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label htmlFor="message">Nội dung:</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />

          <label htmlFor="createdAt">Ngày hiệu lực:</label>
          <input
            id="createdAt"
            type="datetime-local"
            value={createdAt}
            onChange={(e) => setCreatedAt(e.target.value)}
            required
          />

          <div className={styles.btnGroup}>
            <button type="submit" className={styles.saveButton}>
              Lưu
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationFormPopup;
