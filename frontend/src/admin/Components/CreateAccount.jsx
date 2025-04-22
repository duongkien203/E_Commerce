import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "../CSS/CreateAccount.module.css";
import Popup from "./Popup"; // Import Popup

const CreateAccount = ({ isOpen, onClose }) => {
  const [isChanged, setIsChanged] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [roles, setRoles] = useState([]);
  const [popupMessage, setPopupMessage] = useState(null); // State cho Popup
  const [message, setMessage] = useState({ text: "", type: "" }); // State cho thông báo lỗi/thành công

  const validationSchema = Yup.object({
    fullname: Yup.string().required("Vui lòng nhập tên đầy đủ của bạn"),
    username: Yup.string()
      .required("Vui lòng nhập tên đăng nhập")
      .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
    password: Yup.string()
      .min(6, "Vui lòng nhập ít nhất 6 ký tự")
      .required("Vui lòng nhập mật khẩu"),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref("password"), null], "Mật khẩu nhập lại không khớp")
      .required("Vui lòng nhập lại mật khẩu"),
    role: Yup.string().required("Vui lòng chọn vai trò"),
  });

  const formik = useFormik({
    initialValues: {
      fullname: "",
      username: "",
      password: "",
      password_confirmation: "",
      role: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsChanged(false);

      try {
        const response = await fetch(
          "http://localhost//E_Commerce/backend/admin/api/CreateAccount.php",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams(values),
          }
        );

        const result = await response.json();

        if (result.status === "success") {
          setPopupMessage({ text: result.message, type: "success" }); // Hiển thị Popup thành công
        } else {
          setMessage({ text: result.message, type: "error" }); // Hiển thị thông báo lỗi
        }
      } catch (error) {
        console.error("Đăng ký thất bại:", error);
        setMessage({
          text: "Đã xảy ra lỗi, vui lòng thử lại.",
          type: "error",
        }); // Hiển thị thông báo lỗi
      }
    },
  });

  useEffect(() => {
    const valuesChanged = Object.keys(formik.initialValues).some(
      (key) => formik.values[key] !== formik.initialValues[key]
    );
    setIsChanged(valuesChanged);

    fetchRoles();
  }, [formik.values, formik.initialValues]);

  const fetchRoles = async () => {
    try {
      const response = await fetch(
        "http://localhost//E_Commerce/backend/admin/api/GetRoles.php"
      );
      const result = await response.json();

      if (result.status === "success") {
        setRoles(result.data);
      } else {
        console.error("Lỗi khi lấy vai trò:", result.message);
      }
    } catch (error) {
      console.error("Lỗi khi lấy vai trò:", error);
    }
  };

  const getVietnameseRole = (roleName) => {
    switch (roleName) {
      case "admin":
        return "Quản trị viên";
      case "manager":
        return "Quản lý";
      case "user":
        return "Khách hàng";
      default:
        return roleName;
    }
  };

  const handlePopupClose = () => {
    setPopupMessage(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <form className={styles.form} onSubmit={formik.handleSubmit}>
          <h3 className={styles.heading}>Tạo tài khoản</h3>

          <div className={styles.spacer}></div>
          {message.text && (
            <div className={styles[message.type]}>{message.text}</div>
          )}

          {/* Fullname field */}
          <div
            className={`${styles.formGroup} ${
              formik.touched.fullname && formik.errors.fullname
                ? styles.invalid
                : ""
            }`}
          >
            <label htmlFor="fullname" className={styles.formLabel}>
              Họ và tên
            </label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              placeholder="VD: Dương Kiên"
              value={formik.values.fullname}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <span className={styles.formMessage}>
              {formik.touched.fullname && formik.errors.fullname}
            </span>
          </div>

          {/* Username field */}
          <div
            className={`${styles.formGroup} ${
              formik.touched.username && formik.errors.username
                ? styles.invalid
                : ""
            }`}
          >
            <label htmlFor="username" className={styles.formLabel}>
              Tên đăng nhập
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Nhập tên đăng nhập"
              autoComplete="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <span className={styles.formMessage}>
              {formik.touched.username && formik.errors.username}
            </span>
          </div>

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
                type={showPassword ? "text" : "password"}
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

          {/* Role field */}
          <div
            className={`${styles.formGroup} ${
              formik.touched.role && formik.errors.role ? styles.invalid : ""
            }`}
          >
            <label htmlFor="role" className={styles.formLabel}>
              Vai trò
            </label>
            <select
              id="role"
              name="role"
              value={formik.values.role}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">Chọn vai trò</option>
              {roles.map((role) => (
                <option key={role.role_id} value={role.role_id}>
                  {getVietnameseRole(role.role_name)}
                </option>
              ))}
            </select>
            <span className={styles.formMessage}>
              {formik.touched.role && formik.errors.role}
            </span>
          </div>

          <button
            type="submit"
            className={`${styles.formSubmit} ${
              !isChanged ? styles.disabled : ""
            }`}
            disabled={!isChanged}
          >
            Tạo
          </button>
        </form>
      </div>
      {popupMessage && (
        <Popup message={popupMessage.text} onClose={handlePopupClose} />
      )}
    </div>
  );
};

export default CreateAccount;
