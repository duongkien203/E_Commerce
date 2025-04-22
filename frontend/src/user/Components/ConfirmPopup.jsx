import React from "react";
import styles from "../CSS/ConfirmPopup.module.css";

const ConfirmPopup = ({ onClose, onConfirm, message }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <p>{message}</p>
        <div className={styles.buttonGroup}>
          <button className={styles.confirmBtn} onClick={onConfirm}>
            Xác nhận
          </button>
          <button className={styles.cancelBtn} onClick={onClose}>
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopup;
