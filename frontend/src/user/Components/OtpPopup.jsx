import React, { useState, useEffect } from "react";
import styles from "../CSS/OtpPopup.module.css";
import { useNavigate } from "react-router-dom";

const OtpPopup = ({
  isOpen,
  onClose,
  onVerify,
  setParentMessage,
  redirectLink = "",
  setShowUpdateEmailPopup,
  setShowUpdatePhonePopup,
}) => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isDisabled, setIsDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0); // Thêm state đếm ngược
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setMessage({ text: "Mã OTP phải có 6 chữ số", type: "error" });
      return;
    }

    const result = await onVerify(otp);

    if (result.status === "success") {
      setMessage({ text: "Xác minh thành công", type: "success" });
      setParentMessage({ text: "Xác minh thành công", type: "success" });
      setIsDisabled(true);
      setCountdown(5); // Bắt đầu đếm ngược 5 giây

      if (redirectLink === "update-email") {
        setTimeout(() => {
          onClose();
          setShowUpdateEmailPopup(true);
        }, 1);
      }
      if (redirectLink === "update-phone") {
        setTimeout(() => {
          onClose();
          setShowUpdatePhonePopup(true);
        }, 1);
      }
    } else {
      setMessage({
        text: "Mã OTP không đúng, vui lòng thử lại.",
        type: "error",
      });
    }
  };

  const handleClose = () => {
    if (
      message.type === "success" &&
      redirectLink !== "update-email" &&
      redirectLink !== "update-phone"
    ) {
      navigate(redirectLink);
    } else if (message.type !== "success") {
      setParentMessage({ text: "Xác minh thất bại.", type: "error" });
    }
    onClose();
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      if (countdown === 1) {
        onClose(); // Tự động đóng popup khi đếm ngược về 0
      }

      return () => clearTimeout(timer);
    }
  }, [countdown, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h3>Xác minh OTP</h3>
        <p>Vui lòng nhập mã OTP đã gửi đến thông tin liên lạc của bạn</p>

        {message.text && (
          <p
            className={
              message.type === "success" ? styles.success : styles.error
            }
          >
            {message.text}
          </p>
        )}

        <input
          type="text"
          placeholder="Nhập mã OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className={styles.otpInput}
          disabled={isDisabled}
        />

        <div className={styles.actions}>
          {!isDisabled && (
            <button onClick={handleVerify} className={styles.verifyBtn}>
              Xác minh
            </button>
          )}
          <button onClick={handleClose} className={styles.cancelBtn}>
            {message.type === "success"
              ? `Đóng ${countdown > 0 ? `(${countdown})` : ""}`
              : "Hủy bỏ"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpPopup;
