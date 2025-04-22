import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import styles from "../CSS/Checkout.module.css";
import { useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { useCart } from "../Context/CartContext";
import Popup from "../Components/Popup";
import AddressPopup from "../Components/AddressPopup";
import VoucherPopup from "../Components/VoucherPopup";
import PaymentMethodPopup from "../Components/PaymentMethodPopup";

const Checkout = () => {
  const { accountId } = useAuth();
  const { fetchCartCount } = useCart();
  const location = useLocation();
  const { selectedCartItems, totalAmount } = location.state || {
    selectedCartItems: [],
    totalAmount: 0,
  };

  const [allAddress, setAllAddress] = useState("");
  const [addressDefault, setAddressDefault] = useState("");
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isAddressEmpty, settIsAddressEmpty] = useState(false);
  const [discountCodes, setDiscountCodes] = useState([]);
  const [isVoucherPopupOpen, setVoucherPopupOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [qrCodeUrl, setQrCodeUrl] = useState("/");
  const [finalTotal, setFinalTotal] = useState(totalAmount);
  const [isPaymentPopupOpen, setPaymentPopupOpen] = useState(false);
  const invoiceId = Math.floor(
    100000000 + Math.random() * 999999999
  ).toString();
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const navigate = useNavigate();

  const getDefaultAddress = (addresses) => {
    if (!Array.isArray(addresses)) return "Chưa có địa chỉ nào!";
    const defaultAddr = addresses.find((addr) => addr.address_default === 1);
    return defaultAddr ? defaultAddr : null;
  };

  useEffect(() => {
    if (!accountId) return;

    axios
      .post(
        "http://localhost/E_Commerce/backend/user/api/GetAllAddresses.php",
        {
          id: accountId,
        }
      )
      .then((response) => {
        if (response.data.data.status === "success") {
          setAllAddress(response.data.data.data);
        } else {
          setAllAddress([]);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy địa chỉ:", error);
        setAllAddress([]);
      });
  }, [accountId]);

  useEffect(() => {
    setAddressDefault(getDefaultAddress(allAddress));
  }, [allAddress]);

  useEffect(() => {
    if (!accountId) return;

    axios
      .post(
        "http://localhost/E_Commerce/backend/user/api/GetDiscountCodes.php",
        {
          id: accountId,
        }
      )
      .then((response) => {
        if (response.data.status === "success") {
          setDiscountCodes(response.data.data);
        } else {
          setDiscountCodes([]);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy mã giảm giá:", error);
        setDiscountCodes([]);
      });
  }, [accountId]);

  useEffect(() => {
    if (selectedVoucher) {
      let tempDiscount = selectedVoucher.discount_value;
      if (tempDiscount < 100) {
        setDiscountAmount((totalAmount * tempDiscount) / 100);
      } else {
        setDiscountAmount(tempDiscount);
      }
    } else {
      setDiscountAmount(0);
    }

    setFinalTotal(totalAmount - discountAmount);
  }, [selectedVoucher, totalAmount, discountAmount]);

  const handleVnpayPayment = async () => {
    try {
      const response = await axios.post(
        "http://localhost/E_Commerce/backend/user/api/api_VNPAY/CreateVNPAYPayment.php",
        { amount: finalTotal, invoiceId: invoiceId }
      );

      if (response.data.status === "success") {
        setQrCodeUrl(response.data.payment_url);
      }
    } catch (error) {
      console.error("Lỗi khi tạo thanh toán VNPAY:", error);
    }
  };

  const handleMoMoPayment = async () => {
    try {
      const response = await axios.post(
        "http://localhost/E_Commerce/backend/user/api/api_MOMO/CreateMoMoPayment.php",
        { amount: finalTotal, invoiceId: invoiceId }
      );

      if (response.data.resultCode === 0) {
        setQrCodeUrl(response.data.payUrl);
      } else {
        console.error("Lỗi thanh toán:", response.data.message);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API MoMo:", error);
    }
  };

  const handleSelectPaymentMethod = (method) => {
    setPaymentMethod(method);
  };

  const handlePlaceOrder = async () => {
    if (!accountId || !addressDefault || selectedCartItems.length === 0) {
      setPopupMessage("Vui lòng điền địa chỉ giao hàng");
      setShowPopup(true);
      settIsAddressEmpty(true);
      return;
    }

    const itemTotal = selectedCartItems.length;
    let shippingInformation = `${addressDefault.contact_name}, ${addressDefault.contact_phone}, ${addressDefault.address_details}, ${addressDefault.address}`;
    let paymentStatus = "unpaid";
    let status = "pending confirmation";

    if (paymentMethod === "vnpay" || paymentMethod === "momo") {
      paymentStatus = "pending payment";
      status = "pending payment";
    }

    const orderData = {
      invoiceId: invoiceId,
      accountId: accountId,
      itemTotal: itemTotal,
      discountId: selectedVoucher?.discount_id || null,
      discount: discountAmount,
      amountSum: finalTotal,
      paymentStatus: paymentStatus,
      shippingInformation: shippingInformation,
      paymentMethod: paymentMethod,
      status: status,
      orderItems: selectedCartItems.map((item) => ({
        productId: item.product_id,
        productDetailId: item.product_detail_id,
        productName: item.product_name,
        colorId: item.color_id,
        colorName: item.color_name,
        sizeId: item.size_id,
        sizeName: item.size_name,
        purchaseQuantity: item.purchase_quantity,
        price: item.price,
        salePrice: item.sale_price,
      })),
    };

    try {
      const response = await axios.post(
        "http://localhost/E_Commerce/backend/user/api/AddOrder.php",
        orderData
      );

      if (response.data.status === "success") {
        if (paymentMethod === "COD") {
          setPopupMessage("Đơn hàng đã được đặt thành công");
          settIsAddressEmpty(false);
        } else if (paymentMethod === "vnpay" || paymentMethod === "momo") {
          setPopupMessage(
            "Đơn hàng của bạn đang chờ thanh toán, vui lòng thanh toán để hoàn tất đơn hàng"
          );
        }
        setShowPopup(true);
      } else {
        setPopupMessage(`Lỗi đặt hàng: ${response.data.message}`);
        setShowPopup(true);
      }
    } catch (error) {
      console.error("Lỗi khi gửi đơn hàng:", error);
      setPopupMessage("Đã xảy ra lỗi khi đặt hàng!");
      setShowPopup(true);
    }

    if (paymentMethod === "vnpay") {
      handleVnpayPayment();
    } else if (paymentMethod === "momo") {
      handleMoMoPayment();
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    if (!isAddressEmpty) {
      fetchCartCount(accountId);
      if (paymentMethod === "COD") {
        navigate(qrCodeUrl);
      } else if (paymentMethod === "vnpay" || paymentMethod === "momo") {
        window.location.href = qrCodeUrl;
      }
    }
  };

  return (
    <div className={styles.checkoutContainer}>
      <div className={styles.addressBar}>
        <div className={styles.addressTitle}>
          <FaMapMarkerAlt size={20} />
          Thông tin giao hàng
        </div>

        {addressDefault ? (
          <div className={styles.addressContent}>
            <div className={styles.addressContact}>
              <p>{addressDefault.contact_name},</p>
              <p>{addressDefault.contact_phone}</p>
              <p className={styles.isDefault}>Mặc định</p>
            </div>
            <div className={styles.addressInfo}>
              <p>
                {addressDefault.address_details},{" "}
                <span>{addressDefault.address}</span>
              </p>
            </div>
            <span
              className={styles.editIcon}
              onClick={() => setPopupOpen(true)}
            >
              ✎
            </span>
          </div>
        ) : (
          <p className={styles.noAddressMessage}>
            Bạn chưa có thông tin giao hàng mặc định
            <span
              className={styles.editIcon}
              onClick={() => setPopupOpen(true)}
            >
              ✎
            </span>
          </p>
        )}
      </div>
      {selectedCartItems.length === 0 ? (
        <p>Không có sản phẩm nào được chọn.</p>
      ) : (
        <div className={styles.checkoutParent}>
          <div className={styles.checkoutTitle}>
            <div className={styles.leftText}>Hình ảnh</div>
            <div className={styles.leftText}>Tên sản phẩm</div>
            <div>Phân loại</div>
            <div>Đơn giá</div>
            <div>Số lượng</div>
            <div>Thành tiền</div>
          </div>

          {selectedCartItems.map((item) => (
            <div key={item.product_detail_id} className={styles.checkoutItem}>
              <img
                src={item.image_url}
                alt={item.product_name}
                className={styles.checkoutImage}
              />
              <div className={styles.checkoutItemContent}>
                <h3 className={styles.checkoutItemName}>{item.product_name}</h3>
                <div className={styles.checkoutItemCategory}>
                  <p>{item.color_name},</p>
                  <p>{item.size_name}</p>
                </div>
                <div className={styles.checkoutItemPriceWrapper}>
                  <p className={styles.checkoutItemPrice}>
                    <del>
                      {Number(item.price)
                        .toFixed(0)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                      <u>đ</u>
                    </del>
                  </p>
                  <p className={styles.checkoutItemSalePrice}>
                    {Number(item.sale_price)
                      .toFixed(0)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                    <u>đ</u>
                  </p>
                </div>
                <div className={styles.quantity}>
                  <p>{item.purchase_quantity}</p>
                </div>
                <p className={styles.subTotal}>
                  {Number(item.sale_price * item.purchase_quantity)
                    .toFixed(0)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                  <u>đ</u>
                </p>
              </div>
            </div>
          ))}
          <div className={styles.totalAmount}>
            <p>Tổng số tiền ({selectedCartItems.length} sản phẩm):</p>
            <span>
              {totalAmount.toLocaleString()} <u>đ</u>
            </span>
          </div>
          <div className={styles.voucherParent}>
            <p>
              <img src="/images/frontend_icons/voucher.png" alt="voucher" />
              EMK Voucher
            </p>
            <p>
              <span>
                {selectedVoucher ? `- ${discountAmount.toLocaleString()}đ` : ""}
              </span>
              <button onClick={() => setVoucherPopupOpen(true)}>
                Thay đổi Voucher
              </button>
            </p>
          </div>
          <div className={styles.paymentMethod}>
            <h3>Phương thức thanh toán</h3>
            <div className={styles.paymentDisplay}>
              <span>
                {paymentMethod === "COD"
                  ? "Thanh toán khi nhận hàng"
                  : paymentMethod === "vnpay"
                  ? "Thanh toán qua VNPAY"
                  : "Thanh toán qua MoMo"}
              </span>
              <button onClick={() => setPaymentPopupOpen(true)}>
                Thay đổi
              </button>
            </div>
          </div>
          <div className={styles.paymentSummary}>
            <h3>Tóm tắt thanh toán</h3>
            <div className={styles.paymentRow}>
              <p>Tổng tiền hàng:</p>
              <span>{totalAmount.toLocaleString()} đ</span>
            </div>
            <div className={styles.paymentRow}>
              <p>Voucher giảm giá:</p>
              <span>- {discountAmount.toLocaleString()} đ</span>
            </div>
            <div className={styles.paymentTotal}>
              <p>Tổng thanh toán:</p>
              <span>{finalTotal.toLocaleString()} đ</span>
            </div>
            <button className={styles.orderButton} onClick={handlePlaceOrder}>
              Đặt hàng
            </button>
          </div>
        </div>
      )}

      {showPopup && <Popup message={popupMessage} onClose={closePopup} />}

      <AddressPopup
        isOpen={isPopupOpen}
        onClose={() => setPopupOpen(false)}
        allAddress={allAddress}
        setAllAddress={setAllAddress}
      />

      <VoucherPopup
        isOpen={isVoucherPopupOpen}
        onClose={() => setVoucherPopupOpen(false)}
        discountCodes={discountCodes}
        setSelectedVoucher={setSelectedVoucher}
      />
      <PaymentMethodPopup
        isOpen={isPaymentPopupOpen}
        onClose={() => setPaymentPopupOpen(false)}
        defaultMethod={paymentMethod}
        onSelect={handleSelectPaymentMethod}
      />
    </div>
  );
};

export default Checkout;
