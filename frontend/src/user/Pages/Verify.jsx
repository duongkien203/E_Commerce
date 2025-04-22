import React from "react";
import { Link } from "react-router-dom";
import { FaShieldAlt } from "react-icons/fa";
import styles from "../CSS/Verify.module.css";

function Verify() {
  return (
    <div className={styles.verifyContainer}>
      <div className={styles.verify}>
        <div className={styles.securityIcon}>
          <FaShieldAlt />
        </div>
        <p>
          Để tăng cường bảo mật cho tài khoản của bạn, hãy xác minh thông tin
          bằng một trong những cách sau.
        </p>
        <Link to="email-link" className={styles.verifyButton}>
          <i className="fas fa-envelope"></i> Xác minh bằng địa chỉ Email
        </Link>
        <Link to="phone-link" className={styles.verifyButton}>
          <i className="fas fa-phone-alt"></i> Xác minh bằng số điện thoại
        </Link>
      </div>
    </div>
  );
}

export default Verify;
