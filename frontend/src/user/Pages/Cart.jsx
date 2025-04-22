import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../CSS/Cart.module.css";
import { useAuth } from "../Context/AuthContext";
import { useCart } from "../Context/CartContext";
import { showToast } from "../Components/ToastProvider";

const Cart = () => {
  const { accountId } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const { fetchCartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(
          `http://localhost/E_Commerce/backend/user/api/GetFullProductData.php?id=${accountId}`
        );
        const cartData = response.data.data;

        if (!cartData || cartData.length === 0) {
          setCartItems([]);
          return;
        }

        setCartItems(cartData);
      } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng:", error);
      }
    };

    if (accountId) {
      fetchCart();
    }
  }, [accountId]);

  const handleSelectItem = (item) => {
    setSelectedItems((prevSelectedItems) => {
      const isSelected = prevSelectedItems.includes(item.product_detail_id);
      let newSelectedItems;

      if (isSelected) {
        newSelectedItems = prevSelectedItems.filter(
          (id) => id !== item.product_detail_id
        );
      } else {
        newSelectedItems = [...prevSelectedItems, item.product_detail_id];
      }

      setSelectAll(newSelectedItems.length === cartItems.length);

      const newTotalAmount = cartItems.reduce(
        (sum, cartItem) =>
          newSelectedItems.includes(cartItem.product_detail_id)
            ? sum + cartItem.sale_price * cartItem.purchase_quantity
            : sum,
        0
      );
      setTotalAmount(newTotalAmount);

      return newSelectedItems;
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
      setTotalAmount(0);
    } else {
      const allItems = cartItems.map((item) => item.product_detail_id);
      const amount = cartItems.reduce(
        (sum, item) => sum + item.sale_price * item.purchase_quantity,
        0
      );
      setSelectedItems(allItems);
      setTotalAmount(amount);
    }
    setSelectAll(!selectAll);
  };

  const handleQuantityChange = async (item, increment) => {
    setCartItems((prevCartItems) => {
      const updatedCartItems = prevCartItems.map((cartItem) => {
        if (cartItem.product_detail_id === item.product_detail_id) {
          let newQuantity = Number(cartItem.purchase_quantity) + increment;
          newQuantity = Math.max(1, Math.min(newQuantity, item.quantity));
          return { ...cartItem, purchase_quantity: newQuantity };
        }
        return cartItem;
      });

      const newTotalAmount = updatedCartItems.reduce(
        (sum, cartItem) =>
          selectedItems.includes(cartItem.product_detail_id)
            ? sum + cartItem.sale_price * cartItem.purchase_quantity
            : sum,
        0
      );

      setTotalAmount(newTotalAmount);

      return updatedCartItems;
    });
    try {
      await axios.post(
        "http://localhost/E_Commerce/backend/user/api/UpdateCartQuantity.php",
        {
          cartId: item.cart_id,
          newQuantity: Number(item.purchase_quantity) + increment,
        }
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng:", error);
    }
  };

  const handleRemove = async (productDetailId = null) => {
    let itemsToRemove = productDetailId ? [productDetailId] : selectedItems;

    if (itemsToRemove.length === 0) {
      showToast("error", "Vui lòng chọn sản phẩm cần xóa");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost/E_Commerce/backend/user/api/RemoveProductFromCart.php",
        { accountId, productDetailIds: itemsToRemove },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.status === "success") {
        setCartItems((prevCartItems) =>
          prevCartItems.filter(
            (item) => !itemsToRemove.includes(item.product_detail_id)
          )
        );
        setSelectedItems((prevSelectedItems) =>
          prevSelectedItems.filter((id) => !itemsToRemove.includes(id))
        );
        setTotalAmount(0);
        fetchCartCount(accountId);
      } else {
        console.error("Lỗi khi xóa sản phẩm:", response.data.message);
      }
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };

  const handlePay = () => {
    const selectedCartItems = cartItems.filter((item) =>
      selectedItems.includes(item.product_detail_id)
    );

    if (selectedCartItems.length > 0) {
      navigate("checkout", { state: { selectedCartItems, totalAmount } });
    } else {
      showToast("error", "Bạn chưa chọn sản phẩm nào để thanh toán");
      return;
    }
  };

  return (
    <div className={styles.cartContainer}>
      {cartItems.length > 0 ? (
        <div className={styles.cartParent}>
          <div className={styles.cartTitle}>
            <div className={styles.selectCheckbox}>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </div>
            <div className={styles.leftText}>Sản phẩm</div>
            <div className={styles.leftText}>Tên sản phẩm</div>
            <div>Phân loại</div>
            <div>Đơn giá</div>
            <div>Số lượng</div>
            <div>Thành tiền</div>
            <div>Thao tác</div>
          </div>
          {cartItems.map((item) => (
            <div key={item.product_detail_id} className={styles.cartItem}>
              <div>
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.product_detail_id)}
                  onChange={() => handleSelectItem(item)}
                />
              </div>
              <div className={styles.cartItemDetails}>
                <img
                  src={item.image_url}
                  alt={item.product_name}
                  className={styles.cartImage}
                />
                <div className={styles.cartItemContent}>
                  <h3 className={styles.cartItemName}>{item.product_name}</h3>
                  <div className={styles.cartItemCategory}>
                    <p>{item.color_name},</p>
                    <p>{item.size_name}</p>
                  </div>
                  <div className={styles.cartItemPriceWrapper}>
                    <p className={styles.cartItemPrice}>
                      <del>
                        {Number(item.price)
                          .toFixed(0)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                        <u>đ</u>
                      </del>
                    </p>
                    <p className={styles.cartItemSalePrice}>
                      {Number(item.sale_price)
                        .toFixed(0)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                      <u>đ</u>
                    </p>
                  </div>
                  <div className={styles.quantityInput}>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(item, -1)}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      value={item.purchase_quantity}
                      onChange={(e) => {
                        let newQuantity = e.target.value.replace(/\D/g, "");
                        if (newQuantity === "") newQuantity = "1";
                        newQuantity =
                          Math.min(parseInt(newQuantity), item.quantity) || 1;

                        setCartItems((prevCartItems) =>
                          prevCartItems.map((cartItem) =>
                            cartItem.product_detail_id ===
                            item.product_detail_id
                              ? {
                                  ...cartItem,
                                  purchase_quantity: newQuantity,
                                }
                              : cartItem
                          )
                        );
                      }}
                      onBlur={async (e) => {
                        try {
                          await axios.post(
                            "http://localhost/E_Commerce/backend/user/api/UpdateCartQuantity.php",
                            {
                              cartId: item.cart_id,
                              newQuantity: Number(item.purchase_quantity),
                            }
                          );
                        } catch (error) {
                          console.error("Lỗi khi cập nhật số lượng:", error);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(item, 1)}
                    >
                      +
                    </button>
                  </div>
                  <p className={styles.subTotal}>
                    {Number(item.sale_price * item.purchase_quantity)
                      .toFixed(0)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                    <u>đ</u>
                  </p>
                  <button
                    className={styles.removeButton}
                    onClick={() => handleRemove(item.product_detail_id)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className={styles.orderInfo}>
            <div className={styles.selectAll}>
              <label htmlFor="selectAll">
                <input
                  type="checkbox"
                  id="selectAll"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
                <span className={styles.leftText}>
                  Chọn tất cả ({cartItems.length})
                </span>
              </label>
            </div>
            <div className={styles.leftText}>
              <button
                className={styles.deleteButton}
                onClick={() => handleRemove()}
              >
                Xóa sản phẩm đã chọn
              </button>
            </div>
            <div className={styles.leftText}>
              Số sản phẩm đã chọn: {selectedItems.length}
            </div>
            <div className={`${styles.leftText} ${styles.totalAmount}`}>
              Tổng số tiền:{" "}
              <span>
                {totalAmount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                <u>đ</u>
              </span>
            </div>
            <div className={styles.rightText}>
              <button className={styles.payButton} onClick={handlePay}>
                Thanh toán ({selectedItems.length})
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.emptyCartContainer}>
          <p className={styles.emptyCart}>Giỏ hàng trống</p>
          <button className={styles.buyNowButton} onClick={() => navigate("/")}>
            Mua hàng ngay
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
