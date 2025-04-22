import React, { useState, useEffect } from "react";
import { showToast } from "./ToastProvider";
import styles from "../CSS/DiscountFormPopup.module.css";

const DiscountFormPopup = ({ isOpen, onClose, discountData, onSubmit }) => {
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [quantity, setQuantity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  console.log(discountData);

  // Cập nhật dữ liệu input từ `discountData` khi popup được mở
  useEffect(() => {
    if (discountData) {
      setCode(discountData.code);
      setDescription(discountData.description);
      setDiscountValue(discountData.discount_value);
      setQuantity(discountData.quantity);
      setStartDate(discountData.start_date || "");
      setEndDate(discountData.end_date || "");
    } else {
      // Reset các giá trị khi thêm mới
      setCode("");
      setDescription("");
      setDiscountValue("");
      setQuantity("");
      setStartDate("");
      setEndDate("");
    }
  }, [discountData]);

  // Xử lý gửi form
  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra các trường input
    if (
      !code.trim() ||
      !description.trim() ||
      !discountValue ||
      !quantity ||
      !startDate.trim() ||
      !endDate.trim()
    ) {
      showToast("error", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    // Truyền dữ liệu cho hàm `onSubmit`
    onSubmit({
      discount_id: discountData?.discount_id,
      code,
      description,
      discount_value: parseFloat(discountValue),
      quantity: parseInt(quantity, 10),
      start_date: startDate,
      end_date: endDate,
    });

    // Đóng popup sau khi gửi
    onClose();
  };

  // Nếu không mở popup, không hiển thị gì
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h2>{discountData ? "Sửa Mã Giảm Giá" : "Thêm Mã Giảm Giá"}</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="code">Mã Giảm Giá:</label>
          <input
            id="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />

          <label htmlFor="description">Mô tả:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <label htmlFor="discountValue">Giá trị giảm (%):</label>
          <input
            id="discountValue"
            type="number"
            step="0.01"
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            required
          />

          <label htmlFor="quantity">Số lượng:</label>
          <input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />

          <label htmlFor="startDate">Ngày bắt đầu:</label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />

          <label htmlFor="endDate">Ngày kết thúc:</label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />

          <div className={styles.btnGroup}>
            <button type="submit" className={styles.saveButton}>
              Lưu
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DiscountFormPopup;
