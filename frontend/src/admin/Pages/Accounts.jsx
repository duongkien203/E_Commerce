import React, { useState, useEffect } from "react";
import axios from "axios";
import Popup from "../Components/Popup";
import ConfirmPopup from "../Components/ConfirmPopup";
import AccountDetailsPopup from "../Components/AccountDetailsPopup";
import CreateAccount from "../Components/CreateAccount";
import styles from "../CSS/Accounts.module.css";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [isConfirmPopupOpen, setConfirmPopupOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [toggleTarget, setToggleTarget] = useState(null);
  const [toggleStatus, setToggleStatus] = useState("");
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);
  const [searchId, setSearchId] = useState(""); // State cho ID tìm kiếm
  const [searchResults, setSearchResults] = useState([]); // State cho kết quả tìm kiếm
  const [errorMessage, setErrorMessage] = useState(""); // State cho thông báo lỗi

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(
        "http://localhost/E_Commerce/backend/admin/api/GetAllAccounts.php"
      );
      if (response.data.status === "success") {
        const accountsData = response.data.data;
        setAccounts(accountsData);
        setSearchResults(accountsData); // Khởi tạo kết quả tìm kiếm với tất cả tài khoản
      } else {
        setErrorMessage("Không thể tải danh sách tài khoản.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tài khoản:", error);
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

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedAccounts(searchResults.map((acc) => acc.account_id));
    } else {
      setSelectedAccounts([]);
    }
  };

  const handleSelectAccount = (accountId) => {
    setSelectedAccounts((prev) =>
      prev.includes(accountId)
        ? prev.filter((id) => id !== accountId)
        : [...prev, accountId]
    );
  };

  const handleDeleteSingle = (accountId) => {
    setConfirmMessage("Bạn có chắc chắn muốn xóa tài khoản này không?");
    setDeleteTarget(accountId);
    setConfirmPopupOpen(true);
  };

  const handleDeleteSelected = () => {
    if (selectedAccounts.length === 0) {
      setPopupMessage("Vui lòng chọn ít nhất một tài khoản để xóa.");
      setPopupVisible(true);
      return;
    }
    setConfirmMessage("Bạn có chắc chắn muốn xóa các tài khoản đã chọn?");
    setDeleteTarget("multiple");
    setConfirmPopupOpen(true);
  };

  const confirmDelete = () => {
    if (deleteTarget === "multiple") {
      deleteSelectedAccounts();
    } else {
      deleteSingleAccount(deleteTarget);
    }
    setConfirmPopupOpen(false);
  };

  const deleteSingleAccount = async (accountId) => {
    try {
      const response = await axios.post(
        "http://localhost/E_Commerce/backend/admin/api/DeleteAccount.php",
        {
          account_id: accountId,
        }
      );
      if (response.data.status === "success") {
        fetchAccounts();
        setPopupMessage("Xóa tài khoản thành công");
      } else {
        setPopupMessage(response.data.message || "Lỗi khi xóa tài khoản.");
      }
    } catch (error) {
      setPopupMessage(`Lỗi: ${error.message}`);
    } finally {
      setPopupVisible(true);
    }
  };

  const deleteSelectedAccounts = async () => {
    try {
      const response = await axios.post(
        "http://localhost/E_Commerce/backend/admin/api/DeleteMultipleAccounts.php",
        {
          account_ids: selectedAccounts,
        }
      );
      if (response.data.status === "success") {
        fetchAccounts();
        setSelectedAccounts([]);
        setPopupMessage("Xóa tài khoản thành công.");
      } else {
        setPopupMessage(response.data.message || "Lỗi khi xóa tài khoản.");
      }
    } catch (error) {
      setPopupMessage(`Lỗi: ${error.message}`);
    } finally {
      setPopupVisible(true);
    }
  };

  const handleViewDetails = (account) => {
    setSelectedAccount(account);
    setIsDetailPopupOpen(true);
  };

  const handleToggleAccountStatus = (accountId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "locked" : "active";
    setConfirmMessage(
      `Bạn có chắc chắn muốn ${
        newStatus === "locked" ? "khóa" : "mở khóa"
      } tài khoản này không?`
    );
    setToggleTarget(accountId);
    setToggleStatus(newStatus);
    setConfirmPopupOpen(true);
  };

  const confirmToggleStatus = async () => {
    try {
      const response = await axios.post(
        "http://localhost/E_Commerce/backend/admin/api/UpdateAccountStatus.php",
        {
          account_id: toggleTarget,
          status: toggleStatus,
        }
      );
      if (response.data.status === "success") {
        fetchAccounts();
        setPopupMessage(
          `Tài khoản đã được ${
            toggleStatus === "locked" ? "khóa" : "mở khóa"
          } thành công`
        );
      } else {
        setPopupMessage(
          response.data.message || "Lỗi khi thay đổi trạng thái tài khoản."
        );
      }
    } catch (error) {
      setPopupMessage(`Lỗi: ${error.message}`);
    } finally {
      setPopupVisible(true);
      setConfirmPopupOpen(false);
    }
  };

  const handleAddAccount = () => {
    setIsCreateAccountOpen(true);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchId(value);

    if (value) {
      const numericId = Number(value); // Chuyển đổi thành số
      const foundAccount = accounts.find(
        (account) => account.account_id === numericId
      );
      setSearchResults(foundAccount ? [foundAccount] : []);
      setErrorMessage(
        foundAccount ? "" : "Không tìm thấy tài khoản với ID này."
      );
    } else {
      setSearchResults(accounts); // Hiển thị tất cả nếu không có giá trị tìm kiếm
      setErrorMessage("");
    }
  };

  return (
    <div className={styles.accountsContainer}>
      <div className={styles.accountsHeader}>
        <h2 className={styles.accountsTitle}>Quản lý Tài khoản</h2>
        <div className={styles.actionButtons}>
          <input
            type="text"
            placeholder="Tìm theo ID"
            value={searchId}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
          <button className={styles.addButton} onClick={handleAddAccount}>
            Thêm
          </button>
          <button
            className={styles.deleteSelectedButton}
            onClick={handleDeleteSelected}
            disabled={selectedAccounts.length === 0}
          >
            Xóa
          </button>
        </div>
      </div>

      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

      {searchResults.length > 0 ? (
        <table className={styles.accountsTable}>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    searchResults.length > 0 &&
                    selectedAccounts.length === searchResults.length
                  }
                />
              </th>
              <th>STT</th>
              <th>Ảnh đại diện</th>
              <th>Họ và tên</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.map((account, index) => (
              <tr
                key={account.account_id}
                className={
                  selectedAccounts.includes(account.account_id)
                    ? styles.selectedRow
                    : ""
                }
              >
                <td>
                  <input
                    type="checkbox"
                    onChange={() => handleSelectAccount(account.account_id)}
                    checked={selectedAccounts.includes(account.account_id)}
                  />
                </td>
                <td>{index + 1}</td>
                <td>
                  <img
                    src={account.avatar}
                    alt="Avatar"
                    className={styles.avatar}
                  />
                </td>
                <td>{account.full_name}</td>
                <td>{account.email}</td>
                <td>{getRoleInVietnamese(account.role_name)}</td>
                <td>{account.status === "active" ? "Hoạt động" : "Đã khóa"}</td>
                <td>
                  <div className={styles.actionButtons}>
                    <button
                      className={styles.detailButton}
                      onClick={() => handleViewDetails(account)}
                    >
                      Chi tiết
                    </button>
                    <button
                      className={
                        account.status === "active"
                          ? styles.lockButton
                          : styles.unlockButton
                      }
                      onClick={() =>
                        handleToggleAccountStatus(
                          account.account_id,
                          account.status
                        )
                      }
                    >
                      {account.status === "active" ? "Khóa" : "Mở khóa"}
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteSingle(account.account_id)}
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
            ? "Không tìm thấy tài khoản với ID này."
            : "Không có tài khoản nào để hiển thị."}
        </p>
      )}

      {isConfirmPopupOpen && (
        <ConfirmPopup
          message={confirmMessage}
          onClose={() => setConfirmPopupOpen(false)}
          onConfirm={deleteTarget ? confirmDelete : confirmToggleStatus}
        />
      )}

      {isPopupVisible && (
        <Popup message={popupMessage} onClose={() => setPopupVisible(false)} />
      )}

      {isDetailPopupOpen && selectedAccount && (
        <AccountDetailsPopup
          isOpen={isDetailPopupOpen}
          onClose={() => setIsDetailPopupOpen(false)}
          account={selectedAccount}
        />
      )}

      {isCreateAccountOpen && (
        <CreateAccount
          isOpen={isCreateAccountOpen}
          onClose={() => setIsCreateAccountOpen(false)}
          onAccountCreated={fetchAccounts} // Callback để làm mới danh sách sau khi tạo tài khoản
        />
      )}
    </div>
  );
};

export default Accounts;
