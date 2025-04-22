import React, { useState, useEffect } from "react";
import styles from "../CSS/Invoices.module.css";
import axios from "axios";
import InvoiceDetailsPopup from "../Components/InvoiceDetailsPopup";
import ConfirmPopup from "../Components/ConfirmPopup";
import { showToast } from "../Components/ToastProvider";

const Invoices = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [confirmType, setConfirmType] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost/E_Commerce/backend/admin/api/GetInvoices.php")
      .then((response) => {
        if (response.data.status === "success") {
          const sortedInvoices = response.data.data.sort((a, b) => {
            return new Date(b.order_date) - new Date(a.order_date);
          });
          setInvoices(sortedInvoices);
          setFilteredInvoices(sortedInvoices);
        }
      })
      .catch((error) => console.error("Error fetching invoices:", error));
  }, []);

  useEffect(() => {
    const filtered = invoices.filter((invoice) => {
      if (activeTab === "all") return true;
      if (activeTab === "pending payment")
        return invoice.status === "pending payment";
      if (activeTab === "pending confirmation")
        return invoice.status === "pending confirmation";
      if (activeTab === "shipping") return invoice.status === "shipping";
      if (activeTab === "completed") return invoice.status === "completed";
      if (activeTab === "cancelled") return invoice.status === "cancelled";
      return true;
    });

    if (searchTerm.trim() !== "") {
      setFilteredInvoices(
        filtered.filter((invoice) =>
          invoice.invoice_id.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredInvoices(filtered);
    }
  }, [activeTab, invoices, searchTerm]);

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

  const confirmInvoice = () => {
    if (!selectedInvoiceId) return;

    axios
      .post(
        "http://localhost/E_Commerce/backend/admin/api/UpdateInvoiceStatus.php",
        {
          invoice_id: selectedInvoiceId,
          status: "shipping",
        }
      )
      .then((response) => {
        if (response.data.status === "success") {
          showToast("success", "Hóa đơn đã được xác nhận");
          setInvoices((prev) =>
            prev.map((invoice) =>
              invoice.invoice_id === selectedInvoiceId
                ? { ...invoice, status: "shipping" }
                : invoice
            )
          );
        } else {
          showToast("error", "Xác nhận hóa đơn thất bại!");
        }
      })
      .catch((error) => {
        console.error("Error confirming invoice:", error);
        showToast("error", "Đã xảy ra lỗi khi xác nhận hóa đơn!");
      })
      .finally(() => {
        setIsConfirmPopupOpen(false);
        setSelectedInvoiceId(null);
        setConfirmType(null);
      });
  };

  const confirmPayment = () => {
    if (!selectedInvoiceId) return;

    axios
      .post(
        "http://localhost/E_Commerce/backend/admin/api/UpdatePaymentStatusAndStatus.php",
        {
          invoice_id: selectedInvoiceId,
          status: "pending confirmation",
          payment_status: "paid",
        }
      )
      .then((response) => {
        if (response.data.status === "success") {
          showToast("success", "Thanh toán đã được xác nhận");
          setInvoices((prev) =>
            prev.map((invoice) =>
              invoice.invoice_id === selectedInvoiceId
                ? {
                    ...invoice,
                    status: "pending confirmation",
                    payment_status: "paid",
                  }
                : invoice
            )
          );
        } else {
          showToast("error", "Xác nhận thanh toán thất bại!");
        }
      })
      .catch((error) => {
        console.error("Error confirming payment:", error);
        showToast("error", "Đã xảy ra lỗi khi xác nhận thanh toán!");
      })
      .finally(() => {
        setIsConfirmPopupOpen(false);
        setSelectedInvoiceId(null);
        setConfirmType(null);
      });
  };

  const markAsDelivered = () => {
    if (!selectedInvoiceId) return;

    axios
      .post(
        "http://localhost/E_Commerce/backend/admin/api/UpdatePaymentStatusAndStatus.php",
        {
          invoice_id: selectedInvoiceId,
          status: "completed",
          payment_status: "paid",
        }
      )
      .then((response) => {
        if (response.data.status === "success") {
          showToast("success", "Đơn hàng đã được đánh dấu là đã giao");
          setInvoices((prev) =>
            prev.map((invoice) =>
              invoice.invoice_id === selectedInvoiceId
                ? { ...invoice, status: "completed" }
                : invoice
            )
          );
        } else {
          showToast("error", "Cập nhật trạng thái thất bại!");
        }
      })
      .catch((error) => {
        console.error("Error marking as delivered:", error);
        showToast("error", "Đã xảy ra lỗi khi cập nhật trạng thái!");
      })
      .finally(() => {
        setIsConfirmPopupOpen(false);
        setSelectedInvoiceId(null);
        setConfirmType(null);
      });
  };

  const cancelInvoice = () => {
    if (!selectedInvoiceId) return;

    axios
      .post(
        "http://localhost/E_Commerce/backend/admin/api/UpdateInvoiceStatus.php",
        {
          invoice_id: selectedInvoiceId,
          status: "cancelled",
        }
      )
      .then((response) => {
        if (response.data.status === "success") {
          showToast("success", "Đơn hàng đã được hủy");
          setInvoices((prev) =>
            prev.map((invoice) =>
              invoice.invoice_id === selectedInvoiceId
                ? { ...invoice, status: "cancelled" }
                : invoice
            )
          );
        } else {
          showToast("error", "Hủy đơn hàng thất bại!");
        }
      })
      .catch((error) => {
        console.error("Error cancelling invoice:", error);
        showToast("error", "Đã xảy ra lỗi khi hủy đơn hàng!");
      })
      .finally(() => {
        setIsConfirmPopupOpen(false);
        setSelectedInvoiceId(null);
        setConfirmType(null);
      });
  };

  const handleConfirmClick = (invoiceId, type) => {
    setSelectedInvoiceId(invoiceId);
    setConfirmType(type);
    setIsConfirmPopupOpen(true);
  };

  const handleCloseConfirmPopup = () => {
    setIsConfirmPopupOpen(false);
    setSelectedInvoiceId(null);
    setConfirmType(null);
  };

  const handleViewDetails = (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedInvoiceId(null);
  };

  return (
    <div className={styles.invoicesContainer}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Tìm kiếm hóa đơn theo mã"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={styles.invoiceTabs}>
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
          Chưa xác nhận
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
          className={activeTab === "cancelled" ? styles.active : ""}
          onClick={() => setActiveTab("cancelled")}
        >
          Đã hủy
        </button>
      </div>

      <div className={styles.invoiceContent}>
        {filteredInvoices.length > 0 ? (
          <table className={styles.invoiceTable}>
            <thead>
              <tr>
                <th>Mã hóa đơn</th>
                <th>Họ tên</th>
                <th>Ngày đặt</th>
                <th>Số lượng</th>
                <th>Giảm giá</th>
                <th>Tổng tiền</th>
                <th>Thanh toán</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.invoice_id}>
                  <td>{invoice.invoice_id}</td>
                  <td>{invoice.full_name}</td>
                  <td>{invoice.order_date}</td>
                  <td>{invoice.item_total}</td>
                  <td>{formatCurrency(invoice.discount)}</td>
                  <td>{formatCurrency(invoice.amount_sum)}</td>
                  <td>
                    {invoice.payment_status === "unpaid"
                      ? "Chưa thanh toán"
                      : invoice.payment_status === "pending"
                      ? "Chờ thanh toán"
                      : "Đã thanh toán"}
                  </td>
                  <td
                    className={
                      invoice.status === "completed"
                        ? styles.statusCompleted
                        : invoice.status === "shipping"
                        ? styles.statusShipping
                        : invoice.status === "cancelled"
                        ? styles.statusCancelled
                        : styles.statusPending
                    }
                  >
                    {getStatusInVietnamese(invoice.status)}
                  </td>
                  <td>
                    <div className={styles.buttonGroup}>
                      <button
                        className={styles.viewButton}
                        onClick={() => handleViewDetails(invoice.invoice_id)}
                      >
                        Xem thêm
                      </button>
                      {invoice.status === "pending confirmation" && (
                        <button
                          className={styles.confirmButton}
                          onClick={() =>
                            handleConfirmClick(invoice.invoice_id, "confirm")
                          }
                        >
                          Xác nhận
                        </button>
                      )}
                      {invoice.status === "pending payment" && (
                        <button
                          className={styles.paymentButton}
                          onClick={() =>
                            handleConfirmClick(invoice.invoice_id, "payment")
                          }
                        >
                          Thanh toán
                        </button>
                      )}
                      {invoice.status === "shipping" && (
                        <>
                          <button
                            className={styles.deliveredButton}
                            onClick={() =>
                              handleConfirmClick(invoice.invoice_id, "deliver")
                            }
                          >
                            Đã giao
                          </button>
                          <button
                            className={styles.cancelButton}
                            onClick={() =>
                              handleConfirmClick(invoice.invoice_id, "cancel")
                            }
                          >
                            Hủy
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={styles.noData}>Không có hóa đơn nào.</p>
        )}
      </div>

      {isPopupOpen && (
        <InvoiceDetailsPopup
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          invoiceId={selectedInvoiceId}
        />
      )}

      {isConfirmPopupOpen && (
        <ConfirmPopup
          message={
            confirmType === "payment"
              ? "Bạn có chắc muốn xác nhận thanh toán cho đơn hàng này không?"
              : confirmType === "confirm"
              ? "Bạn có chắc chắn muốn xác nhận hóa đơn này?"
              : confirmType === "deliver"
              ? "Bạn có chắc chắn muốn đánh dấu đơn hàng này là đã giao?"
              : "Bạn có chắc chắn muốn hủy đơn hàng này?"
          }
          onClose={handleCloseConfirmPopup}
          onConfirm={
            confirmType === "payment"
              ? confirmPayment
              : confirmType === "confirm"
              ? confirmInvoice
              : confirmType === "deliver"
              ? markAsDelivered
              : cancelInvoice
          }
        />
      )}
    </div>
  );
};

export default Invoices;
