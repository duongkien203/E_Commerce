import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { showToast } from "../Components/ToastProvider";
import styles from "../CSS/Contact.module.css";

const Contact = () => {
  const { accountId } = useAuth();

  // State quản lý input form
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  // Hàm xử lý thay đổi input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Hàm gửi dữ liệu đến API
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra nếu chưa có `accountId`
    if (!accountId) {
      showToast("error", "Bạn cần đăng nhập để gửi liên hệ!");
      return;
    }

    // Chuẩn bị dữ liệu gửi đi
    const postData = {
      id: accountId,
      fullName: formData.fullName,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    };

    try {
      const response = await fetch(
        "http://localhost/E_Commerce/backend/user/api/AddContact.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postData),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        showToast("success", "Gửi liên hệ thành công!");
        setFormData({ fullName: "", email: "", subject: "", message: "" }); // Xóa input sau khi gửi
      } else {
        showToast("error", data.message || "Gửi liên hệ thất bại!");
      }
    } catch (error) {
      showToast("error", "Lỗi kết nối đến máy chủ!");
    }
  };

  return (
    <div className={styles.contactContainer}>
      <h1 className={styles.header}>Liên Hệ</h1>
      <p className={styles.intro}>
        Chúng tôi rất mong được nghe từ bạn! Vui lòng liên hệ với chúng tôi qua
        các thông tin dưới đây hoặc điền vào mẫu liên hệ.
      </p>

      <form className={styles.contactForm} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="fullName">Họ và Tên:</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            className={styles.input}
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            className={styles.input}
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="subject">Chủ đề liên hệ:</label>
          <select
            id="subject"
            name="subject"
            className={styles.select}
            value={formData.subject}
            onChange={handleChange}
            required
          >
            <option value="">-- Chọn chủ đề --</option>
            <option value="Tư vấn sản phẩm">Tư vấn sản phẩm</option>
            <option value="Hỗ trợ">Hỗ trợ</option>
            <option value="Khiếu nại">Khiếu nại</option>
            <option value="Khác">Khác</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="message">Nội dung:</label>
          <textarea
            id="message"
            name="message"
            className={styles.textarea}
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <button type="submit" className={styles.submitButton}>
          Gửi
        </button>
      </form>
    </div>
  );
};

export default Contact;
