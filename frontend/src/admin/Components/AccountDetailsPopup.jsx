import React from "react";
import styles from "../CSS/AccountDetailsPopup.module.css";

const AccountDetailsPopup = ({ isOpen, onClose, account }) => {
  if (!isOpen || !account) return null;

  const getRoleInVietnamese = (role) => {
    switch (role) {
      case "admin":
        return "Quản trị viên";
      case "manager":
        return "Quản lý";
      case "user":
        return "Khách hàng";
      default:
        return role;
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <button className={styles.closeButton} onClick={onClose}>
          ✖
        </button>
        <div className={styles.content}>
          <h2 className={styles.title}>Chi tiết Tài khoản</h2>
          <div className={styles.avatarContainer}>
            <img
              src={account.avatar}
              alt={`${account.username}'s avatar`}
              className={styles.avatar}
            />
          </div>
          <div className={styles.details}>
            <p className={styles.detailItem}>
              <strong>ID Tài khoản:</strong> <span>{account.account_id}</span>
            </p>
            <p className={styles.detailItem}>
              <strong>Tên đăng nhập:</strong> <span>{account.username}</span>
            </p>
            <p className={styles.detailItem}>
              <strong>Họ và tên:</strong> <span>{account.full_name}</span>
            </p>
            <p className={styles.detailItem}>
              <strong>Số điện thoại:</strong>{" "}
              <span>{account.phone_number}</span>
            </p>
            <p className={styles.detailItem}>
              <strong>Địa chỉ:</strong> <span>{account.address}</span>
            </p>
            <p className={styles.detailItem}>
              <strong>Email:</strong> <span>{account.email}</span>
            </p>
            <p className={styles.detailItem}>
              <strong>Vai trò:</strong>{" "}
              <span>{getRoleInVietnamese(account.role_name)}</span>
            </p>
            <p className={styles.detailItem}>
              <strong>Trạng thái:</strong>{" "}
              <span>
                {account.status === "active" ? "Hoạt động" : "Đã khóa"}
              </span>
            </p>
          </div>
          <button className={styles.closePopupButton} onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountDetailsPopup;
