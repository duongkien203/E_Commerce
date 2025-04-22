import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

// Tạo Context
const AuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [accountId, _setAccountId] = useState(() => {
    return localStorage.getItem("accountIdAdmin") || null;
  });
  const [avatar, setAvatar] = useState(null);
  const [fullName, setFullName] = useState(null);

  // Hàm setAccountId
  const setAccountId = (accountId) => {
    _setAccountId(accountId);
    if (accountId) {
      localStorage.setItem("accountIdAdmin", accountId);
    } else {
      localStorage.removeItem("accountIdAdmin");
    }
  };

  // Hàm đăng xuất
  const logout = () => {
    setAccountId(null); // Cập nhật state về null
    setAvatar(null);
    setFullName(null);
  };

  // Gọi API để lấy thông tin người dùng khi accountId thay đổi
  useEffect(() => {
    if (accountId) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(
            `http://localhost/E_Commerce/backend/admin/api/GetDataAdmin.php`,
            {
              params: {
                id: accountId,
              },
            }
          );
          if (response.data.status === "success") {
            const userData = response.data.data;
            setAvatar(userData.avatar);
            setFullName(userData.full_name);
          }
        } catch (error) {
          console.error("Lỗi khi gọi API:", error);
        }
      };

      fetchUserData();
    } else {
      setAvatar(null);
      setFullName(null);
    }
  }, [accountId]);

  return (
    <AuthContext.Provider
      value={{
        accountId,
        avatar,
        fullName,
        setAccountId,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
