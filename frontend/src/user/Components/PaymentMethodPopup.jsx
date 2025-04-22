import React, { useState, useEffect } from "react";
import styles from "../CSS/PaymentMethodPopup.module.css"; // CSS riêng cho popup

const PaymentMethodPopup = ({ isOpen, onClose, defaultMethod, onSelect }) => {
  const [tempMethod, setTempMethod] = useState(defaultMethod || "COD");

  useEffect(() => {
    if (isOpen) {
      setTempMethod(defaultMethod || "COD");
    }
  }, [isOpen, defaultMethod]);

  if (!isOpen) return null;

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <h3>Chọn phương thức thanh toán</h3>
        <div className={styles.paymentOptions}>
          <label>
            <input
              type="radio"
              name="payment"
              value="COD"
              checked={tempMethod === "COD"}
              onChange={() => setTempMethod("COD")}
            />
            Thanh toán khi nhận hàng (COD)
          </label>

          <label>
            <input
              type="radio"
              name="payment"
              value="vnpay"
              checked={tempMethod === "vnpay"}
              onChange={() => setTempMethod("vnpay")}
            />
            Thanh toán bằng VNPAY
          </label>

          <label>
            <input
              type="radio"
              name="payment"
              value="momo"
              checked={tempMethod === "momo"}
              onChange={() => setTempMethod("momo")}
            />
            Thanh toán bằng MoMo
          </label>
        </div>

        <div className={styles.popupButtons}>
          <button onClick={onClose}>Hủy</button>
          <button
            onClick={() => {
              onSelect(tempMethod);
              onClose();
            }}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodPopup;
