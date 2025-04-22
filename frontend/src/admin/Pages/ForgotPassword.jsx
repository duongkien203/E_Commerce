import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import styles from "../CSS/ForgotPassword.module.css";

const ForgotPassword = () => {
  const accountId = useAuth();
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isChanged, setIsChanged] = useState(false); // Kiểm tra username có thay đổi hay không

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA0-9]{2,6}$/;
  const phoneRegex = /^(?:\+?\d{1,3})?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/;

  const validationSchema = Yup.object({
    username: Yup.string()
      .required("Vui lòng nhập email hoặc số điện thoại")
      .test("check-username", "Vui lòng nhập đúng định dạng", (value) => {
        return emailRegex.test(value) || phoneRegex.test(value);
      }),
  });

  const formik = useFormik({
    initialValues: { username: "" },
    validationSchema,
    onSubmit: async (values) => {
      setIsChanged(false);
      let userType = "";
      if (emailRegex.test(values.username)) {
        userType = "email";
      } else if (phoneRegex.test(values.username)) {
        userType = "phone_number";
      }
      try {
        const response = await axios.post(
          `http://localhost//E_Commerce/backend/admin/api/ForgotPassword.php?userType=${userType}&username=${values.username}&id=${accountId}`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const result = response.data;

        if (result.status === "success") {
          setMessage({
            text: "Chúng tôi đã gửi phản hồi đến thông tin liên lạc của bạn.",
            type: "success",
          });
        } else {
          setMessage({ text: result.message, type: "error" });
        }
      } catch (error) {
        setMessage({ text: "Đã xảy ra lỗi, vui lòng thử lại.", type: "error" });
      }
    },
  });

  // Theo dõi thay đổi trong input
  useEffect(() => {
    setIsChanged(true);
  }, [formik.values.username]);

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={formik.handleSubmit}>
        <h3 className={styles.heading}>Quên mật khẩu</h3>

        {/* Hiển thị thông báo kết quả */}
        {message.text && (
          <div className={styles[message.type]}>{message.text}</div>
        )}

        <div
          className={`${styles.formGroup} ${
            formik.touched.username && formik.errors.username
              ? styles.invalid
              : ""
          }`}
        >
          <label htmlFor="username" className={styles.formLabel}>
            Nhập Email hoặc Số điện thoại
          </label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Nhập Email hoặc Số điện thoại"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <span className={styles.formMessage}>
            {formik.touched.username && formik.errors.username}
          </span>
        </div>

        <button
          type="submit"
          className={`${styles.formSubmit} ${
            !isChanged ? styles.disabled : ""
          }`}
          disabled={!isChanged}
        >
          Gửi yêu cầu
        </button>

        <div className={styles.login}>
          <Link to="/admin/login">Quay lại đăng nhập</Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
