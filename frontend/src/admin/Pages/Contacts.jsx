import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import styles from "../CSS/Contacts.module.css";
import ReplyContactPopup from "../Components/ReplyContactPopup";

const Contacts = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [searchId, setSearchId] = useState(""); // State cho ID tìm kiếm
  const [errorMessage, setErrorMessage] = useState(""); // State cho thông báo lỗi

  useEffect(() => {
    fetchContacts();
  }, []);

  // Sử dụng useCallback để memoize filterContacts, tránh tạo lại hàm mỗi lần render
  const filterContacts = useCallback(() => {
    let filtered = [...contacts];

    // Lọc theo ID nếu có giá trị tìm kiếm
    if (searchId) {
      const numericId = searchId;
      filtered = filtered.filter((contact) => contact.contact_id === numericId);
      setErrorMessage(
        filtered.length > 0 ? "" : "Không tìm thấy liên hệ với ID này."
      );
    } else {
      setErrorMessage("");
    }

    // Lọc theo tab (pending, responded, all)
    filtered = filtered.filter((contact) => {
      if (activeTab === "all") return true;
      if (activeTab === "pending") return contact.status === "pending";
      if (activeTab === "responded") return contact.status === "responded";
      return true;
    });

    setFilteredContacts(filtered);
  }, [activeTab, contacts, searchId]); // Các phụ thuộc của filterContacts

  useEffect(() => {
    filterContacts();
  }, [filterContacts]); // Sử dụng filterContacts làm dependency

  const fetchContacts = async () => {
    try {
      const response = await axios.get(
        "http://localhost/E_Commerce/backend/admin/api/GetContacts.php"
      );
      if (response.data.status === "success") {
        setContacts(response.data.data);
      } else {
        setPopupMessage(response.data.message || "Không tìm thấy liên hệ nào");
      }
    } catch (error) {
      setPopupMessage(`Lỗi tải danh sách liên hệ: ${error.message}`);
    }
  };

  const handleReply = (contact) => {
    setSelectedContact(contact);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchId(value);
  };

  return (
    <div className={styles.contactsContainer}>
      <h2 className={styles.title}>Quản lý Liên Hệ</h2>

      {/* Header với tìm kiếm và tabs */}
      <div className={styles.headerActions}>
        <input
          type="text"
          placeholder="Tìm theo ID"
          value={searchId}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
        <div className={styles.tabs}>
          <button
            className={activeTab === "all" ? styles.active : ""}
            onClick={() => setActiveTab("all")}
          >
            Tất cả
          </button>
          <button
            className={activeTab === "pending" ? styles.active : ""}
            onClick={() => setActiveTab("pending")}
          >
            Chưa phản hồi
          </button>
          <button
            className={activeTab === "responded" ? styles.active : ""}
            onClick={() => setActiveTab("responded")}
          >
            Đã phản hồi
          </button>
        </div>
      </div>

      {/* Hiển thị thông báo lỗi nếu có */}
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

      {/* Display contacts */}
      <div className={styles.contactsContent}>
        {filteredContacts.length > 0 ? (
          <table className={styles.contactsTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên liên hệ</th>
                <th>Email</th>
                <th>Chủ đề</th>
                <th>Nội dung</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((contact) => (
                <tr key={contact.contact_id}>
                  <td>{contact.contact_id}</td>
                  <td>{contact.full_name}</td>
                  <td>{contact.email}</td>
                  <td>{contact.subject}</td>
                  <td>{contact.message}</td>
                  <td>
                    {contact.status === "responded"
                      ? "Đã phản hồi"
                      : "Chưa phản hồi"}
                  </td>
                  <td>
                    {contact.status !== "responded" && (
                      <button
                        className={styles.replyButton}
                        onClick={() => handleReply(contact)}
                      >
                        Phản hồi
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>{popupMessage || "Không có liên hệ nào để hiển thị."}</p>
        )}
      </div>

      {/* Hiển thị popup phản hồi */}
      {selectedContact && (
        <ReplyContactPopup
          isOpen={!!selectedContact}
          onClose={() => setSelectedContact(null)}
          contact={selectedContact}
          onReplySuccess={fetchContacts} // Gọi lại fetchContacts sau khi phản hồi
        />
      )}
    </div>
  );
};

export default Contacts;
