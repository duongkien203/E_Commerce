import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "../CSS/EmailPopup.module.css";
import OtpPopup from "./OtpPopup";
import UpdateEmailPopup from "./UpdateEmailPopup"; // Import UpdateEmailPopup

const EmailPopup = ({ onClose, accountId }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [showUpdateEmailPopup, setShowUpdateEmailPopup] = useState(false); // Thêm state mới
  const [email, setEmail] = useState("");

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Email không hợp lệ")
        .required("Vui lòng nhập email"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setMessage({ text: "", type: "" });

      try {
        const response = await fetch(
          "http://localhost/E_Commerce/backend/admin/api/VerifyAccountAndSendOTP.php",
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              account_id: accountId,
              contact: values.email,
            }),
          }
        );

        const data = await response.json();

        if (data.status === "success") {
          setMessage({ text: "Mã OTP đã được gửi", type: "success" });
          setEmail(values.email);
          setTimeout(() => setShowOtpPopup(true), 1000);
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

  const verifyOtp = async (otp) => {
    try {
      const response = await fetch(
        "http://localhost/E_Commerce/backend/admin/api/VerifyOTPBeforeUpdate.php",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contact: email,
            otp: otp,
          }),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      return { status: "error", message: "Lỗi khi xác minh OTP." };
    }
  };

  return (
    <>
      {!showOtpPopup && !showUpdateEmailPopup ? (
        <div className={styles.overlay}>
          <div className={`${styles.popup} ${styles.fadeIn}`}>
            <h2>Nhập email trước đó của bạn</h2>
            <form onSubmit={formik.handleSubmit}>
              <input
                type="text"
                placeholder="Nhập email trước đó của bạn"
                {...formik.getFieldProps("email")}
                className={
                  formik.touched.email && formik.errors.email
                    ? styles.errorInput
                    : styles.inputNormal
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
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

              {formik.touched.email && formik.errors.email && (
                <div
                  className={`${styles.responseMessage} ${styles.errorMessage}`}
                >
                  {formik.errors.email}
                </div>
              )}

              <button type="submit" disabled={loading}>
                {loading ? "Đang gửi..." : "Gửi"}
              </button>
            </form>

            <span className={styles.close} onClick={onClose}>
              ×
            </span>
          </div>
        </div>
      ) : showOtpPopup ? (
        <OtpPopup
          isOpen={showOtpPopup}
          onClose={() => setShowOtpPopup(false)} // Chỉ đóng OtpPopup
          onVerify={verifyOtp}
          setParentMessage={setMessage}
          redirectLink="update-email"
          setShowUpdateEmailPopup={setShowUpdateEmailPopup} // Truyền prop để hiển thị UpdateEmailPopup
        />
      ) : (
        <UpdateEmailPopup
          onClose={() => {
            setShowUpdateEmailPopup(false);
            onClose(); // Đóng toàn bộ flow
          }}
          accountId={accountId}
        />
      )}
    </>
  );
};

export default EmailPopup;
