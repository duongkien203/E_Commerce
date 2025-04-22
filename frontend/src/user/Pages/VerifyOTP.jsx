import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaShieldAlt } from "react-icons/fa";
import styles from "../CSS/VerifyLink.module.css";
import { useAuth } from "../Context/AuthContext";

function VerifyOTP() {
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOTPChanged, setIsOTPChanged] = useState(false); // State to check if OTP is changed
  const navigate = useNavigate();
  const { accountId } = useAuth();

  // Validation schema
  const validationSchema = Yup.object({
    otp: Yup.string()
      .length(6, "OTP phải bao gồm 6 kí tự")
      .required("Vui lòng nhập OTP"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema,
    onSubmit: (values) => {
      handleVerifyOTP(values.otp);
    },
  });

  // Enable submit button when OTP is changed
  useEffect(() => {
    setIsSubmitting(!isOTPChanged); // Disable button if OTP is not changed
  }, [isOTPChanged]);

  // Handle OTP change
  const handleOTPChange = (e) => {
    formik.handleChange(e);
    setIsOTPChanged(true);
  };

  // Xử lý xác thực OTP
  const handleVerifyOTP = (otp) => {
    setMessage({ text: "", type: "" }); // Xóa thông báo cũ
    setIsSubmitting(true); // Disable the button
    fetch("http://localhost/E_Commerce/backend/user/api/VerifyOTP.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ account_id: accountId, otp: otp }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setMessage({ text: "Xác thực thành công!", type: "success" });
          setTimeout(() => navigate(`/change-password/${otp}`), 2000); // Chuyển hướng sau 2s
        } else {
          setMessage({ text: "OTP không chính xác!", type: "error" });
          console.log("Response Data:", data); // Log toàn bộ dữ liệu trả về
        }
        setIsSubmitting(false); // Enable the button
        setIsOTPChanged(false); // Reset the OTP changed state
      })
      .catch((error) => {
        setMessage({ text: "Lỗi khi xác thực OTP!", type: "error" });
        console.error("Error:", error);
        setIsSubmitting(false); // Enable the button
        setIsOTPChanged(false); // Reset the OTP changed state
      });
  };

  return (
    <div className={styles.verifyContainer} style={{ width: "350px" }}>
      <div className={styles.verify}>
        <div className={styles.arrowBack} onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </div>
        <div className={styles.securityIcon}>
          <FaShieldAlt />
        </div>
        <p className={styles.verifyText}>Xác thực OTP</p>

        {/* Hiển thị thông báo kết quả */}
        {message.text && (
          <div className={styles[message.type]}>{message.text}</div>
        )}

        {/* Ô nhập OTP */}
        <form onSubmit={formik.handleSubmit}>
          <div
            className={`${styles.formGroup} ${
              formik.touched.otp && formik.errors.otp ? styles.invalid : ""
            }`}
          >
            <input
              type="text"
              id="otp"
              name="otp"
              placeholder="Nhập mã OTP"
              autoComplete="one-time-code"
              value={formik.values.otp}
              onChange={handleOTPChange} // Use the new handler
              onBlur={formik.handleBlur}
            />
            <span className={styles.formMessage}>
              {formik.touched.otp && formik.errors.otp}
            </span>
          </div>

          {/* Nút xác thực OTP */}
          <button
            className={styles.resendButton}
            type="submit"
            disabled={isSubmitting}
          >
            Xác thực OTP
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerifyOTP;
