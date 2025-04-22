import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import { showToast } from "../Components/ToastProvider";
import styles from "../CSS/Notifications.module.css";

// Hàm tính thời gian theo kiểu "X ngày trước"
// const timeAgo = (dateString) => {
//   const now = new Date();
//   const createdDate = new Date(dateString);
//   const diffTime = Math.abs(now - createdDate);
//   const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

//   if (diffDays === 0) return "Hôm nay";
//   if (diffDays === 1) return "Hôm qua";
//   return `${diffDays} ngày trước`;
// };

const formatTimeAgo = (timestamp) => {
  const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
  if (seconds < 60) return `${seconds} giây trước`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
};

const Notifications = () => {
  const { accountId } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!accountId) return;

    axios
      .post(
        "http://localhost/E_Commerce/backend/user/api/GetNotifications.php",
        {
          id: accountId,
        }
      )
      .then((response) => {
        if (
          response.data.status === "success" &&
          Array.isArray(response.data.data)
        ) {
          setNotifications(response.data.data);
        } else {
          setNotifications([]);
          showToast("error", "Không thể lấy danh sách thông báo");
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông báo:", error);
        setNotifications([]);
        showToast("error", "Lỗi kết nối đến server");
      });
  }, [accountId]);

  return (
    <div className={styles.notificationsContainer}>
      <h2>📢 Thông báo</h2>

      {notifications.length > 0 ? (
        <ul className={styles.notificationList}>
          {[...notifications] // Tạo bản sao để không thay đổi mảng gốc
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Sắp xếp giảm dần theo created_at
            .map((notification) => (
              <li
                key={notification.notification_id}
                className={styles.notificationItem}
              >
                <span className={styles.notificationType}>🔔</span>
                <div className={styles.notificationContent}>
                  <h3 className={styles.title}>{notification.title}</h3>
                  <p className={styles.message}>{notification.message}</p>
                  <span className={styles.time}>
                    {formatTimeAgo(notification.created_at)}
                  </span>
                </div>
              </li>
            ))}
        </ul>
      ) : (
        <p className={styles.noNotifications}>Không có thông báo nào.</p>
      )}
    </div>
  );
};

export default Notifications;
