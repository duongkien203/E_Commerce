import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../CSS/Address.module.css";
import { useAuth } from "../Context/AuthContext"; // Lấy accountId từ Auth
import { showToast } from "../Components/ToastProvider"; // Thông báo lỗi
import AddressFormPopup from "../Components/AddressFormPopup"; // Import popup
import ConfirmPopup from "../Components/ConfirmPopup"; // Popup xác nhận

const Address = () => {
  const { accountId } = useAuth(); // Lấy accountId của người dùng
  const [addresses, setAddresses] = useState([]); // Danh sách địa chỉ
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Trạng thái mở popup
  const [selectedAddress, setSelectedAddress] = useState(null); // Lưu địa chỉ đang chọn để chỉnh sửa
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // Popup xác nhận
  const [deleteAddressId, setDeleteAddressId] = useState(null); // Lưu ID địa chỉ cần xóa

  // Gọi API lấy danh sách địa chỉ theo accountId
  useEffect(() => {
    if (!accountId) return;

    axios
      .post(
        "http://localhost/E_Commerce/backend/user/api/GetAllAddresses.php",
        {
          id: accountId,
        }
      )
      .then((response) => {
        if (response.data.data.status === "success") {
          // Sắp xếp trước khi set state
          const sortedAddresses = response.data.data.data.sort(
            (a, b) => b.address_default - a.address_default
          );
          setAddresses(sortedAddresses);
        } else {
          setAddresses([]);
          showToast("warning", "Không có địa chỉ nào");
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy địa chỉ:", error);
        setAddresses([]);
        showToast("error", "Lỗi kết nối đến server");
      });
  }, [accountId]);

  // Mở popup để thêm mới địa chỉ
  const handleAddAddress = () => {
    setSelectedAddress(null); // Đảm bảo không có dữ liệu cũ khi thêm mới
    setIsPopupOpen(true);
  };

  // Mở popup để chỉnh sửa địa chỉ
  const handleEditAddress = (address) => {
    setSelectedAddress(address);
    setIsPopupOpen(true);
  };

  // Đóng popup
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleDeleteAddress = (addressId) => {
    setDeleteAddressId(addressId);
    setIsConfirmOpen(true); // Mở popup xác nhận
  };

  const confirmDeleteAddress = () => {
    if (!deleteAddressId) return;

    axios
      .post("http://localhost/E_Commerce/backend/user/api/DeleteAddress.php", {
        id: accountId,
        address_id: deleteAddressId,
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.status === "success") {
          showToast("success", "Đã xóa địa chỉ thành công");
          setAddresses(
            addresses.filter((addr) => addr.address_id !== deleteAddressId)
          );
        } else {
          showToast("error", "Xóa địa chỉ thất bại");
        }
      })
      .catch((error) => {
        console.error("Lỗi khi xóa địa chỉ:", error);
        showToast("error", "Lỗi kết nối đến server");
      });

    setIsConfirmOpen(false);
  };

  return (
    <div className={styles.addressContainer}>
      <h2>Địa chỉ của tôi</h2>
      <button className={styles.addButton} onClick={handleAddAddress}>
        + Thêm địa chỉ mới
      </button>

      <div className={styles.addressList}>
        {addresses.length === 0 ? (
          <p>Không có địa chỉ nào!</p>
        ) : (
          addresses.map((addr) => (
            <div key={addr.address_id} className={styles.addressItem}>
              <p>
                <strong>Họ tên:</strong> {addr.contact_name}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {addr.contact_phone}
              </p>
              <p>
                <strong>Địa chỉ:</strong> {addr.address_details}, {addr.address}{" "}
              </p>
              <div className={styles.actions}>
                <button
                  className={styles.editButton}
                  onClick={() => handleEditAddress(addr)}
                >
                  Chỉnh sửa
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteAddress(addr.address_id)}
                >
                  Xóa
                </button>
              </div>
              {addr.address_default === 1 && (
                <div className={styles.isDefault}>
                  <span>Mặc định</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Popup thêm/sửa địa chỉ */}
      {isPopupOpen && (
        <AddressFormPopup
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          fullAddress={selectedAddress}
          accountId={accountId}
          setAllAddress={setAddresses}
        />
      )}

      {/* Popup xác nhận xóa địa chỉ */}
      {isConfirmOpen && (
        <ConfirmPopup
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={confirmDeleteAddress}
          message="Bạn có chắc chắn muốn xóa địa chỉ này?"
        />
      )}
    </div>
  );
};

export default Address;
