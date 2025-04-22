import React, { useState } from "react";
import axios from "axios";
import { showToast } from "../Components/ToastProvider"; // Import showToast
import styles from "../CSS/ReplyContactPopup.module.css";

const ReplyContactPopup = ({ isOpen, onClose, contact, onReplySuccess }) => {
  const [replyMessage, setReplyMessage] = useState("");
  const [isSending, setIsSending] = useState(false); // Trạng thái gửi email

  if (!isOpen || !contact) return null;

  const handleReply = () => {
    if (!replyMessage.trim()) {
      showToast("warning", "Vui lòng nhập nội dung phản hồi.");
      return;
    }

    setIsSending(true); // Bắt đầu gửi email

    const requestData = {
      contact_id: contact.contact_id,
      to_email: contact.email,
      full_name: contact.full_name,
      subject: contact.subject,
      user_message: contact.message,
      reply_message: replyMessage,
    };

    axios
      .post(
        "http://localhost/E_Commerce/backend/admin/api/ReplyContact.php",
        requestData
      )
      .then((response) => {
        if (response.data.status === "success") {
          showToast("success", "Phản hồi đã được gửi");

          // Gọi lại fetchContacts để cập nhật danh sách liên hệ
          if (typeof onReplySuccess === "function") {
            onReplySuccess();
          }

          onClose();
        } else {
          showToast("error", "Gửi phản hồi thất bại, vui lòng thử lại.");
        }
      })
      .catch(() => {
        showToast("error", "Lỗi kết nối, vui lòng kiểm tra server.");
      })
      .finally(() => {
        setIsSending(false); // Kết thúc gửi email
      });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          disabled={isSending}
        >
          ✖
        </button>
        <h2 className={styles.title}>Phản hồi liên hệ</h2>

        <div className={styles.contactInfo}>
          <p>
            <strong>ID:</strong> {contact.contact_id}
          </p>
          <p>
            <strong>Tên liên hệ:</strong> {contact.full_name}
          </p>
          <p>
            <strong>Email:</strong> {contact.email}
          </p>
          <p>
            <strong>Chủ đề:</strong> {contact.subject}
          </p>
          <p className={styles.message}>
            <strong>Nội dung:</strong> {contact.message}
          </p>
        </div>

        <textarea
          className={styles.replyInput}
          rows="4"
          placeholder="Nhập nội dung phản hồi..."
          value={replyMessage}
          onChange={(e) => setReplyMessage(e.target.value)}
          disabled={isSending} // Vô hiệu hóa khi đang gửi
        ></textarea>

        <div className={styles.buttonGroup}>
          <button
            className={`${styles.replyButton} ${
              isSending ? styles.disabledButton : ""
            }`}
            onClick={handleReply}
            disabled={isSending}
          >
            {isSending ? "Đang gửi..." : "Trả lời"}
          </button>
          <button
            className={styles.cancelButton}
            onClick={onClose}
            disabled={isSending}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReplyContactPopup;
