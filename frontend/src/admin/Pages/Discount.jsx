import React, { useState, useEffect } from "react";
import styles from "../CSS/Discounts.module.css";
import DiscountFormPopup from "../Components/DiscountFormPopup";
import ConfirmPopup from "../Components/ConfirmPopup";
import Popup from "../Components/Popup";

const Discounts = () => {
  const [discounts, setDiscounts] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedDiscounts, setSelectedDiscounts] = useState([]);
  const [isConfirmMultiDeleteOpen, setConfirmMultiDeleteOpen] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetch("http://localhost/E_Commerce/backend/admin/api/GetDiscounts.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setDiscounts(data.data);
          setSearchResults(data.data); // Khởi tạo kết quả tìm kiếm với tất cả mã giảm giá
        }
      })
      .catch((error) => console.error("Lỗi tải mã giảm giá:", error));
  }, []);

  const showPopup = (message) => {
    setPopupMessage(message);
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setPopupMessage("");
  };

  const handleOpenForm = (discount = null) => {
    setSelectedDiscount(discount);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedDiscount(null);
  };

  const handleOpenConfirm = (id) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
    setDeleteId(null);
  };

  const handleSubmitDiscount = (discountData) => {
    const isEditing = !!discountData.discount_id;
    const url = isEditing
      ? "http://localhost/E_Commerce/backend/admin/api/UpdateDiscount.php"
      : "http://localhost/E_Commerce/backend/admin/api/AddDiscount.php";

    const method = isEditing ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(discountData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          fetch(
            "http://localhost/E_Commerce/backend/admin/api/GetDiscounts.php"
          )
            .then((res) => res.json())
            .then((data) => {
              if (data.status === "success") {
                setDiscounts(data.data);
                setSearchResults(data.data); // Cập nhật kết quả tìm kiếm sau khi thêm/sửa
              }
            })
            .catch((error) =>
              console.error("Lỗi tải danh sách mã giảm giá:", error)
            );

          showPopup(
            isEditing
              ? "Sửa mã giảm giá thành công"
              : "Thêm mã giảm giá thành công"
          );
        } else {
          showPopup(data.message || "Đã xảy ra lỗi!");
        }
      })
      .catch((error) => {
        console.error("Lỗi thêm/sửa mã giảm giá:", error);
        showPopup("Có lỗi xảy ra trong quá trình thực hiện.");
      });

    handleCloseForm();
  };

  const handleDelete = () => {
    fetch(
      `http://localhost/E_Commerce/backend/admin/api/DeleteDiscount.php?discount_id=${deleteId}`,
      {
        method: "DELETE",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setDiscounts((prev) =>
            prev.filter((item) => item.discount_id !== deleteId)
          );
          setSearchResults((prev) =>
            prev.filter((item) => item.discount_id !== deleteId)
          ); // Cập nhật kết quả tìm kiếm sau khi xóa
          showPopup("Xóa mã giảm giá thành công");
        } else {
          showPopup(data.message || "Đã xảy ra lỗi trong quá trình xóa.");
        }
      })
      .catch((error) => {
        console.error("Lỗi xóa mã giảm giá:", error);
        showPopup("Có lỗi xảy ra trong quá trình xóa.");
      });

    handleCloseConfirm();
  };

  const handleSelectAll = () => {
    if (selectedDiscounts.length === searchResults.length) {
      setSelectedDiscounts([]);
    } else {
      setSelectedDiscounts(
        searchResults.map((discount) => discount.discount_id)
      );
    }
  };

  const handleSelectDiscount = (discountId) => {
    setSelectedDiscounts((prevSelected) =>
      prevSelected.includes(discountId)
        ? prevSelected.filter((id) => id !== discountId)
        : [...prevSelected, discountId]
    );
  };

  const handleMultiDeleteClick = () => {
    if (selectedDiscounts.length === 0) {
      showPopup("Vui lòng chọn ít nhất một mã giảm giá để xóa.");
      return;
    }
    setConfirmMultiDeleteOpen(true);
  };

  const handleConfirmMultiDelete = () => {
    fetch(
      "http://localhost/E_Commerce/backend/admin/api/DeleteMultipleDiscounts.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ discount_ids: selectedDiscounts }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setDiscounts((prev) =>
            prev.filter(
              (discount) => !selectedDiscounts.includes(discount.discount_id)
            )
          );
          setSearchResults((prev) =>
            prev.filter(
              (discount) => !selectedDiscounts.includes(discount.discount_id)
            )
          ); // Cập nhật kết quả tìm kiếm sau khi xóa nhiều
          setSelectedDiscounts([]);
          showPopup("Xóa các mã giảm giá thành công");
        } else {
          showPopup(data.message || "Lỗi khi xóa các mã giảm giá");
        }
      })
      .catch((error) => {
        console.error("Lỗi xóa nhiều mã giảm giá:", error);
        showPopup("Có lỗi xảy ra trong quá trình xóa.");
      })
      .finally(() => {
        setConfirmMultiDeleteOpen(false);
      });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchId(value);

    if (value) {
      const foundDiscounts = discounts.filter((discount) =>
        discount.discount_id.toString().includes(value)
      );
      setSearchResults(foundDiscounts);
    } else {
      setSearchResults(discounts);
    }
  };

  return (
    <div className={styles.discountsContainer}>
      <h2>Danh Sách Mã Giảm Giá</h2>
      <div className={styles.headerActions}>
        <input
          type="text"
          placeholder="Tìm theo ID"
          value={searchId}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
        <div className={styles.buttonContainer}>
          <button className={styles.addButton} onClick={() => handleOpenForm()}>
            + Thêm Mã Giảm Giá
          </button>
          <button
            className={styles.deleteMultipleButton}
            onClick={handleMultiDeleteClick}
          >
            Xóa
          </button>
        </div>
      </div>
      {searchResults.length > 0 ? (
        <table className={styles.discountsTable}>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={
                    searchResults.length > 0 &&
                    selectedDiscounts.length === searchResults.length
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th>ID</th>
              <th>Mã</th>
              <th>Mô tả</th>
              <th>Giảm giá</th>
              <th>Số lượng</th>
              <th>Bắt đầu</th>
              <th>Kết thúc</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.map((discount) => (
              <tr key={discount.discount_id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedDiscounts.includes(discount.discount_id)}
                    onChange={() => handleSelectDiscount(discount.discount_id)}
                  />
                </td>
                <td>{discount.discount_id}</td>
                <td>{discount.code}</td>
                <td>{discount.description}</td>
                <td>{discount.discount_value}</td>
                <td>{discount.quantity}</td>
                <td>{discount.start_date}</td>
                <td>{discount.end_date}</td>
                <td>{discount.status}</td>
                <td className={styles.actions}>
                  <button
                    className={styles.edit}
                    onClick={() => handleOpenForm(discount)}
                  >
                    Sửa
                  </button>
                  <button
                    className={styles.delete}
                    onClick={() => handleOpenConfirm(discount.discount_id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.noData}>
          {searchId
            ? "Không tìm thấy mã giảm giá với ID này."
            : "Không có mã giảm giá nào để hiển thị."}
        </p>
      )}

      {isFormOpen && (
        <DiscountFormPopup
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          discountData={selectedDiscount}
          onSubmit={handleSubmitDiscount}
        />
      )}
      {isConfirmOpen && (
        <ConfirmPopup
          isOpen={isConfirmOpen}
          onClose={handleCloseConfirm}
          onConfirm={handleDelete}
          message="Bạn có chắc chắn muốn xóa mã giảm giá này không?"
        />
      )}
      {isConfirmMultiDeleteOpen && (
        <ConfirmPopup
          isOpen={isConfirmMultiDeleteOpen}
          onClose={() => setConfirmMultiDeleteOpen(false)}
          onConfirm={handleConfirmMultiDelete}
          message="Bạn có chắc chắn muốn xóa các mã giảm giá đã chọn không?"
        />
      )}
      {isPopupVisible && <Popup message={popupMessage} onClose={closePopup} />}
    </div>
  );
};

export default Discounts;
