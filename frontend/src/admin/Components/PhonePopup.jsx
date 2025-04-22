import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "../CSS/PhonePopup.module.css";
import OtpPopup from "./OtpPopup"; // Giả sử bạn cũng có OtpPopup cho phone
import UpdatePhonePopup from "./UpdatePhonePopup"; // Import UpdatePhonePopup

const PhonePopup = ({ onClose, accountId }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [showUpdatePhonePopup, setShowUpdatePhonePopup] = useState(false); // State cho UpdatePhonePopup
  const [phone, setPhone] = useState("");

  const formik = useFormik({
    initialValues: { phone: "" },
    validationSchema: Yup.object({
      phone: Yup.string()
        .matches(
          /^(?:\+?\d{1,3})?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/,
          "Số điện thoại không hợp lệ"
        )
        .required("Vui lòng nhập số điện thoại"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setMessage({ text: "", type: "" });

      try {
        const response = await fetch(
          "http://localhost/E_Commerce/backend/admin/api/VerifyAccountAndSendOTP.php", // Sử dụng cùng API
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              account_id: accountId,
              contact: values.phone, // Sử dụng phone thay vì email
            }),
          }
        );

        const data = await response.json();

        if (data.status === "success") {
          setMessage({ text: "Mã OTP đã được gửi", type: "success" });
          setPhone(values.phone); // Lưu số điện thoại để dùng cho xác minh OTP
          setTimeout(() => setShowOtpPopup(true), 1000); // Mở OtpPopup sau 1s
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
        "http://localhost/E_Commerce/backend/admin/api/VerifyOTPBeforeUpdate.php", // Sử dụng cùng API
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contact: phone, // Sử dụng số điện thoại đã lưu
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

  const handlePhoneChange = (e) => {
    let value = e.target.value;
    if (value.startsWith("0") && value.length >= 2 && /[1-9]/.test(value[1])) {
      value = "+84" + value.slice(1);
    }
    formik.setFieldValue("phone", value);
    formik.setFieldTouched("phone", true, false);
  };

  return (
    <>
      {!showOtpPopup && !showUpdatePhonePopup ? (
        <div className={styles.overlay}>
          <div className={`${styles.popup} ${styles.fadeIn}`}>
            <h2>Nhập số điện thoại trước đó của bạn</h2>
            <form onSubmit={formik.handleSubmit}>
              <input
                type="tel"
                placeholder="Nhập số điện thoại trước đó của bạn"
                {...formik.getFieldProps("phone")}
                className={
                  formik.touched.phone && formik.errors.phone
                    ? styles.errorInput
                    : styles.validInput
                }
                onBlur={formik.handleBlur}
                onChange={(e) => {
                  formik.setFieldValue("phone", e.target.value);
                  formik.setFieldTouched("phone", true, false);
                  handlePhoneChange(e);
                }}
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
              {formik.touched.phone && formik.errors.phone && (
                <div
                  className={`${styles.responseMessage} ${styles.errorMessage}`}
                >
                  {formik.errors.phone}
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
          redirectLink="update-phone" // Thay đổi redirectLink cho phone
          setShowUpdatePhonePopup={setShowUpdatePhonePopup} // Truyền prop để hiển thị UpdatePhonePopup
        />
      ) : (
        <UpdatePhonePopup
          onClose={() => {
            setShowUpdatePhonePopup(false);
            onClose(); // Đóng toàn bộ flow
          }}
          accountId={accountId}
        />
      )}
    </>
  );
};

export default PhonePopup;
