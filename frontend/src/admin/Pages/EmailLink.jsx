import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaShieldAlt } from "react-icons/fa";
import styles from "../CSS/VerifyLink.module.css";
import { useAuth } from "../Context/AuthContext";

function EmailLink() {
  const [countdown, setCountdown] = useState(60);
  const [showResendButton, setShowResendButton] = useState(false); // Kiểm tra có hiển thị button không
  const [email, setEmail] = useState(""); // Email của người dùng
  const [message, setMessage] = useState({ text: "", type: "" }); // Thông báo linh hoạt
  const [isSubmitting, setIsSubmitting] = useState(false); // Kiểm tra trạng thái submit
  const [isEmailChanged, setIsEmailChanged] = useState(false); // State to check if Email is changed

  const navigate = useNavigate();
  const { accountId } = useAuth();

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  const validationSchema = Yup.object({
    email: Yup.string()
      .required("Vui lòng nhập email")
      .test("check-email", "Vui lòng nhập đúng định dạng", (value) => {
        return emailRegex.test(value);
      }),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: (values) => {
      handleResend();
    },
  });

  // Lấy email từ API nếu có accountId
  useEffect(() => {
    if (accountId) {
      fetch(
        `http://localhost/E_Commerce/backend/user/api/GeEmailPhoneById.php?columnName=email&tableName=accounts&condition=account_id&id=${accountId}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            setEmail(data.data);
          }
        })
        .catch((error) => {
          setMessage({ text: "Lỗi khi lấy email!", type: "error" });
          console.error("Error fetching email:", error);
        });
      // Gọi API lấy thời gian OTP
      fetch(
        `http://localhost/E_Commerce/backend/user/api/GetTokenExpiry.php?id=${accountId}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            const otpCreatedAt = new Date(data.data).getTime(); // Chuyển thành timestamp
            const currentTime = Date.now();
            const timePassed = Math.floor((currentTime - otpCreatedAt) / 1000); // Tính số giây đã trôi qua

            if (timePassed >= 60) {
              setShowResendButton(true); // Nếu quá 1 phút, hiển thị nút gửi lại
            } else {
              setCountdown(60 - timePassed); // Nếu chưa đủ 1 phút, đặt countdown
            }
          }
        })
        .catch((error) => {
          console.error("Lỗi khi lấy thời gian OTP:", error);
        });
    }
  }, [accountId]);

  // Đếm ngược 60s
  useEffect(() => {
    if (countdown === 0) {
      setShowResendButton(true);
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Định dạng email hiển thị
  const formatEmail = (email) => {
    if (!email) return "a************b@gmail.com";
    const firstPart = email.substring(0, 1);
    const lastPart = email.substring(
      email.indexOf("@") - 1,
      email.indexOf("@")
    );
    const maskedPart = "*".repeat(email.indexOf("@") - 2);
    return (
      firstPart + maskedPart + lastPart + email.substring(email.indexOf("@"))
    );
  };

  // Enable submit button when Email is changed
  useEffect(() => {
    setIsSubmitting(!isEmailChanged); // Disable button if Email is not changed
  }, [isEmailChanged]);

  // Handle Email change
  const handleEmailChange = (e) => {
    formik.handleChange(e);
    setIsEmailChanged(true);
  };

  // Xử lý gửi lại liên kết
  const handleResend = () => {
    setIsSubmitting(true); // Disable the button
    setMessage({ text: "", type: "" }); // Xóa thông báo cũ
    fetch("http://localhost//E_Commerce/backend/admin/api/SendOTPEmail.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        account_id: accountId,
        email: formik.values.email,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setMessage({ text: "Gửi yêu cầu thành công!", type: "success" });
          setShowResendButton(false);
          setCountdown(60); // Reset lại countdown

          setTimeout(() => navigate("/admin/verify/verify-otp"), 1000);
        } else {
          setMessage({ text: data.message, type: "error" });
        }
        setIsSubmitting(false); // Enable the button
        setIsEmailChanged(false); // Reset the Email changed state
      })
      .catch((error) => {
        setMessage({ text: "Lỗi khi gửi yêu cầu!", type: "error" });
        console.error("Error:", error);
        setIsSubmitting(false); // Enable the button
        setIsEmailChanged(false); // Reset the Email changed state
      });
  };

  return (
    <div className={styles.verifyContainer}>
      <div className={styles.verify}>
        <div className={styles.arrowBack} onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </div>
        <div className={styles.securityIcon}>
          <FaShieldAlt />
        </div>
        <p className={styles.verifyText}>Xác minh bằng địa chỉ Email</p>
        <p>
          Vui lòng nhập địa chỉ Email của tài khoản
          <br />
          {formatEmail(email)}
        </p>

        {/* Hiển thị thông báo kết quả */}
        {message.text && (
          <div className={styles[message.type]}>{message.text}</div>
        )}

        {/* Ô nhập email */}
        <form onSubmit={formik.handleSubmit}>
          <div
            className={`${styles.formGroup} ${
              formik.touched.email && formik.errors.email ? styles.invalid : ""
            }`}
          >
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Nhập email của bạn"
              autoComplete="email"
              value={formik.values.email}
              onChange={handleEmailChange} // Use the new handler
              onBlur={formik.handleBlur}
            />
            <span className={styles.formMessage}>
              {formik.touched.email && formik.errors.email}
            </span>
          </div>

          {/* Nút gửi lại liên kết */}
          {!showResendButton ? (
            <p className={styles.notification}>
              Vui lòng chờ trong {countdown} giây để gửi lần tiếp theo
            </p>
          ) : (
            <p>
              <button
                className={styles.resendButton}
                type="submit"
                disabled={isSubmitting}
              >
                Gửi yêu cầu
              </button>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default EmailLink;
