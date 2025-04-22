import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import Popup from "../Components/Popup";
import ConfirmPopup from "../Components/ConfirmPopup";
import styles from "../CSS/AddressFormPopup.module.css";

const AddressFormPopup = ({
  isOpen,
  onBack,
  onClose,
  fullAddress,
  accountId,
  setAllAddress,
}) => {
  const [contactName, setContactName] = useState(
    fullAddress?.contact_name || ""
  );
  const [contactPhone, setContactPhone] = useState(
    fullAddress?.contact_phone || ""
  );
  const [address, setAddress] = useState(fullAddress?.address || "");
  const [addressDetails, setAddressDetails] = useState(
    fullAddress?.address_details || ""
  );
  const [addressDefault, setAddressDefault] = useState(
    fullAddress?.address_default === 1
  );

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState(
    fullAddress?.province || ""
  );
  const [selectedDistrict, setSelectedDistrict] = useState(
    fullAddress?.district || ""
  );
  const [selectedWard, setSelectedWard] = useState(fullAddress?.ward || "");

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isConfirmOpen, setConfirmOpen] = useState(false);

  // Lấy danh sách tỉnh từ API
  useEffect(() => {
    axios
      .get("https://provinces.open-api.vn/api/?depth=1")
      .then((response) => setProvinces(response.data))
      .catch((error) => console.error("Lỗi khi lấy danh sách tỉnh:", error));
  }, []);

  // Lấy danh sách huyện khi chọn tỉnh
  useEffect(() => {
    if (!selectedProvince) return;

    axios
      .get(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
      .then((response) => {
        setDistricts(response.data.districts);
      })
      .catch((error) => console.error("Lỗi khi lấy danh sách huyện:", error));
  }, [selectedProvince]);

  // Lấy danh sách xã khi chọn huyện
  useEffect(() => {
    if (!selectedDistrict) return;
    axios
      .get(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
      .then((response) => setWards(response.data.wards))
      .catch((error) => console.error("Lỗi khi lấy danh sách xã:", error));
  }, [selectedDistrict]);

  // Gửi yêu cầu thêm hoặc cập nhật địa chỉ
  const handleSubmit = (e) => {
    e.preventDefault();

    const url = fullAddress
      ? "http://localhost/E_Commerce/backend/user/api/UpdateAddress.php"
      : "http://localhost/E_Commerce/backend/user/api/AddAddress.php";

    axios
      .post(url, {
        id: accountId,
        address_id: fullAddress?.address_id || null,
        contact_name: contactName,
        contact_phone: contactPhone,
        address: address,
        address_details: addressDetails,
        address_default: addressDefault ? 1 : 0,
      })
      .then((response) => {
        if (response.data.status === "success") {
          setPopupMessage(
            fullAddress
              ? "Cập nhật địa chỉ thành công"
              : "Thêm địa chỉ thành công"
          );
          setShowPopup(true);

          // Lấy danh sách địa chỉ mới để cập nhật UI
          axios
            .post(
              "http://localhost/E_Commerce/backend/user/api/GetAllAddresses.php",
              {
                id: accountId,
              }
            )
            .then((res) => {
              if (res.data.data.status === "success") {
                setAllAddress(res.data.data.data);
              } else {
                setAllAddress([]);
              }
            })
            .catch(() => setAllAddress([]));
        } else {
          console.err("Lỗi khi lưu địa chỉ!");
        }
      })
      .catch((error) => console.error("Lỗi khi lưu địa chỉ:", error));
  };

  const closePopup = () => {
    setShowPopup(false);
    if (onBack) {
      onBack();
    } else {
      onClose();
    }
  };

  // Xóa địa chỉ
  const handleDelete = () => {
    if (!fullAddress) return;

    axios
      .post("http://localhost/E_Commerce/backend/user/api/DeleteAddress.php", {
        id: accountId,
        address_id: fullAddress.address_id,
      })
      .then((response) => {
        if (response.data.status === "success") {
          // Lấy danh sách địa chỉ mới để cập nhật UI
          axios
            .post(
              "http://localhost/E_Commerce/backend/user/api/GetAllAddresses.php",
              { id: accountId }
            )
            .then((res) => {
              if (res.data.data.status === "success") {
                setAllAddress(res.data.data.data);
              } else {
                setAllAddress([]);
              }
            })
            .catch(() => setAllAddress([]));

          setConfirmOpen(false); // Đóng popup xác nhận
          onBack();
        } else {
          console.error("Lỗi khi xóa địa chỉ!");
        }
      })
      .catch((error) => console.error("Lỗi khi xóa địa chỉ:", error));
  };

  // Cập nhật địa chỉ khi chọn tỉnh, huyện, xã
  useEffect(() => {
    if (!selectedProvince || !selectedDistrict || !selectedWard) {
      return;
    }

    // Tìm tỉnh/huyện/xã theo mã code đã chọn
    const provinceObj = provinces.find(
      (p) => p.code === Number(selectedProvince)
    );
    const districtObj = districts.find(
      (d) => d.code === Number(selectedDistrict)
    );
    const wardObj = wards.find((w) => w.code === Number(selectedWard));

    // Lấy tên (nếu tìm thấy)
    const provinceName = provinceObj ? provinceObj.name : "";
    const districtName = districtObj ? districtObj.name : "";
    const wardName = wardObj ? wardObj.name : "";

    // Cập nhật địa chỉ hiển thị
    setAddress(`${wardName}, ${districtName}, ${provinceName}`);
  }, [
    selectedProvince,
    selectedDistrict,
    selectedWard,
    provinces,
    districts,
    wards,
  ]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        {onBack && (
          <button className={styles.backBtn} onClick={onBack}>
            <FaArrowLeft />
          </button>
        )}
        <h2>{fullAddress ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}</h2>
        <button className={styles.closeBtn} onClick={onClose}>
          ✖
        </button>
        <form onSubmit={handleSubmit}>
          <label className={styles.labelTitle}>Tên liên hệ:</label>
          <input
            type="text"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            required
          />

          <label className={styles.labelTitle}>Số điện thoại:</label>
          <input
            type="text"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            required
          />

          <label className={styles.labelTitle}>Tỉnh/Thành phố:</label>
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            required={!fullAddress}
          >
            <option value="">Chọn tỉnh/thành phố</option>
            {provinces.map((prov) => (
              <option key={prov.code} value={prov.code}>
                {prov.name}
              </option>
            ))}
          </select>

          <label className={styles.labelTitle}>Quận/Huyện:</label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            required={!fullAddress}
            disabled={!selectedProvince}
          >
            <option value="">Chọn quận/huyện</option>
            {districts.map((dist) => (
              <option key={dist.code} value={dist.code}>
                {dist.name}
              </option>
            ))}
          </select>

          <label className={styles.labelTitle}>Phường/Xã:</label>
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            required={!fullAddress}
            disabled={!selectedDistrict}
          >
            <option value="">Chọn phường/xã</option>
            {wards.map((ward) => (
              <option key={ward.code} value={ward.code}>
                {ward.name}
              </option>
            ))}
          </select>

          <label className={styles.labelTitle}>Địa chỉ:</label>
          <input type="text" value={address} readOnly required />

          <label className={styles.labelTitle}>Chi tiết địa chỉ:</label>
          <input
            type="text"
            value={addressDetails}
            onChange={(e) => setAddressDetails(e.target.value)}
            required
          />

          <div className={styles.setIsDefault}>
            <input
              type="checkbox"
              id="setIsDefault"
              checked={addressDefault}
              onChange={(e) => setAddressDefault(e.target.checked)}
            />
            <label htmlFor="setIsDefault">Đặt làm địa chỉ mặc định</label>
          </div>

          <div className={styles.btnGroup}>
            <button type="submit">
              {fullAddress ? "Lưu thay đổi" : "Thêm địa chỉ"}
            </button>
            {fullAddress && (
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={() => setConfirmOpen(true)}
              >
                Xóa
              </button>
            )}
          </div>
        </form>
      </div>
      {/* Popup thông báo thành công */}
      {showPopup && <Popup message={popupMessage} onClose={closePopup} />}
      {/* Popup xác nhận xóa */}
      {isConfirmOpen && (
        <ConfirmPopup
          message="Bạn có chắc chắn muốn xóa địa chỉ này không?"
          onConfirm={handleDelete}
          onClose={() => {
            setConfirmOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default AddressFormPopup;
