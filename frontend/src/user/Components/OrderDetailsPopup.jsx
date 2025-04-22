import React, { useState, useEffect } from "react";
import styles from "../CSS/OrderDetailsPopup.module.css";
import axios from "axios";

const OrderDetailsPopup = ({ isOpen, onClose, invoiceId }) => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && invoiceId) {
      setLoading(true);
      axios
        .get(
          `http://localhost/E_Commerce/backend/user/api/GetInvoiceDetails.php?invoice_id=${invoiceId}`
        )
        .then((response) => {
          if (response.data.status === "success") {
            setOrderDetails(response.data.data);
          } else {
            setError("Không tìm thấy chi tiết đơn hàng.");
          }
        })
        .catch(() => setError("Đã xảy ra lỗi khi tải dữ liệu."))
        .finally(() => setLoading(false));
    }
  }, [isOpen, invoiceId]);

  const calculateTotalPrice = () => {
    return orderDetails.reduce(
      (total, product) =>
        total + product.sale_price * product.purchase_quantity,
      0
    );
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
            <h2>Chi tiết đơn hàng</h2>

            <div className={styles.orderInfo}>
              <p>
                <strong>Mã đơn hàng:</strong> {orderDetails[0].invoice_id}
              </p>
              <p>
                <strong>Khách hàng:</strong> {orderDetails[0].full_name}
              </p>
              <p>
                <strong>Ngày đặt hàng:</strong> {orderDetails[0].order_date}
              </p>
              <p>
                <strong>Địa chỉ giao hàng:</strong>{" "}
                {orderDetails[0].shipping_information}
              </p>
              <p>
                <strong>Trạng thái thanh toán:</strong>{" "}
                {orderDetails[0].payment_status === "unpaid"
                  ? "Chưa thanh toán"
                  : orderDetails[0].payment_status === "paid"
                  ? "Đã thanh toán"
                  : orderDetails[0].payment_status === "pending payment"
                  ? "Chờ thanh toán"
                  : ""}
              </p>
              <p>
                <strong>Trạng thái đơn hàng:</strong>{" "}
                {orderDetails[0].status === "pending confirmation"
                  ? "Chờ xác nhận"
                  : orderDetails[0].status === "pending payment"
                  ? "Chờ thanh toán"
                  : orderDetails[0].status === "shipping"
                  ? "Đang vận chuyển"
                  : orderDetails[0].status === "completed"
                  ? "Hoàn thành"
                  : orderDetails[0].status === "cancelled"
                  ? "Đã hủy"
                  : ""}
              </p>
            </div>

            <h3>Sản phẩm trong đơn hàng</h3>
            <table className={styles.productTable}>
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Màu sắc</th>
                  <th>Kích thước</th>
                  <th>Số lượng</th>
                  <th>Giá bán</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.map((product) => (
                  <tr key={product.invoice_detail_id}>
                    <td>{product.product_name}</td>
                    <td>{product.product_color}</td>
                    <td>{product.product_size}</td>
                    <td>{product.purchase_quantity}</td>
                    <td>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(product.sale_price)}
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

            <div className={styles.summary}>
              <p>
                <strong>Tổng tiền sản phẩm:</strong>{" "}
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(calculateTotalPrice())}
              </p>
              <p>
                <strong>Giảm giá: - </strong>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(orderDetails[0].discount)}
              </p>
              <p>
                <strong>Tổng thanh toán:</strong>{" "}
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(orderDetails[0].amount_sum)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsPopup;
