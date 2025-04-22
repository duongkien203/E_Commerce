import React, { useState, useEffect } from "react";
import styles from "../CSS/InvoiceDetailsPopup.module.css";
import axios from "axios";

const InvoiceDetailsPopup = ({ isOpen, onClose, invoiceId }) => {
  const [invoiceDetails, setInvoiceDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch chi tiết hóa đơn
  useEffect(() => {
    if (isOpen && invoiceId) {
      setLoading(true);
      axios
        .get(
          `http://localhost/E_Commerce/backend/admin/api/GetInvoiceDetails.php?invoice_id=${invoiceId}`
        )
        .then((response) => {
          if (response.data.status === "success") {
            setInvoiceDetails(response.data.data);
          } else {
            setError("Không tìm thấy chi tiết hóa đơn.");
          }
        })
        .catch(() => setError("Đã xảy ra lỗi khi tải dữ liệu."))
        .finally(() => setLoading(false));
    }
  }, [isOpen, invoiceId]);

  // Tính tổng tiền sản phẩm (tổng "Thành tiền")
  const calculateTotalProducts = () => {
    return invoiceDetails.reduce(
      (total, product) =>
        total + product.sale_price * product.purchase_quantity,
      0
    );
  };

  // Hàm Việt hóa trạng thái (giống file cha)
  const getStatusInVietnamese = (status) => {
    switch (status) {
      case "pending payment":
        return "Chờ thanh toán";
      case "pending confirmation":
        return "Chờ xác nhận";
      case "shipping":
        return "Đang giao";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  // Hàm Việt hóa trạng thái thanh toán
  const getPaymentStatusInVietnamese = (paymentStatus) => {
    switch (paymentStatus) {
      case "unpaid":
        return "Chưa thanh toán";
      case "pending":
        return "Chờ thanh toán";
      case "paid":
        return "Đã thanh toán";
      default:
        return paymentStatus;
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <button className={styles.closeButton} onClick={onClose}>
          ✖
        </button>

        {loading ? (
          <p className={styles.loading}>Đang tải...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          <div className={styles.detailsContainer}>
            <h2>Chi tiết hóa đơn</h2>

            {/* Thông tin hóa đơn */}
            <div className={styles.invoiceInfo}>
              <p>
                <strong>Mã hóa đơn:</strong> {invoiceDetails[0].invoice_id}
              </p>
              <p>
                <strong>Khách hàng:</strong> {invoiceDetails[0].full_name}
              </p>
              <p>
                <strong>Ngày đặt hàng:</strong> {invoiceDetails[0].order_date}
              </p>
              <p>
                <strong>Thông tin vận chuyển:</strong>{" "}
                {invoiceDetails[0].shipping_information}
              </p>
              <p>
                <strong>Trạng thái thanh toán:</strong>{" "}
                {getPaymentStatusInVietnamese(invoiceDetails[0].payment_status)}
              </p>
              <p>
                <strong>Trạng thái:</strong>{" "}
                {getStatusInVietnamese(invoiceDetails[0].status)}
              </p>
            </div>

            {/* Danh sách sản phẩm */}
            <h3>Sản phẩm</h3>
            <table className={styles.productTable}>
              <thead>
                <tr>
                  <th>Tên sản phẩm</th>
                  <th>Màu sắc</th>
                  <th>Kích thước</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {invoiceDetails.map((product) => (
                  <tr key={product.invoice_detail_id}>
                    <td>{product.product_name}</td>
                    <td>{product.product_color}</td>
                    <td>{product.product_size}</td>
                    <td>{product.purchase_quantity}</td>
                    <td>
                      <span className={styles.salePrice}>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(product.sale_price)}
                      </span>{" "}
                      <span className={styles.originalPrice}>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(product.price)}
                      </span>
                    </td>
                    <td>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(product.sale_price * product.purchase_quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Tổng tiền sản phẩm, giảm giá, tổng tiền hóa đơn */}
            <div className={styles.summary}>
              <p>
                <strong>Tổng tiền sản phẩm:</strong>{" "}
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(calculateTotalProducts())}
              </p>
              <p>
                <strong>Giảm giá: - </strong>
                {""}
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(invoiceDetails[0].discount)}
              </p>
              <p>
                <strong>Tổng tiền hóa đơn:</strong>{" "}
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(invoiceDetails[0].amount_sum)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceDetailsPopup;
