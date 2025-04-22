import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom"; // Sử dụng useNavigate thay cho useHistory
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
    username: Yup.string()
      .required("Vui lòng nhập email, số điện thoại hoặc tên đăng nhập")
      .test("check-username", "Vui lòng nhập đúng định dạng", (value) => {
        return (
          emailRegex.test(value) || phoneRegex.test(value) || value.length >= 3
        );
      }),
    password: Yup.string()
      .required("Vui lòng nhập mật khẩu")
      .min(8, "Mật khẩu phải chứa ít nhất 8 ký tự")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
        "Mật khẩu phải chứa ít nhất một chữ cái và một số"
      ),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsChanged(false);
      // Kiểm tra giá trị nhập vào để quyết định kiểu đăng nhập
      let loginType = "username"; // Mặc định là username

      if (emailRegex.test(values.username)) {
        loginType = "email";
      } else if (phoneRegex.test(values.username)) {
        loginType = "phone_number";
      }

      try {
        // Gửi yêu cầu đăng nhập đến API
        const response = await axios.post(
          "http://localhost//E_Commerce/backend/user/api/GetAccount.php",
          {
            loginType: loginType, // Gửi kiểu đăng nhập linh hoạt
            username: values.username,
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

            navigate("/");
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
              formik.touched.username && formik.errors.username
                ? styles.invalid
                : ""
            }`}
          >
            <label htmlFor="username" className={styles.formLabel}>
              Email/Số điện thoại/Tên đăng nhập
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Email/Số điện thoại/Tên đăng nhập"
              autoComplete="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <span className={styles.formMessage}>
              {formik.touched.username && formik.errors.username}
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
            <Link to="/forgot-password">Quên mật khẩu?</Link>
          </div>

          <button
            type="submit"
            className={`${styles.formSubmit} ${
              !isChanged ? styles.disabled : ""
            }`}
          >
            Đăng nhập
          </button>

          <div className={styles.register}>
            Bạn chưa có tài khoản? <Link to="/register"> Đăng ký ngay</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
