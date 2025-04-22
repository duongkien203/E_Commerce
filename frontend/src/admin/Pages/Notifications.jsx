import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import styles from "../CSS/Notifications.module.css";
import NotificationFormPopup from "../Components/NotificationFormPopup";
import ConfirmPopup from "../Components/ConfirmPopup";
import Popup from "../Components/Popup";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [isConfirmMultiDeleteOpen, setConfirmMultiDeleteOpen] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost/E_Commerce/backend/admin/api/GetNotifications.php"
      );
      if (response.data.status === "success") {
        const notificationsData = response.data.data;
        setNotifications(notificationsData);
        setSearchResults(notificationsData);
      } else {
        setErrorMessage("Không thể tải danh sách thông báo.");
      }
    } catch (error) {
      console.error("Lỗi tải thông báo:", error);
      setErrorMessage("Lỗi khi kết nối đến server.");
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]); // Thêm fetchNotifications vào dependency array

  const showPopup = (message) => {
    setPopupMessage(message);
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setPopupMessage("");
  };

  const handleOpenForm = (notification = null) => {
    setSelectedNotification(notification);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedNotification(null);
  };

  const handleOpenConfirm = (id) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
    setDeleteId(null);
  };

  const handleSubmitNotification = async (notificationData) => {
    const isEditing = !!notificationData.notification_id;
    const url = isEditing
      ? "http://localhost/E_Commerce/backend/admin/api/UpdateNotification.php"
      : "http://localhost/E_Commerce/backend/admin/api/AddNotification.php";

    try {
      const response = await axios({
        method: isEditing ? "PUT" : "POST",
        url,
        data: notificationData,
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.status === "success") {
        if (isEditing) {
          setSearchResults((prev) =>
            prev.map((notif) =>
              notif.notification_id === notificationData.notification_id
                ? { ...notif, ...notificationData }
                : notif
            )
          );
          setNotifications((prev) =>
            prev.map((notif) =>
              notif.notification_id === notificationData.notification_id
                ? { ...notif, ...notificationData }
                : notif
            )
          );
          showPopup("Sửa thông báo thành công");
        } else {
          const newNotification = {
            ...notificationData,
            notification_id: response.data.notification_id,
          };
          setSearchResults((prev) => [...prev, newNotification]);
          setNotifications((prev) => [...prev, newNotification]);
          showPopup("Thêm thông báo thành công");
        }
      } else {
        showPopup(response.data.message || "Đã xảy ra lỗi!");
      }
    } catch (error) {
      console.error("Lỗi thêm/sửa thông báo:", error);
      showPopup("Có lỗi xảy ra trong quá trình thực hiện.");
    }

    handleCloseForm();
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost/E_Commerce/backend/admin/api/DeleteNotification.php?notification_id=${deleteId}`
      );

      if (response.data.status === "success") {
        setSearchResults((prev) =>
          prev.filter((item) => item.notification_id !== deleteId)
        );
        setNotifications((prev) =>
          prev.filter((item) => item.notification_id !== deleteId)
        );
        showPopup("Xóa thông báo thành công");
      } else {
        showPopup(
          response.data.message || "Đã xảy ra lỗi trong quá trình xóa."
        );
      }
    } catch (error) {
      console.error("Lỗi xóa thông báo:", error);
      showPopup("Có lỗi xảy ra trong quá trình xóa.");
    }

    handleCloseConfirm();
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === searchResults.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(
        searchResults.map((notification) => notification.notification_id)
      );
    }
  };

  const handleSelectNotification = (notificationId) => {
    setSelectedNotifications((prevSelected) =>
      prevSelected.includes(notificationId)
        ? prevSelected.filter((id) => id !== notificationId)
        : [...prevSelected, notificationId]
    );
  };

  const handleMultiDeleteClick = () => {
    if (selectedNotifications.length === 0) {
      showPopup("Vui lòng chọn ít nhất một thông báo để xóa.");
      return;
    }
    setConfirmMultiDeleteOpen(true);
  };

  const handleConfirmMultiDelete = async () => {
    try {
      const response = await axios.post(
        "http://localhost/E_Commerce/backend/admin/api/DeleteMultipleNotifications.php",
        {
          notification_ids: selectedNotifications,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.status === "success") {
        setSearchResults((prev) =>
          prev.filter(
            (notification) =>
              !selectedNotifications.includes(notification.notification_id)
          )
        );
        setNotifications((prev) =>
          prev.filter(
            (notification) =>
              !selectedNotifications.includes(notification.notification_id)
          )
        );
        setSelectedNotifications([]);
        showPopup("Xóa các thông báo thành công");
      } else {
        showPopup(response.data.message || "Lỗi khi xóa các thông báo");
      }
    } catch (error) {
      console.error("Lỗi xóa nhiều thông báo:", error);
      showPopup("Có lỗi xảy ra trong quá trình xóa.");
    } finally {
      setConfirmMultiDeleteOpen(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchId(value);

    if (value) {
      const numericId = value;
      const foundNotification = notifications.find(
        (notification) => notification.notification_id === numericId
      );
      setSearchResults(foundNotification ? [foundNotification] : []);
      setErrorMessage(
        foundNotification ? "" : "Không tìm thấy thông báo với ID này."
      );
    } else {
      setSearchResults(notifications);
      setErrorMessage("");
    }
  };

  return (
    <div className={styles.notificationsContainer}>
      <h2>Danh Sách Thông Báo</h2>
      <div className={styles.headerActions}>
        <input
          type="text"
          placeholder="Tìm theo ID"
          value={searchId}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
        <div className={styles.buttonContainer}>
          <button className={styles.addButton} onClick={() => handleOpenForm()}>
            + Thêm Thông Báo
          </button>
          <button
            className={styles.deleteMultipleButton}
            onClick={handleMultiDeleteClick}
            disabled={selectedNotifications.length === 0}
          >
            Xóa
          </button>
        </div>
      </div>

      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

      {searchResults.length > 0 ? (
        <table className={styles.notificationsTable}>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={
                    searchResults.length > 0 &&
                    selectedNotifications.length === searchResults.length
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th>ID</th>
              <th>Tiêu đề</th>
              <th>Nội dung</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.map((notification) => (
              <tr key={notification.notification_id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedNotifications.includes(
                      notification.notification_id
                    )}
                    onChange={() =>
                      handleSelectNotification(notification.notification_id)
                    }
                  />
                </td>
                <td>{notification.notification_id}</td>
                <td>{notification.title}</td>
                <td>{notification.message}</td>
                <td>{notification.created_at}</td>
                <td className={styles.actions}>
                  <button
                    className={styles.edit}
                    onClick={() => handleOpenForm(notification)}
                  >
                    Sửa
                  </button>
                  <button
                    className={styles.delete}
                    onClick={() =>
                      handleOpenConfirm(notification.notification_id)
                    }
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.noData}>
          {searchId
            ? "Không tìm thấy thông báo với ID này."
            : "Không có thông báo nào để hiển thị."}
        </p>
      )}

      {isFormOpen && (
        <NotificationFormPopup
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          notificationData={selectedNotification}
          onSubmit={handleSubmitNotification}
        />
      )}
      {isConfirmOpen && (
        <ConfirmPopup
          isOpen={isConfirmOpen}
          onClose={handleCloseConfirm}
          onConfirm={handleDelete}
          message="Bạn có chắc chắn muốn xóa thông báo này không?"
        />
      )}
      {isConfirmMultiDeleteOpen && (
        <ConfirmPopup
          isOpen={isConfirmMultiDeleteOpen}
          onClose={() => setConfirmMultiDeleteOpen(false)}
          onConfirm={handleConfirmMultiDelete}
          message="Bạn có chắc chắn muốn xóa các thông báo đã chọn không?"
        />
      )}
      {isPopupVisible && <Popup message={popupMessage} onClose={closePopup} />}
    </div>
  );
};

export default Notifications;
