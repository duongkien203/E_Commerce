import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom"; // Sử dụng useNavigate
import axios from "axios"; // Import axios để gửi yêu cầu
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // Import icon
import { useAuth } from "../Context/AuthContext"; // Import context
import styles from "../CSS/Login.module.css";

const Login = () => {
  const navigate = useNavigate(); // Hook để điều hướng
  const { setAccountId } = useAuth(); // Lấy set từ context
  const [isChanged, setIsChanged] = useState(false); // Kiểm tra có thay đổi hay không
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State để ẩn/hiện mật khẩu

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA0-9]{2,6}$/;
  const phoneRegex = /^(?:\+?\d{1,3})?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/;

  const validationSchema = Yup.object({
    login: Yup.string()
      .required("Vui lòng nhập email, số điện thoại hoặc tên đăng nhập")
      .test("check-login", "Vui lòng nhập đúng định dạng", (value) => {
        return (
          emailRegex.test(value) || phoneRegex.test(value) || value.length >= 3
        );
      }),
    password: Yup.string()
      .required("Vui lòng nhập mật khẩu")
      .min(6, "Vui lòng nhập ít nhất 6 ký tự"),
  });

  const formik = useFormik({
    initialValues: {
      login: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsChanged(false);
      // Kiểm tra giá trị nhập vào để quyết định kiểu đăng nhập
      let loginType = "username"; // Mặc định là username

      if (emailRegex.test(values.login)) {
        loginType = "email";
      } else if (phoneRegex.test(values.login)) {
        loginType = "phone_number";
      }

      try {
        // Gửi yêu cầu đăng nhập đến API
        const response = await axios.post(
          "http://localhost//E_Commerce/backend/admin/api/GetAccount.php",
          {
            loginType: loginType, // Gửi kiểu đăng nhập linh hoạt
            username: values.login,
            password: values.password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Kiểm tra dữ liệu trả về từ API
        if (response.data.data.status === "error") {
          // Nếu tài khoản hoặc mật khẩu sai
          setErrorMessage("Tài khoản hoặc mật khẩu không chính xác.");
        } else {
          const account = response.data.data; // Truy xuất tài khoản

          if (account.status === "active") {
            setAccountId(account.account_id);

            navigate("/admin");
          } else {
            // Nếu tài khoản không active, hiển thị thông báo
            setErrorMessage("Tài khoản chưa được kích hoạt.");
          }
        }
      } catch (error) {
        setErrorMessage("Đã xảy ra lỗi, vui lòng thử lại.");
      }
    },
  });

  useEffect(() => {
    // Check if form values have changed
    const valuesChanged = Object.keys(formik.initialValues).some(
      (key) => formik.values[key] !== formik.initialValues[key]
    );
    setIsChanged(valuesChanged);
  }, [formik.values, formik.initialValues]);

  return (
    <div
      className={styles.containerLogin}
      style={{ backgroundImage: "url(/assets/background-uneti.jpg)" }}
    >
      <div className={styles.container}>
        <form className={styles.form} onSubmit={formik.handleSubmit}>
          <h3 className={styles.heading}>Đăng nhập</h3>

          <div className={styles.spacer}></div>
          {/* Hiển thị thông báo lỗi nếu có */}
          {errorMessage && (
            <div className={styles.errorMessage}>{errorMessage}</div>
          )}

          {/* Trường nhập email/sđt/tài khoản */}
          <div
            className={`${styles.formGroup} ${
              formik.touched.login && formik.errors.login ? styles.invalid : ""
            }`}
          >
            <label htmlFor="login" className={styles.formLabel}>
              Email/Số điện thoại/Tên đăng nhập
            </label>
            <input
              type="text"
              id="login"
              name="login"
              placeholder="Email/Số điện thoại/Tên đăng nhập"
              autoComplete="username"
              value={formik.values.login}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <span className={styles.formMessage}>
              {formik.touched.login && formik.errors.login}
            </span>
          </div>

          {/* Trường nhập mật khẩu */}
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

          {/* Link quên mật khẩu */}
          <div className={styles.forgotPassword}>
            <Link to="/admin/forgot-password">Quên mật khẩu?</Link>
          </div>

          <button
            type="submit"
            className={`${styles.formSubmit} ${
              !isChanged ? styles.disabled : ""
            }`}
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
