import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import styles from "../CSS/OrderResult.module.css";

const OrderResult = () => {
  const { accountId } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Xác định loại thanh toán (MoMo hoặc VNPay)
  const isMoMo = searchParams.has("resultCode");
  const isVNPay = searchParams.has("vnp_ResponseCode");

  // Xử lý dữ liệu cho MoMo
  let resultCode, message, amount, orderId, transId, payType;
  if (isMoMo) {
    resultCode = searchParams.get("resultCode");
    message = searchParams.get("message");
    amount = searchParams.get("amount");
    orderId = searchParams.get("orderId");
    transId = searchParams.get("transId");
    payType = searchParams.get("payType") || "MoMo";
  }

  // Xử lý dữ liệu cho VNPay
  if (isVNPay) {
    resultCode = searchParams.get("vnp_ResponseCode");
    message =
      resultCode === "00" ? "Giao dịch thành công" : "Giao dịch thất bại";
    amount = searchParams.get("vnp_Amount") / 100; // VNPay trả về số tiền nhân 100
    orderId = searchParams.get("vnp_TxnRef");
    transId = searchParams.get("vnp_TransactionNo");
    payType = searchParams.get("vnp_CardType") || "VNPay";
  }

  const [showPopup, setShowPopup] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [email, setEmail] = useState(null);

  // Gọi API lấy email khi component mount
  useEffect(() => {
    fetch(
      `http://localhost/E_Commerce/backend/user/api/GetEmailByAccountId.php?account_id=${accountId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setEmail(data.data); // Lưu email vào state
        } else {
          console.error("❌ Lỗi lấy email:", data);
        }
      })
      .catch((error) => {
        console.error("❌ Lỗi gọi API lấy email:", error);
      });
  }, [accountId]);

  // Hiển thị thông báo trạng thái
  useEffect(() => {
    if (resultCode === "0" || resultCode === "00") {
      setStatusMessage(
        `🎉 Thanh toán thành công!\nĐơn hàng #${orderId} với số tiền ${amount
          .toString()
          .replace(
            /\B(?=(\d{3})+(?!\d))/g,
            "."
          )} VND.\n Trạng thái thanh toán đã được cập nhật.`
      );
    } else if (resultCode === "7002") {
      setStatusMessage(`⏳ Giao dịch đang được xử lý. Vui lòng kiểm tra sau.`);
    } else {
      setStatusMessage(`❌ Thanh toán thất bại!\nLỗi: ${message}`);
    }
  }, [resultCode, message, orderId, amount]);

  // Gửi request cập nhật trạng thái khi thanh toán thành công
  useEffect(() => {
    if (resultCode === "0" || resultCode === "00") {
      fetch(
        "http://localhost/E_Commerce/backend/user/api/UpdatePaymentStatus.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            invoiceId: orderId,
            status: "paid",
            amount: amount,
            email: email, // Gửi email lấy từ API
          }),
        }
      )
        .then((response) => response.json())
        .catch((error) => {
          console.error("❌ Lỗi cập nhật thanh toán:", error);
        });
    }
  }, [resultCode, orderId, amount, email]);

  const closePopup = () => {
    setShowPopup(false);
    navigate("/");
  };

  return (
    showPopup && (
      <div className={styles.overlay}>
        <div className={styles.popup}>
          <button className={styles.closeBtn} onClick={closePopup}>
            ×
          </button>
          <h2 className={styles.title}>🛒 Kết quả thanh toán</h2>
          <p className={styles.statusMessage}>{statusMessage}</p>
          {(resultCode === "0" || resultCode === "00") && (
            <p className={styles.transaction}>
              Mã giao dịch: <strong>{transId}</strong>
            </p>
          )}
          <p className={styles.paymentMethod}>
            Phương thức thanh toán: <strong>{payType}</strong>
          </p>
          <button className={styles.confirmBtn} onClick={closePopup}>
            OK
          </button>
        </div>
      </div>
    )
  );
};

export default OrderResult;
