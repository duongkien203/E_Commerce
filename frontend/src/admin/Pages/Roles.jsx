import React, { useState, useEffect } from "react";
import axios from "axios";
import Popup from "../Components/Popup";
import RolesFormPopup from "../Components/RolesFormPopup";
import ConfirmPopup from "../Components/ConfirmPopup";
import styles from "../CSS/Roles.module.css";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isConfirmPopupOpen, setConfirmPopupOpen] = useState(false);
  const [deleteRoleId, setDeleteRoleId] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [isSingleDelete, setIsSingleDelete] = useState(false);
  const [searchId, setSearchId] = useState(""); // State cho ID tìm kiếm
  const [searchResults, setSearchResults] = useState([]); // State cho kết quả tìm kiếm
  const [errorMessage, setErrorMessage] = useState(""); // State cho thông báo lỗi

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get(
        "http://localhost/E_Commerce/backend/admin/api/GetRoles.php"
      );
      if (response.data.status === "success") {
        const rolesData = response.data.data;
        setRoles(rolesData);
        setSearchResults(rolesData); // Khởi tạo kết quả tìm kiếm với tất cả vai trò
      } else {
        setErrorMessage("Không thể tải dữ liệu quyền.");
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
      setErrorMessage("Lỗi khi kết nối đến server.");
    }
  };

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

  const handleAddClick = () => {
    setSelectedRole(null);
    setPopupOpen(true);
  };

  const handleEditClick = (role) => {
    setSelectedRole(role);
    setPopupOpen(true);
  };

  const handleSaveRole = async (newRole) => {
    try {
      let response;
      if (newRole.role_id) {
        // Cập nhật vai trò
        response = await axios.put(
          "http://localhost/E_Commerce/backend/admin/api/UpdateRole.php",
          {
            role_id: newRole.role_id,
            role_name: newRole.role_name,
          }
        );
        if (response.data.status !== "success") {
          throw new Error(
            response.data.message || "Cập nhật không thành công."
          );
        }
        setRoles((prevRoles) =>
          prevRoles.map((role) =>
            role.role_id === newRole.role_id
              ? { ...role, role_name: newRole.role_name }
              : role
          )
        );
        setSearchResults((prevResults) =>
          prevResults.map((role) =>
            role.role_id === newRole.role_id
              ? { ...role, role_name: newRole.role_name }
              : role
          )
        );
        setPopupMessage("Sửa thành công");
      } else {
        // Thêm vai trò mới
        response = await axios.post(
          "http://localhost/E_Commerce/backend/admin/api/AddRole.php",
          {
            role_name: newRole.role_name,
          }
        );
        if (response.data.status !== "success") {
          throw new Error(response.data.message || "Thêm không thành công.");
        }
        const addedRole = {
          role_id: response.data.role_id,
          role_name: newRole.role_name,
        };
        setRoles((prevRoles) => [...prevRoles, addedRole]);
        setSearchResults((prevResults) => [...prevResults, addedRole]);
        setPopupMessage("Thêm thành công");
      }
      setPopupVisible(true);
    } catch (error) {
      setPopupMessage(`Lỗi: ${error.message}`);
      setPopupVisible(true);
    }
  };

  const handleDeleteClick = (roleId) => {
    setDeleteRoleId(roleId);
    setIsSingleDelete(true);
    setConfirmPopupOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteRoleId) return;

    try {
      const response = await axios.delete(
        "http://localhost/E_Commerce/backend/admin/api/DeleteRole.php",
        {
          data: { role_id: deleteRoleId },
        }
      );
      if (response.data.status === "success") {
        setRoles((prevRoles) =>
          prevRoles.filter((role) => role.role_id !== deleteRoleId)
        );
        setSearchResults((prevResults) =>
          prevResults.filter((role) => role.role_id !== deleteRoleId)
        );
        setPopupMessage("Xóa thành công");
      } else {
        setPopupMessage(response.data.message || "Lỗi khi xóa");
      }
    } catch (error) {
      setPopupMessage(`Lỗi: ${error.message}`);
    } finally {
      setPopupVisible(true);
      setConfirmPopupOpen(false);
    }
  };

  const handleSelectRole = (roleId) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleSelectAllRoles = () => {
    if (selectedRoles.length === searchResults.length) {
      setSelectedRoles([]);
    } else {
      setSelectedRoles(searchResults.map((role) => role.role_id));
    }
  };

  const handleDeleteMultipleClick = () => {
    if (selectedRoles.length === 0) {
      setPopupMessage("Vui lòng chọn ít nhất một quyền để xóa.");
      setPopupVisible(true);
      return;
    }
    setIsSingleDelete(false);
    setConfirmPopupOpen(true);
  };

  const handleConfirmDeleteMultiple = async () => {
    try {
      const response = await axios.delete(
        "http://localhost/E_Commerce/backend/admin/api/DeleteMultipleRoles.php",
        {
          data: { role_ids: selectedRoles },
        }
      );
      if (response.data.status === "success") {
        setRoles((prevRoles) =>
          prevRoles.filter((role) => !selectedRoles.includes(role.role_id))
        );
        setSearchResults((prevResults) =>
          prevResults.filter((role) => !selectedRoles.includes(role.role_id))
        );
        setPopupMessage("Xóa thành công");
      } else {
        setPopupMessage(response.data.message || "Lỗi khi xóa");
      }
    } catch (error) {
      setPopupMessage(`Lỗi: ${error.message}`);
    } finally {
      setPopupVisible(true);
      setConfirmPopupOpen(false);
      setSelectedRoles([]);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchId(value);

    if (value) {
      const numericId = Number(value); // Chuyển đổi thành số
      const foundRole = roles.find((role) => role.role_id === numericId);
      setSearchResults(foundRole ? [foundRole] : []);
      setErrorMessage(foundRole ? "" : "Không tìm thấy quyền với ID này.");
    } else {
      setSearchResults(roles); // Hiển thị tất cả nếu không có giá trị tìm kiếm
      setErrorMessage("");
    }
  };

  return (
    <div className={styles.rolesContainer}>
      <div className={styles.rolesHeader}>
        <h2 className={styles.rolesTitle}>Quản lý Quyền</h2>
        <div className={styles.headerActions}>
          <input
            type="text"
            placeholder="Tìm theo ID"
            value={searchId}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
          <button className={styles.addRoleButton} onClick={handleAddClick}>
            + Thêm quyền
          </button>
          <button
            className={styles.deleteRoleButton}
            onClick={handleDeleteMultipleClick}
            disabled={selectedRoles.length === 0}
          >
            Xóa
          </button>
        </div>
      </div>

      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

      {searchResults.length > 0 ? (
        <table className={styles.rolesTable}>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={
                    searchResults.length > 0 &&
                    selectedRoles.length === searchResults.length
                  }
                  onChange={handleSelectAllRoles}
                />
              </th>
              <th>Số thứ tự</th>
              <th>Mã quyền</th>
              <th>Tên quyền</th>
              <th>Chức năng</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.map((role, index) => (
              <tr key={role.role_id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(role.role_id)}
                    onChange={() => handleSelectRole(role.role_id)}
                  />
                </td>
                <td>{index + 1}</td>
                <td>{role.role_id}</td>
                <td>{getRoleInVietnamese(role.role_name)}</td>
                <td>
                  <div className={styles.actionButtons}>
                    <button
                      className={styles.editButton}
                      onClick={() => handleEditClick(role)}
                    >
                      Sửa
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteClick(role.role_id)}
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.noData}>
          {searchId
            ? "Không tìm thấy quyền với ID này."
            : "Không có quyền nào để hiển thị."}
        </p>
      )}

      <RolesFormPopup
        isOpen={isPopupOpen}
        onClose={() => setPopupOpen(false)}
        roleData={selectedRole}
        onSubmit={handleSaveRole}
      />

      {isPopupVisible && (
        <Popup message={popupMessage} onClose={() => setPopupVisible(false)} />
      )}

      {isConfirmPopupOpen && (
        <ConfirmPopup
          message={
            isSingleDelete
              ? "Bạn có chắc chắn muốn xóa quyền này không?"
              : "Bạn có chắc chắn muốn xóa các quyền đã chọn?"
          }
          onClose={() => setConfirmPopupOpen(false)}
          onConfirm={
            isSingleDelete ? handleConfirmDelete : handleConfirmDeleteMultiple
          }
        />
      )}
    </div>
  );
};

export default Roles;
