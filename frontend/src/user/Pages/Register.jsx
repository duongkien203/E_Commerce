import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "../CSS/Register.module.css";
import OtpPopup from "../Components/OtpPopup";

const Register = () => {
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isChanged, setIsChanged] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isOtpOpen, setIsOtpOpen] = useState(false);

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const phoneRegex = /^(?:\+?\d{1,3})?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/;

  // Tạo validation schema với Yup cho hai trường riêng
  const validationSchema = Yup.object({
    fullname: Yup.string()
      .required("Vui lòng nhập tên đầy đủ của bạn")
      .min(2, "Tên phải chứa ít nhất 2 ký tự")
      .max(100, "Tên không được vượt quá 100 ký tự")
      .matches(
        /^[a-zA-ZÀ-ỹ\s-]*$/, // Cho phép chữ cái Latin, chữ cái có dấu tiếng Việt, khoảng trắng, và dấu gạch ngang
        "Tên chỉ được chứa chữ cái, khoảng trắng và dấu gạch ngang, không được có ký tự đặc biệt"
      )
      .trim("Không được chỉ chứa khoảng trắng")
      .test(
        "no-only-spaces",
        "Tên không được chỉ chứa khoảng trắng",
        (value) => value && value.trim().length > 0
      ),
    contact: Yup.string()
      .required("Vui lòng nhập email hoặc số điện thoại")
      .test(
        "check-email-phone",
        "Vui lòng nhập đúng định dạng email hoặc số điện thoại",
        (value) => {
          return emailRegex.test(value) || phoneRegex.test(value);
        }
      ),
    username: Yup.string()
      .required("Vui lòng nhập tên đăng nhập")
      .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
    password: Yup.string()
      .required("Vui lòng nhập mật khẩu")
      .min(8, "Mật khẩu phải chứa ít nhất 8 ký tự")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
        "Mật khẩu phải chứa ít nhất một chữ cái và một số"
      ),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref("password"), null], "Mật khẩu nhập lại không khớp")
      .required("Vui lòng nhập lại mật khẩu"),
  });

  const formatPhoneNumber = (phone) => {
    if (phone.startsWith("0")) {
      return "+84" + phone.slice(1);
    }
    return phone;
  };

  const formik = useFormik({
    initialValues: {
      fullname: "",
      contact: "", // Trường mới cho Email hoặc Số điện thoại
      username: "", // Trường mới cho Tên đăng nhập
      password: "",
      password_confirmation: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsChanged(false);
      let contactType = "";

      if (emailRegex.test(values.contact)) {
        contactType = "email";
      } else if (phoneRegex.test(values.contact)) {
        contactType = "phone_number";
        values.contact = formatPhoneNumber(values.contact);
      }

      const newUserData = {
        fullname: values.fullname,
        contact: values.contact, // Gửi cả email hoặc số điện thoại
        username: values.username, // Sử dụng trường username riêng
        password: values.password,
        password_confirmation: values.password_confirmation,
        contactType: contactType,
      };

      try {
        const response = await fetch(
          "http://localhost//E_Commerce/backend/user/api/CreateAccount.php",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams(newUserData),
          }
        );

        const result = await response.json();

        if (result.status === "pending") {
          setMessage({ text: result.message, type: "success" });
          setUserData(newUserData);
          setIsOtpOpen(true);
        } else {
          setMessage({ text: result.message, type: "error" });
        }
      } catch (error) {
        console.error("Đăng ký thất bại:", error);
        setMessage({ text: "Đã xảy ra lỗi, vui lòng thử lại.", type: "error" });
      }
    },
  });

  useEffect(() => {
    const valuesChanged = Object.keys(formik.initialValues).some(
      (key) => formik.values[key] !== formik.initialValues[key]
    );
    setIsChanged(valuesChanged);
  }, [formik.values, formik.initialValues]);

  const handleOtpVerify = async (otp) => {
    if (!userData) return;

    try {
      const response = await fetch(
        "http://localhost//E_Commerce/backend/user/api/VerifyOTPRegister.php",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...userData,
            otp,
          }),
        }
      );

      const result = await response.json();

      return result;
    } catch (error) {
      console.error("Xác minh OTP thất bại:", error);
      setMessage({
        text: "Lỗi xác minh OTP, vui lòng thử lại.",
        type: "error",
      });
    }
  };

  const handleContactChange = (e) => {
    let value = e.target.value;
    if (phoneRegex.test(value) && value.startsWith("0")) {
      value = "+84" + value.slice(1);
    }
    formik.setFieldValue("contact", value);
    formik.setFieldTouched("contact", true, false);
  };

  return (
    <div
      className={styles.containerRegister}
      style={{ backgroundImage: "url(/assets/background-uneti.jpg)" }}
    >
      <div className={styles.container}>
        <form className={styles.form} onSubmit={formik.handleSubmit}>
          <h3 className={styles.heading}>Đăng ký</h3>

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

          {/* Email or Phone field */}
          <div
            className={`${styles.formGroup} ${
              formik.touched.contact && formik.errors.contact
                ? styles.invalid
                : ""
            }`}
          >
            <label htmlFor="contact" className={styles.formLabel}>
              Email hoặc Số điện thoại
            </label>
            <input
              type="text"
              id="contact"
              name="contact"
              placeholder="Nhập email hoặc số điện thoại"
              autoComplete="email"
              value={formik.values.contact}
              onChange={handleContactChange} // Sử dụng handleContactChange
              onBlur={formik.handleBlur}
            />
            <span className={styles.formMessage}>
              {formik.touched.contact && formik.errors.contact}
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

          <button
            type="submit"
            className={`${styles.formSubmit} ${
              !isChanged ? styles.disabled : ""
            }`}
            disabled={!isChanged}
          >
            Đăng ký
          </button>

          <div className={styles.login}>
            Bạn đã có tài khoản? <Link to="/login"> Đăng nhập</Link>
          </div>
        </form>
        <OtpPopup
          isOpen={isOtpOpen}
          onClose={() => setIsOtpOpen(false)}
          onVerify={handleOtpVerify}
          setParentMessage={setMessage}
          redirectLink="/login"
        />
      </div>
    </div>
  );
};

export default Register;
