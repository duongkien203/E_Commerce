import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
import Popup from "../Components/Popup";
import PhonePopup from "../Components/PhonePopup";
import EmailPopup from "../Components/EmailPopup";
import UpdatePhonePopup from "../Components/UpdatePhonePopup";
import UpdateEmailPopup from "../Components/UpdateEmailPopup";
import { FaUserCircle } from "react-icons/fa";
import styles from "../CSS/Profile.module.css";

const Profile = () => {
  const { accountId } = useAuth();

  const [userData, setUserData] = useState({
    avatar: "",
    fullName: "",
    phoneNumber: "",
    address: "",
    email: "",
  });

  const [previewAvatar, setPreviewAvatar] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPhonePopup, setShowPhonePopup] = useState(false);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [showUpdatePhonePopup, setShowUpdatePhonePopup] = useState(false); // Để xử lý khi rỗng
  const [showUpdateEmailPopup, setShowUpdateEmailPopup] = useState(false); // Để xử lý khi rỗng

  useEffect(() => {
    if (accountId) {
      axios
        .get(
          `http://localhost/E_Commerce/backend/user/api/GetDataById.php?table=accounts&columnName=account_id&id=${accountId}`
        )
        .then((response) => {
          if (response.data.status === "success") {
            const data = response.data.data;
            setUserData({
              avatar: data.avatar || "",
              fullName: data.full_name || "",
              phoneNumber: data.phone_number || "",
              address: data.address || "",
              email: data.email || "",
            });
            setPreviewAvatar(data.avatar || "");
          } else {
            console.error("Lỗi khi lấy dữ liệu người dùng");
          }
        })
        .catch((error) => {
          console.error("Có lỗi xảy ra khi gọi API:", error);
        });
    }
  }, [accountId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("id", accountId);
    formData.append("fullName", userData.fullName);
    formData.append("address", userData.address);

    if (selectedFile) {
      formData.append("avatar", selectedFile);
    }

    try {
      const response = await axios.post(
        "http://localhost/E_Commerce/backend/user/api/UpdateProfile.php",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.status === "success") {
        setPopupMessage("Thông tin đã được cập nhật thành công");
        setShowPopup(true);
        setUserData({
          ...userData,
          avatar: selectedFile
            ? URL.createObjectURL(selectedFile)
            : userData.avatar,
        });
      } else {
        console.error("Lỗi khi cập nhật thông tin:", response.data.message);
      }
    } catch (error) {
      console.error("Có lỗi xảy ra khi gọi API:", error);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setShowPhonePopup(false);
    setShowEmailPopup(false);
    setShowUpdatePhonePopup(false);
    setShowUpdateEmailPopup(false);
  };

  const handleEditClick = (field) => {
    if (field === "phoneNumber") {
      if (userData.phoneNumber) {
        // Nếu đã có số điện thoại, mở PhonePopup để xác minh
        setShowPhonePopup(true);
      } else {
        // Nếu chưa có, mở UpdatePhonePopup để nhập mới
        setShowUpdatePhonePopup(true);
      }
    } else if (field === "email") {
      if (userData.email) {
        // Nếu đã có email, mở EmailPopup để xác minh
        setShowEmailPopup(true);
      } else {
        // Nếu chưa có, mở UpdateEmailPopup để nhập mới
        setShowUpdateEmailPopup(true);
      }
    }
  };

  const handlePhoneSave = (newPhone) => {
    setUserData({ ...userData, phoneNumber: newPhone });
    setShowPhonePopup(false);
  };

  const handleEmailSave = (newEmail) => {
    setUserData({ ...userData, email: newEmail });
    setShowEmailPopup(false);
  };

  const handleUpdatePhoneSave = (newPhone) => {
    setUserData({ ...userData, phoneNumber: newPhone });
    setShowUpdatePhonePopup(false);
  };

  const handleUpdateEmailSave = (newEmail) => {
    setUserData({ ...userData, email: newEmail });
    setShowUpdateEmailPopup(false);
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileLeft}>
        {previewAvatar ? (
          <img src={previewAvatar} alt="Avatar" className={styles.avatar} />
        ) : (
          <FaUserCircle className={styles.defaultAvatar} />
        )}
        <label htmlFor="fileInput" className={styles.customFileUpload}>
          Thay đổi
        </label>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          style={{ display: "none" }}
        />
      </div>

      <div className={styles.profileRight}>
        <div className={styles.formGroup}>
          <label htmlFor="fullName">Họ và tên:</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={userData.fullName}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="address">Địa chỉ:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={userData.address}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phoneNumber">Số điện thoại:</label>
          <div className={styles.inputWithButton}>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={userData.phoneNumber}
              disabled
            />
            <button onClick={() => handleEditClick("phoneNumber")}>
              Thay đổi
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <div className={styles.inputWithButton}>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
              disabled
            />
            <button onClick={() => handleEditClick("email")}>Thay đổi</button>
          </div>
        </div>

        <button className={styles.saveButton} onClick={handleSave}>
          Lưu thông tin
        </button>
      </div>

      {showPopup && <Popup message={popupMessage} onClose={closePopup} />}
      {showPhonePopup && (
        <PhonePopup
          accountId={accountId}
          onClose={() => setShowPhonePopup(false)}
          onSave={handlePhoneSave}
        />
      )}

      {showEmailPopup && (
        <EmailPopup
          accountId={accountId}
          onClose={() => setShowEmailPopup(false)}
          onSave={handleEmailSave}
        />
      )}

      {showUpdatePhonePopup && (
        <UpdatePhonePopup
          accountId={accountId}
          onClose={() => setShowUpdatePhonePopup(false)}
          onSave={handleUpdatePhoneSave}
        />
      )}

      {showUpdateEmailPopup && (
        <UpdateEmailPopup
          accountId={accountId}
          onClose={() => setShowUpdateEmailPopup(false)}
          onSave={handleUpdateEmailSave}
        />
      )}
    </div>
  );
};

export default Profile;
