import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // Import icon
import styles from "../CSS/Register.module.css";

const ResetPassword = () => {
  // Thêm state để lưu thông báo
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { token } = useParams();

  // Tạo validation schema với Yup
  const validationSchema = Yup.object({
    password: Yup.string()
      .min(6, "Vui lòng nhập ít nhất 6 ký tự")
      .required("Vui lòng nhập mật khẩu"),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref("password"), null], "Mật khẩu nhập lại không khớp")
      .required("Vui lòng nhập lại mật khẩu"),
  });

  // Sử dụng Formik hook
  const formik = useFormik({
    initialValues: {
      new_password: "",
      confirm_password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch(
          "http://localhost//E_Commerce/backend/user/api/ResetPassword.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              token: token, // Gửi token kèm password
              password: values.password,
              password_confirmation: values.password_confirmation,
            }),
          }
        );

        const result = await response.json();

        if (result.status === "success") {
          setMessage({
            text: "Mật khẩu đã được cập nhật thành công!",
            type: "success",
          });
        } else {
          setMessage({ text: result.message, type: "error" });
        }
      } catch (error) {
        console.error("Lỗi cập nhật mật khẩu:", error);
        setMessage({ text: "Đã xảy ra lỗi, vui lòng thử lại.", type: "error" });
      }
    },
  });

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={formik.handleSubmit}>
        <h3 className={styles.heading}>Cập nhật mật khẩu</h3>

        <div className={styles.spacer}></div>
        {/* Hiển thị thông báo kết quả */}
        {message.text && (
          <div className={styles[message.type]}>{message.text}</div>
        )}

        {/* Password field */}

        <div
          className={`${styles.formGroup} ${
            formik.touched.password && formik.errors.password
              ? styles.invalid
              : ""
          }`}
        >
          <label htmlFor="password" className={styles.formLabel}>
            Mật khẩu
          </label>
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"} // Đổi type dựa vào state
              id="password"
              name="password"
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <span
              className={styles.eyeIcon}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>
          <span className={styles.formMessage}>
            {formik.touched.password && formik.errors.password}
          </span>
        </div>

        {/* Password confirmation field */}
        <div
          className={`${styles.formGroup} ${
            formik.touched.password_confirmation &&
            formik.errors.password_confirmation
              ? styles.invalid
              : ""
          }`}
        >
          <label htmlFor="password_confirmation" className={styles.formLabel}>
            Nhập lại mật khẩu
          </label>
          <div className={styles.passwordWrapper}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="password_confirmation"
              name="password_confirmation"
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
              value={formik.values.password_confirmation}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <span
              className={styles.eyeIcon}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible />
              ) : (
                <AiOutlineEye />
              )}
            </span>
          </div>

          <span className={styles.formMessage}>
            {formik.touched.password_confirmation &&
              formik.errors.password_confirmation}
          </span>
        </div>

        <button type="submit" className={styles.formSubmit}>
          Cập nhật
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
