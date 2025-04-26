import React, { useState, useEffect } from "react";
import styles from "../CSS/Orders.module.css";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import { showToast } from "../Components/ToastProvider";
import OrderDetailsPopup from "../Components/OrderDetailsPopup";
import ConfirmPopup from "../Components/ConfirmPopup";
import ReviewStars from "../Components/ReviewStars";

const Orders = () => {
  const { accountId } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [pendingRatings, setPendingRatings] = useState([]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [isRatingPopupOpen, setIsRatingPopupOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedInvoiceIdForRating, setSelectedInvoiceIdForRating] = useState(
    null
  );
  const [confirmType, setConfirmType] = useState(null);

  useEffect(() => {
    axios
      .get(
        `http://localhost/E_Commerce/backend/user/api/GetInvoices.php?account_id=${accountId}`
      )
      .then((response) => {
        if (response.data.status === "success") {
          setOrders(response.data.data);
          setFilteredOrders(response.data.data);
        } else {
          showToast("error", "Không thể tải danh sách đơn hàng.");
        }
      })
      .catch((error) => {
        console.error("Error fetching invoices:", error);
        showToast("error", "Lỗi khi lấy dữ liệu đơn hàng!");
      });
  }, [accountId]);

  useEffect(() => {
    axios
      .get(
        `http://localhost/E_Commerce/backend/user/api/GetPendingRatings.php?account_id=${accountId}`
      )
      .then((response) => {
        if (response.data.status === "success") {
          setPendingRatings(response.data.data);
        } else {
          showToast("error", "Không thể tải danh sách sản phẩm chờ đánh giá.");
        }
      })
      .catch((error) => {
        console.error("Error fetching pending ratings:", error);
        showToast("error", "Lỗi khi lấy dữ liệu chờ đánh giá!");
      });
  }, [accountId]);

  useEffect(() => {
    if (activeTab === "pending ratings") {
      return;
    }
    const filtered = orders.filter((order) => {
      if (activeTab === "all") return true;
      if (activeTab === "pending payment")
        return order.status === "pending payment";
      if (activeTab === "pending confirmation")
        return order.status === "pending confirmation";
      if (activeTab === "shipping") return order.status === "shipping";
      if (activeTab === "completed") return order.status === "completed";
      if (activeTab === "cancelled") return order.status === "cancelled";
      return true;
    });
    setFilteredOrders(filtered);
  }, [activeTab, orders]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

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

  const openPopup = (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    setIsPopupOpen(true);
  };

  const confirmPopup = (invoiceId, type) => {
    setSelectedInvoiceId(invoiceId);
    setConfirmType(type);
    setIsConfirmPopupOpen(true);
  };

  const confirmReceived = () => {
    axios
      .post(
        "http://localhost/E_Commerce/backend/user/api/UpdateInvoiceStatus.php",
        {
          invoice_id: selectedInvoiceId,
          status: "completed",
        }
      )
      .then((response) => {
        if (response.data.status === "success") {
          showToast(
            "success",
            "Đã xác nhận nhận hàng. Vui lòng đánh giá các sản phẩm trong đơn hàng."
          );
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.invoice_id === selectedInvoiceId
                ? { ...order, status: "completed", payment_status: "paid" }
                : order
            )
          );
        } else {
          showToast("error", "Không thể xác nhận đơn hàng!");
        }
      })
      .catch(() => showToast("error", "Lỗi khi xác nhận đơn hàng!"))
      .finally(() => {
        setIsConfirmPopupOpen(false);
        setConfirmType(null);
      });
  };

  const cancelOrder = () => {
    axios
      .post(
        "http://localhost/E_Commerce/backend/user/api/UpdateInvoiceStatus.php",
        {
          invoice_id: selectedInvoiceId,
          status: "cancelled",
        }
      )
      .then((response) => {
        if (response.data.status === "success") {
          showToast("success", "Đơn hàng đã được hủy thành công.");
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.invoice_id === selectedInvoiceId
                ? { ...order, status: "cancelled" }
                : order
            )
          );
        } else {
          showToast("error", "Không thể hủy đơn hàng!");
        }
      })
      .catch(() => showToast("error", "Lỗi khi hủy đơn hàng!"))
      .finally(() => {
        setIsConfirmPopupOpen(false);
        setConfirmType(null);
      });
  };

  const handleRateProduct = (productId, invoiceId) => {
    setSelectedProductId(productId);
    setSelectedInvoiceIdForRating(invoiceId);
    setIsRatingPopupOpen(true);
  };

  const handleRatingClose = (wasSuccessful) => {
    setIsRatingPopupOpen(false);
    if (wasSuccessful) {
      setPendingRatings((prevRatings) =>
        prevRatings.filter((item) => item.product_id !== selectedProductId)
      );
    }
    setSelectedProductId(null);
    setSelectedInvoiceIdForRating(null);
  };

  return (
    <div className={styles.ordersContainer}>
      <div className={styles.orderTabs}>
        <button
          className={activeTab === "all" ? styles.active : ""}
          onClick={() => setActiveTab("all")}
        >
          Tất cả
        </button>
        <button
          className={activeTab === "pending payment" ? styles.active : ""}
          onClick={() => setActiveTab("pending payment")}
        >
          Chờ thanh toán
        </button>
        <button
          className={activeTab === "pending confirmation" ? styles.active : ""}
          onClick={() => setActiveTab("pending confirmation")}
        >
          Chờ xác nhận
        </button>
        <button
          className={activeTab === "shipping" ? styles.active : ""}
          onClick={() => setActiveTab("shipping")}
        >
          Đang vận chuyển
        </button>
        <button
          className={activeTab === "completed" ? styles.active : ""}
          onClick={() => setActiveTab("completed")}
        >
          Hoàn thành
        </button>
        <button
          className={activeTab === "pending ratings" ? styles.active : ""}
          onClick={() => setActiveTab("pending ratings")}
        >
          Chờ đánh giá
        </button>
        <button
          className={activeTab === "cancelled" ? styles.active : ""}
          onClick={() => setActiveTab("cancelled")}
        >
          Đã hủy
        </button>
      </div>

      <div className={styles.orderContent}>
        {activeTab === "pending ratings" ? (
          pendingRatings.length > 0 ? (
            <>
              {/* Table for Desktop */}
              <table className={styles.orderTable}>
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Ngày nhận hàng</th>
                    <th>Hình ảnh</th>
                    <th>Tên sản phẩm</th>
                    <th>Giá</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRatings.map((item) => (
                    <tr key={item.pending_rating_id}>
                      <td>{item.invoice_id}</td>
                      <td>{item.created_at}</td>
                      <td>
                        <img
                          src={item.image}
                          alt={item.product_name}
                          className={styles.productImage}
                        />
                      </td>
                      <td>{item.product_name}</td>
                      <td>{formatCurrency(item.price)}</td>
                      <td>
                        <button
                          className={styles.rateButton}
                          onClick={() =>
                            handleRateProduct(item.product_id, item.invoice_id)
                          }
                        >
                          Đánh giá
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Cards for Mobile */}
              {pendingRatings.map((item) => (
                <div className={styles.orderCard} key={item.pending_rating_id}>
                  <div className={styles.orderCardHeader}>
                    <span>Mã đơn: {item.invoice_id}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.product_name}
                      className={styles.productImage}
                    />
                    <div>
                      <div>{item.product_name}</div>
                      <div>{formatCurrency(item.price)}</div>
                      <div>Ngày nhận: {item.created_at}</div>
                    </div>
                  </div>
                  <div className={styles.orderCardActions}>
                    <button
                      className={styles.rateButton}
                      onClick={() =>
                        handleRateProduct(item.product_id, item.invoice_id)
                      }
                    >
                      Đánh giá
                    </button>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <p className={styles.noData}>Không có sản phẩm nào chờ đánh giá.</p>
          )
        ) : filteredOrders.length > 0 ? (
          <>
            {/* Table for Desktop */}
            <table className={styles.orderTable}>
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Ngày đặt</th>
                  <th>Số lượng</th>
                  <th>Giảm giá</th>
                  <th>Tổng tiền</th>
                  <th>Thanh toán</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr
                    key={order.invoice_id ? order.invoice_id : `order-${index}`}
                  >
                    <td>{order.invoice_id}</td>
                    <td>{order.order_date}</td>
                    <td>{order.item_total}</td>
                    <td>{formatCurrency(order.discount)}</td>
                    <td>{formatCurrency(order.amount_sum)}</td>
                    <td>
                      {order.payment_status === "unpaid"
                        ? "Chưa thanh toán"
                        : "Đã thanh toán"}
                    </td>
                    <td
                      className={
                        order.status === "completed"
                          ? styles.statusCompleted
                          : order.status === "cancelled"
                          ? styles.statusCancelled
                          : styles.statusPending
                      }
                    >
                      {getStatusInVietnamese(order.status)}
                    </td>
                    <td>
                      <div className={styles.buttonGroup}>
                        <button
                          className={styles.viewButton}
                          onClick={() => openPopup(order.invoice_id)}
                        >
                          Xem thêm
                        </button>
                        {order.status === "shipping" && (
                          <button
                            className={styles.confirmButton}
                            onClick={() =>
                              confirmPopup(order.invoice_id, "received")
                            }
                          >
                            Đã nhận
                          </button>
                        )}
                        {(order.status === "pending payment" ||
                          order.status === "pending confirmation") && (
                          <button
                            className={styles.cancelButton}
                            onClick={() =>
                              confirmPopup(order.invoice_id, "cancel")
                            }
                          >
                            Hủy
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Cards for Mobile */}
            {filteredOrders.map((order) => (
              <div className={styles.orderCard} key={order.invoice_id}>
                <div className={styles.orderCardHeader}>
                  <span>Mã đơn: {order.invoice_id}</span>
                  <span
                    className={
                      order.status === "completed"
                        ? styles.statusCompleted
                        : order.status === "cancelled"
                        ? styles.statusCancelled
                        : styles.statusPending
                    }
                  >
                    {getStatusInVietnamese(order.status)}
                  </span>
                </div>
                <div>Tổng tiền: {formatCurrency(order.amount_sum)}</div>
                <div>Ngày đặt: {order.order_date}</div>
                <div>
                  Thanh toán:{" "}
                  {order.payment_status === "unpaid"
                    ? "Chưa thanh toán"
                    : "Đã thanh toán"}
                </div>
                <div className={styles.orderCardActions}>
                  <button
                    className={styles.viewButton}
                    onClick={() => openPopup(order.invoice_id)}
                  >
                    Xem thêm
                  </button>
                  {order.status === "shipping" && (
                    <button
                      className={styles.confirmButton}
                      onClick={() => confirmPopup(order.invoice_id, "received")}
                    >
                      Đã nhận
                    </button>
                  )}
                  {(order.status === "pending payment" ||
                    order.status === "pending confirmation") && (
                    <button
                      className={styles.cancelButton}
                      onClick={() => confirmPopup(order.invoice_id, "cancel")}
                    >
                      Hủy
                    </button>
                  )}
                </div>
              </div>
            ))}
          </>
        ) : (
          <p className={styles.noData}>Không có đơn hàng nào.</p>
        )}
      </div>

      <OrderDetailsPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        invoiceId={selectedInvoiceId}
      />

      {isConfirmPopupOpen && (
        <ConfirmPopup
          onClose={() => {
            setIsConfirmPopupOpen(false);
            setConfirmType(null);
          }}
          onConfirm={() => {
            if (confirmType === "received") {
              confirmReceived();
            } else if (confirmType === "cancel") {
              cancelOrder();
            }
          }}
          message={
            confirmType === "cancel"
              ? "Bạn có chắc chắn muốn hủy đơn hàng này không?"
              : "Bạn có chắc chắn muốn xác nhận đã nhận hàng không?"
          }
        />
      )}

      <ReviewStars
        isOpen={isRatingPopupOpen}
        account_id={accountId}
        product_id={selectedProductId}
        invoice_id={selectedInvoiceIdForRating}
        onClose={handleRatingClose}
      />
    </div>
  );
};

export default Orders;
