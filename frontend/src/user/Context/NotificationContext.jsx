import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const { accountId } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);

  // Dùng useCallback để tránh tạo lại hàm mỗi lần re-render
  const fetchNotifications = useCallback(async () => {
    try {
      const response = await axios.post(
        "http://localhost/E_Commerce/backend/user/api/GetNotifications.php",
        { id: accountId }
      );
      if (
        response.data.status === "success" &&
        Array.isArray(response.data.data)
      ) {
        setNotifications(response.data.data);
      } else {
        setNotifications([]);
      }
      setHasFetched(true);
    } catch (error) {
      console.error("Lỗi khi lấy thông báo:", error);
      setNotifications([]);
      setHasFetched(true);
    }
  }, [accountId]); // Chỉ phụ thuộc vào `accountId`

  useEffect(() => {
    if (accountId && !hasFetched) {
      fetchNotifications();
    }
  }, [accountId, hasFetched, fetchNotifications]); // Đưa fetchNotifications vào dependencies

  return (
    <NotificationContext.Provider value={{ notifications, fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
