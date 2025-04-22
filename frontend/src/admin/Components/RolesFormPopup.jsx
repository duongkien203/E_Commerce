import React, { useState, useEffect } from "react";
import styles from "../CSS/RolesFormPopup.module.css";

const RolesFormPopup = ({ isOpen, onClose, roleData, onSubmit }) => {
  const [roleName, setRoleName] = useState("");

  useEffect(() => {
    if (roleData) {
      setRoleName(roleData.role_name);
    } else {
      setRoleName("");
    }
  }, [roleData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ role_id: roleData?.role_id, role_name: roleName });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h2>{roleData ? "Sửa Quyền" : "Thêm Quyền"}</h2>
        <form onSubmit={handleSubmit}>
          <label>Tên quyền:</label>
          <input
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            required
          />
          <div className={styles.btnGroup}>
            <button type="submit">Lưu</button>
            <button type="button" onClick={onClose}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RolesFormPopup;
