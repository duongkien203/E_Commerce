import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "../CSS/UpdatePhonePopup.module.css";
import OtpPopup from "./OtpPopup"; // Import OtpPopup

const UpdatePhonePopup = ({ onClose, accountId }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isDisabled, setIsDisabled] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [showOtpPopup, setShowOtpPopup] = useState(false); // Quản lý trạng thái OtpPopup

  const formik = useFormik({
    initialValues: { newPhone: "" },
    validationSchema: Yup.object({
      newPhone: Yup.string()
        .matches(
          /^((\+)?(84|0)(3|5|7|8|9)[0-9]{8,9})$/,
          "Số điện thoại không hợp lệ"
        )
        .required("Vui lòng nhập số điện thoại mới"),
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
              contact: values.newPhone,
              contactType: "phone_number",
            }),
          }
        );

        const data = await response.json();

        if (data.status === "success") {
          setMessage({
            text: "Mã OTP đã được gửi đến số điện thoại mới",
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

  // Hàm xác minh OTP (API này đã tích hợp việc cập nhật số điện thoại)
  const verifyOtp = async (otp) => {
    try {
      const response = await fetch(
        "http://localhost/E_Commerce/backend/admin/api/VerifyOTPNewContact.php",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accountId: accountId,
            contact: formik.values.newPhone,
            contactType: "phone_number",
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
        text: "Số điện thoại đã được cập nhật thành công",
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

  const handlePhoneChange = (e) => {
    let value = e.target.value;
    if (value.startsWith("0") && value.length >= 2 && /[1-9]/.test(value[1])) {
      value = "+84" + value.slice(1);
    }
    formik.setFieldValue("newPhone", value); // Sửa thành "newPhone"
    formik.setFieldTouched("newPhone", true, false); // Sửa thành "newPhone"
  };

  return (
    <div className={styles.overlay}>
      <div className={`${styles.popup} ${styles.fadeIn}`}>
        <h2>Nhập số điện thoại mới của bạn</h2>
        <form onSubmit={formik.handleSubmit}>
          <input
            type="text"
            placeholder="Nhập số điện thoại mới"
            {...formik.getFieldProps("newPhone")}
            className={
              formik.touched.newPhone && formik.errors.newPhone
                ? styles.errorInput
                : styles.inputNormal
            }
            onBlur={formik.handleBlur}
            onChange={(e) => {
              formik.handleChange(e);
              handlePhoneChange(e); // Gọi hàm xử lý thay đổi số điện thoại
            }}
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

          {formik.touched.newPhone && formik.errors.newPhone && (
            <div className={`${styles.responseMessage} ${styles.errorMessage}`}>
              {formik.errors.newPhone}
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

export default UpdatePhonePopup;
