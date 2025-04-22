import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaShieldAlt } from "react-icons/fa";
import styles from "../CSS/VerifyLink.module.css";
import { useAuth } from "../Context/AuthContext";

function PhoneLink() {
  const [countdown, setCountdown] = useState(60); // Đếm ngược từ 60 giây
  const [showResendMessage, setShowResendMessage] = useState(false); // Điều khiển hiển thị thông báo
  const [phoneNumber, setPhoneNumber] = useState(""); // Lưu số điện thoại người dùng
  const navigate = useNavigate();

  const { accountId } = useAuth();

  // Lấy số điện thoại từ API khi có account_id
  useEffect(() => {
    if (accountId) {
      fetch(
        `http://localhost/E_Commerce/backend/admin/api/GeEmailPhoneById.php?columnName=phone_number&tableName=accounts&condition=account_id&id=${accountId}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            setPhoneNumber(data.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching phone number:", error);
        });
    }
  }, [accountId]); // Chỉ gọi API khi có account_id

  useEffect(() => {
    if (countdown === 0) {
      setShowResendMessage(true); // Sau khi đếm ngược xong, hiển thị thông báo
      return; // Dừng đếm ngược
    }

    const timer = setInterval(() => {
      setCountdown((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
    }, 1000);

    return () => clearInterval(timer); // Dọn dẹp interval khi component unmount
  }, [countdown]);

  const formatPhoneNumber = (number) => {
    if (!number) return "012********"; // Trường hợp không có số điện thoại

    const firstPart = number.substring(0, 3); // Lấy 3 ký tự đầu tiên
    const maskedPart = "*".repeat(number.length - 5); // Phần giữa thay bằng '*' (trừ đi 5 ký tự: 3 cho đầu và 2 cho cuối)
    const lastPart = number.substring(number.length - 2); // Lấy 2 ký tự cuối cùng

    return firstPart + maskedPart + lastPart;
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
        <p className={styles.verifyText}>Xác minh bằng số điện thoại</p>
        <p>
          Vui lòng nhấn vào liên kết xác thực đã được gửi đến số điện thoại của
          bạn.
          <br />
          {formatPhoneNumber(phoneNumber)}{" "}
          {/* Hiển thị số điện thoại đã được định dạng */}
        </p>
        {!showResendMessage ? (
          <p>Vui lòng chờ trong {countdown} giây để gửi lại.</p>
        ) : (
          <p>
            Bạn chưa nhận được?{" "}
            <button className={styles.resendButton}>Gửi lại liên kết</button>
          </p>
        )}
      </div>
    </div>
  );
}

export default PhoneLink;
