import React, { useEffect, useState } from "react";
import styles from "../CSS/AddressPopup.module.css";
import { useAuth } from "../Context/AuthContext";
import { showToast } from "../Components/ToastProvider";
import AddressFormPopup from "./AddressFormPopup"; // Import form popup

const AddressPopup = ({ isOpen, onClose, allAddress, setAllAddress }) => {
  const { accountId } = useAuth();
  const [addresses, setAddresses] = useState([]);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isParentOpen, setIsParentOpen] = useState(true);
  const [isChildrenOpen, setIsChildrenOpen] = useState(false);

  useEffect(() => {
    setAddresses(allAddress);
  }, [allAddress]);

  // Cập nhật danh sách địa chỉ khi `allAddress` thay đổi, đồng thời sắp xếp địa chỉ mặc định lên đầu
  useEffect(() => {
    if (allAddress.length > 0) {
      const sortedAddresses = [...allAddress].sort(
        (a, b) => b.address_default - a.address_default
      );
      setAddresses(sortedAddresses);
    }
  }, [allAddress]);

  // Khi `isOpen` thay đổi, đảm bảo popup chính hiển thị
  useEffect(() => {
    if (isOpen) {
      setIsParentOpen(true);
      setIsChildrenOpen(false);
    }
  }, [isOpen]);

  // Cập nhật danh sách địa chỉ khi `allAddress` thay đổi

  const handleAddAddress = () => {
    setSelectedAddress(null); // Reset khi thêm mới
    setIsChildrenOpen(true);
    setIsParentOpen(false);
  };

  const handleEditAddress = (address) => {
    setSelectedAddress(address); // Gán địa chỉ cần chỉnh sửa
    setIsChildrenOpen(true);
    setIsParentOpen(false);
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      const response = await fetch(
        "http://localhost/E_Commerce/backend/user/api/SetDefaultAddress.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: accountId,
            addressId: addressId,
          }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        // Cập nhật lại danh sách địa chỉ để phản ánh thay đổi
        setAllAddress((prevAddresses) =>
          prevAddresses.map((addr) => ({
            ...addr,
            address_default: addr.address_id === addressId ? 1 : 0,
          }))
        );
      } else {
        showToast("error", "Lỗi khi đặt địa chỉ mặc định");
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  const handleBackToPopup = () => {
    setIsChildrenOpen(false);
    setIsParentOpen(true);
  };

  const handleClose = () => {
    setIsChildrenOpen(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      {isParentOpen && (
        <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
          <h2>Danh sách địa chỉ</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ✖
          </button>
          <button className={styles.addBtn} onClick={handleAddAddress}>
            ➕ Thêm địa chỉ
          </button>

          {addresses.length === 0 ? (
            <p>Không có địa chỉ nào!</p>
          ) : (
            <ul className={styles.addressList}>
              {addresses.map((addr) => (
                <li key={addr.address_id} className={styles.addressItem}>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="selectedAddress"
                      checked={addr.address_default === 1}
                      onChange={() => handleSetDefaultAddress(addr.address_id)}
                    />
                    <div>
                      <p className={styles.isDefault}>
                        <strong>{addr.contact_name}</strong> -{" "}
                        {addr.contact_phone}
                        {addr.address_default === 1 && <span>Mặc định</span>}
                      </p>
                      <p>
                        {addr.address_details}, {addr.address}
                      </p>
                    </div>
                  </label>
                  <button
                    className={styles.editBtn}
                    onClick={(e) => {
                      e.stopPropagation(); // Ngăn không làm ảnh hưởng đến radio button
                      handleEditAddress(addr);
                    }}
                  >
                    ✎ Sửa
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {isChildrenOpen && (
        <AddressFormPopup
          isOpen={isChildrenOpen}
          onBack={handleBackToPopup}
          onClose={handleClose}
          fullAddress={selectedAddress}
          accountId={accountId}
          setAllAddress={setAllAddress}
        />
      )}
    </div>
  );
};

export default AddressPopup;
