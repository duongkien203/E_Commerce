import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "../CSS/UpdateEmailPopup.module.css";
import OtpPopup from "./OtpPopup"; // Import OtpPopup

const UpdateEmailPopup = ({ onClose, accountId }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isDisabled, setIsDisabled] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [showOtpPopup, setShowOtpPopup] = useState(false); // Quản lý trạng thái OtpPopup

  const formik = useFormik({
    initialValues: { newEmail: "" },
    validationSchema: Yup.object({
      newEmail: Yup.string()
        .email("Email không hợp lệ")
        .required("Vui lòng nhập email mới"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setMessage({ text: "", type: "" });

      try {
        const response = await fetch(
          "http://localhost/E_Commerce/backend/admin/api/VerifySendOTP.php",
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              accountId: accountId,
              contact: values.newEmail,
              contactType: "email",
            }),
          }
        );

        const data = await response.json();

        if (data.status === "success") {
          setMessage({
            text: "Mã OTP đã được gửi đến email mới",
            type: "success",
          });
          setTimeout(() => {
            setShowOtpPopup(true); // Hiển thị OtpPopup
          }, 1000);
        } else {
          setMessage({ text: `${data.message}`, type: "error" });
        }
      } catch (error) {
        setMessage({
          text: "Lỗi khi gửi yêu cầu. Vui lòng thử lại.",
          type: "error",
        });
      }

      setLoading(false);
    },
  });

  // Hàm xác minh OTP (API này đã tích hợp việc cập nhật email)
  const verifyOtp = async (otp) => {
    try {
      const response = await fetch(
        "http://localhost/E_Commerce/backend/admin/api/VerifyOTPNewContact.php",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accountId: accountId, // Thêm accountId để backend biết tài khoản nào cần cập nhật
            contact: formik.values.newEmail,
            contactType: "email", // Thêm contactType để backend biết cập nhật email hay phone
            otp: otp,
          }),
        }
      );

      const data = await response.json();
      return data; // Trả về kết quả xác minh và cập nhật
    } catch (error) {
      return {
        status: "error",
        message: "Lỗi khi xác minh OTP.",
      };
    }
  };

  // Hàm xử lý xác minh OTP
  const handleVerifyOtp = async (otp) => {
    const result = await verifyOtp(otp);
    if (result.status === "success") {
      setMessage({
        text: "Email đã được cập nhật thành công", // Hoặc lấy result.message từ backend nếu có
        type: "success",
      });
      setIsDisabled(true);
      startCountdown();
    }
    return result; // Trả về kết quả để OtpPopup hiển thị thông báo nếu cần
  };

  const startCountdown = () => {
    setCountdown(5);
  };

  useEffect(() => {
    let timer;
    if (isDisabled && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isDisabled, countdown, onClose]);

  return (
    <div className={styles.overlay}>
      <div className={`${styles.popup} ${styles.fadeIn}`}>
        <h2>Nhập email mới của bạn</h2>
        <form onSubmit={formik.handleSubmit}>
          <input
            type="text"
            placeholder="Nhập email mới"
            {...formik.getFieldProps("newEmail")}
            className={
              formik.touched.newEmail && formik.errors.newEmail
                ? styles.errorInput
                : styles.inputNormal
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            disabled={isDisabled}
          />

          {message.text && (
            <div
              className={`${styles.responseMessage} ${
                message.type === "success"
                  ? styles.successMessage
                  : styles.errorMessage
              }`}
            >
              {message.text}
            </div>
          )}

          {formik.touched.newEmail && formik.errors.newEmail && (
            <div className={`${styles.responseMessage} ${styles.errorMessage}`}>
              {formik.errors.newEmail}
            </div>
          )}

          {isDisabled ? (
            <button type="button" onClick={onClose} className={styles.closeBtn}>
              Đóng ({countdown})
            </button>
          ) : (
            <button type="submit" disabled={loading}>
              {loading ? "Đang gửi..." : "Gửi OTP"}
            </button>
          )}
        </form>

        <span className={styles.close} onClick={onClose}>
          ×
        </span>
      </div>

      {/* Hiển thị OtpPopup */}
      <OtpPopup
        isOpen={showOtpPopup}
        onClose={() => setShowOtpPopup(false)}
        onVerify={handleVerifyOtp} // Truyền hàm handleVerifyOtp
        setParentMessage={setMessage}
      />
    </div>
  );
};

export default UpdateEmailPopup;
