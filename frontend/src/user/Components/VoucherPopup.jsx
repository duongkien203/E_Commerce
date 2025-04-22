import React, { useState } from "react";
import styles from "../CSS/VoucherPopup.module.css";

// const formatDate = (dateStr) => {
//   const date = new Date(dateStr);
//   return `${date
//     .getDate()
//     .toString()
//     .padStart(2, "0")}-${(date.getMonth() + 1)
//     .toString()
//     .padStart(2, "0")}-${date.getFullYear()}`;
// };

const getRemainingTime = (endDate) => {
  const now = new Date();
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  const diff = end - now;

  if (diff <= 0) {
    return { display: "Hết hạn", isExpired: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  return { display: `Còn ${days} ngày ${hours} giờ`, isExpired: false };
};

const VoucherPopup = ({
  isOpen,
  onClose,
  discountCodes,
  setSelectedVoucher,
}) => {
  const [selectedVoucherId, setSelectedVoucherId] = useState(null);

  const handleConfirmClick = () => {
    const selectedVoucher = discountCodes.find(
      (voucher) => voucher.discount_id === selectedVoucherId
    );

    if (selectedVoucher) {
      setSelectedVoucher(selectedVoucher);
    }

    onClose();
  };

  if (!isOpen) return null;

  const renderVoucherList = () => (
    <ul className={styles.voucherList}>
      {discountCodes
        .filter((voucher) => voucher.status !== "not_yet_active")
        .map((voucher, index) => {
          const { display: formattedEndDate, isExpired } = getRemainingTime(
            voucher.end_date
          );

          return (
            <li
              key={voucher.discount_id || `voucher-${index}`}
              className={`${styles.voucherItem} ${
                isExpired || voucher.status === "expired"
                  ? styles.disabledVoucher
                  : ""
              }`}
            >
              <img src="/images/frontend_icons/voucher.png" alt="voucher" />
              <label className={styles.voucherLabel}>
                <p>Giảm {voucher.discount_value}%</p>
                <span>HSD: {formattedEndDate}</span>
                <input
                  type="radio"
                  name="voucher"
                  value={voucher.discount_id}
                  checked={selectedVoucherId === voucher.discount_id}
                  disabled={isExpired || voucher.status === "expired"}
                  onChange={() =>
                    setSelectedVoucherId(
                      !isExpired && voucher.status !== "expired"
                        ? voucher.discount_id
                        : selectedVoucherId
                    )
                  }
                  onClick={(e) => {
                    if (
                      selectedVoucherId === voucher.discount_id &&
                      !isExpired &&
                      voucher.status !== "expired"
                    ) {
                      setSelectedVoucherId(null);
                      e.target.checked = false;
                    }
                  }}
                />
              </label>
            </li>
          );
        })}
    </ul>
  );

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <h2>Chọn mã giảm giá</h2>
        {discountCodes.length > 0 ? (
          renderVoucherList()
        ) : (
          <p>Hiện tại không có voucher nào!</p>
        )}

        <div className={styles.popupActions}>
          <button className={styles.backBtn} onClick={onClose}>
            Trở lại
          </button>
          <button className={styles.confirmBtn} onClick={handleConfirmClick}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoucherPopup;
