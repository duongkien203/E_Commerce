import React from "react";
import styles from "../CSS/Popup.module.css";

const Popup = ({ message, onClose }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <p>{message}</p>
        <button onClick={onClose} className={styles.closeButton}>
          Đóng
        </button>
      </div>
    </div>
  );
};

export default Popup;
