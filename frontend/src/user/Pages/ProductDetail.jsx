import React, { useState, useEffect } from "react";
import Rating from "../Components/Rating";
import { useParams, useNavigate } from "react-router-dom";
import Banner from "../Components/Banner";
import { useAuth } from "../Context/AuthContext";
import { useCart } from "../Context/CartContext";
import { showToast } from "../Components/ToastProvider";
import styles from "../CSS/ProductDetail.module.css";

function ProductDetail() {
  const { accountId } = useAuth();
  const { productId } = useParams();
  const { fetchCartCount } = useCart();
  const navigate = useNavigate();

  // State cho sản phẩm chính
  const [productData, setProductData] = useState(null);
  const [productLoading, setProductLoading] = useState(true);
  const [productError, setProductError] = useState(null);

  // State cho chi tiết sản phẩm, ảnh, và các lựa chọn
  const [productDetails, setProductDetails] = useState([]);
  const [colorName, setColorName] = useState({});
  const [sizeName, setSizeName] = useState({});
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [allImages, setAllImages] = useState([]);
  const [stock, setStock] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [hasError, setHasError] = useState(false);

  const fetchData = async (tableName, columnName, id, fetchType = null) => {
    try {
      const response = await fetch(
        `http://localhost/E_Commerce/backend/user/api/GetDataById.php?table=${tableName}&columnName=${columnName}&id=${id}&fetchType=${fetchType}`
      );
      const result = await response.json();
      if (result.status === "success") {
        return result.data;
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      throw new Error(err.message || "Có lỗi xảy ra khi tải dữ liệu");
    }
  };

  // Cuộn lên đầu khi thay đổi sản phẩm
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  // Fetch dữ liệu sản phẩm chính
  useEffect(() => {
    const fetchProductData = async () => {
      setProductLoading(true);
      try {
        const data = await fetchData("products", "product_id", productId);
        setProductData(data);
      } catch (err) {
        setProductError(err.message);
      } finally {
        setProductLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  // Fetch chi tiết sản phẩm và ảnh
  useEffect(() => {
    const fetchDetailsAndImages = async () => {
      try {
        // Fetch chi tiết sản phẩm
        const detailsData = await fetchData(
          "product_details",
          "product_id",
          productId,
          "all"
        );
        setProductDetails(detailsData);

        // Fetch tên màu sắc
        const colorIds = [
          ...new Set(detailsData.map((detail) => detail.color_id)),
        ];
        const colorPromises = colorIds.map((colorId) =>
          fetchData("product_colors", "color_id", colorId)
        );
        const colorsData = await Promise.all(colorPromises);
        const colorMap = colorsData.reduce((acc, color) => {
          acc[color.color_id] = color.color_name;
          return acc;
        }, {});
        setColorName(colorMap);

        // Fetch tên kích thước
        const sizeIds = [
          ...new Set(detailsData.map((detail) => detail.size_id)),
        ];
        const sizePromises = sizeIds.map((sizeId) =>
          fetchData("product_sizes", "size_id", sizeId)
        );
        const sizesData = await Promise.all(sizePromises);
        const sizeMap = sizesData.reduce((acc, size) => {
          acc[size.size_id] = size.size_name;
          return acc;
        }, {});
        setSizeName(sizeMap);

        // Fetch ảnh sản phẩm
        const imagesData = await fetchData(
          "product_images",
          "product_id",
          productId,
          "all"
        );
        const images = imagesData.map((item) => item.image);
        setAllImages(images);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      }
    };

    fetchDetailsAndImages();
  }, [productId]);

  // Cập nhật số lượng tồn kho
  useEffect(() => {
    if (selectedSize && selectedColor && productDetails.length > 0) {
      const selectedVariant = productDetails.find(
        (detail) =>
          detail.size_id === selectedSize && detail.color_id === selectedColor
      );
      setStock(selectedVariant ? selectedVariant.quantity : 0);
    }
  }, [selectedSize, selectedColor, productDetails]);

  // Các hàm xử lý
  const changeQuantity = (amount) => {
    setQuantity((prev) => Math.max(1, Math.min(stock, prev + amount)));
  };

  const addToCart = () => {
    if (!accountId) {
      showToast("error", "Bạn cần đăng nhập để sử dụng chức năng này.");
      return;
    }
    if (!selectedSize || !selectedColor) {
      showToast("warning", "Vui lòng chọn đầy đủ kích thước và màu sắc.");
      return;
    }
    if (stock === 0) {
      showToast("error", "Sản phẩm này hiện không còn trong kho.");
      return;
    }

    fetch("http://localhost/E_Commerce/backend/user/api/AddToCart.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accountId,
        productId,
        colorId: selectedColor,
        sizeId: selectedSize,
        quantity,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          showToast("success", "Sản phẩm đã được thêm vào giỏ hàng");
          fetchCartCount(accountId);
        } else {
          showToast("error", data.message || "Đã xảy ra lỗi.");
        }
      })
      .catch(() => showToast("error", "Lỗi kết nối, vui lòng thử lại sau."));
  };

  const buyNow = () => {
    if (!accountId) {
      showToast("error", "Bạn cần đăng nhập để sử dụng chức năng này.");
      return;
    }
    if (!selectedSize || !selectedColor) {
      showToast("warning", "Vui lòng chọn đầy đủ kích thước và màu sắc.");
      return;
    }
    if (stock === 0) {
      showToast("error", "Sản phẩm này hiện không còn trong kho.");
      return;
    }

    const url = `http://localhost/E_Commerce/backend/user/api/GetProductBuyNow.php?productId=${productId}&colorId=${selectedColor}&sizeId=${selectedSize}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          const productData = { ...data.data, purchase_quantity: quantity };
          const totalAmount =
            productData.sale_price * productData.purchase_quantity;
          navigate("/cart/checkout", {
            state: { selectedCartItems: [productData], totalAmount },
          });
        } else {
          showToast("error", data.message || "Đã xảy ra lỗi.");
        }
      })
      .catch(() => showToast("error", "Lỗi kết nối, vui lòng thử lại sau."));
  };

  const handleAction = (action) => {
    if (!selectedSize || !selectedColor || quantity <= 0) {
      setHasError(true);
      return;
    }
    setHasError(false);
    if (action === "addToCart") addToCart();
    else if (action === "buyNow") buyNow();
  };

  useEffect(() => {
    if (selectedSize || selectedColor || quantity > 0) {
      setHasError(false);
    }
  }, [selectedSize, selectedColor, quantity]);

  // Render giao diện
  if (productLoading) return <div>Đang tải...</div>;
  if (productError) return <div>Lỗi: {productError}</div>;
  if (!productData) return <p>Sản phẩm không tồn tại.</p>;

  const {
    product_name,
    price = 0,
    sold_quantity_sum = 0,
    sale = 0,
    rating_count,
    average_rating,
    description,
  } = productData;
  const salePrice = sale > 0 ? price - price * (sale / 100) : price;

  const uniqueSizes = [
    ...new Set(productDetails.map((detail) => detail.size_id)),
  ];
  const uniqueColors = [
    ...new Set(productDetails.map((detail) => detail.color_id)),
  ];

  return (
    <div className={styles.pageContainer}>
      <div className={styles.productDetail}>
        <div className={styles.detail}>
          <div className={styles.imageDetail}>
            {allImages.length > 0 ? (
              <Banner images={allImages} />
            ) : (
              <p>Không có hình ảnh sản phẩm.</p>
            )}
          </div>
          <div className={styles.textDetailParent}>
            <h2 className={styles.name}>{product_name}</h2>
            <div className={styles.flexInfo}>
              <div className={styles.ratingParent}>
                <Rating averageRating={parseFloat(average_rating).toFixed(1)} />
              </div>
              <div className={styles.ratingCountParent}>
                {rating_count}
                <span>Đánh giá</span>
              </div>
              <div className={styles.soldParent}>
                {sold_quantity_sum}
                <span>Sold</span>
              </div>
            </div>
            <div className={styles.priceParent}>
              <div className={styles.salePriceParent}>
                <p className={styles.salePrice}>
                  {Number(salePrice)
                    .toFixed(0)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                  <u>đ</u>
                </p>
                {sale > 0 && (
                  <p className={styles.price}>
                    <s>
                      {Number(price)
                        .toFixed(0)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    </s>{" "}
                    <u>đ</u>
                    <span>-{sale}%</span>
                  </p>
                )}
              </div>
            </div>
            <div
              className={`${styles.textDetail} ${hasError ? styles.error : ""}`}
            >
              <div className={styles.lines}></div>
              <div className={styles.sizeColorPurchaseQuantity}>
                <div className={styles.sizeParent}>
                  <p className={styles.sizeTitle}>Kích thước:</p>
                  <div className={styles.sizeOptions}>
                    {uniqueSizes.length > 0 ? (
                      uniqueSizes.map((sizeId) => (
                        <div
                          key={sizeId}
                          className={`${styles.sizeOption} ${
                            selectedSize === sizeId ? styles.selected : ""
                          }`}
                          onClick={() =>
                            setSelectedSize(
                              selectedSize === sizeId ? null : sizeId
                            )
                          }
                        >
                          {sizeName[sizeId] || "Không có tên kích thước"}
                        </div>
                      ))
                    ) : (
                      <p>Không có kích thước cho sản phẩm này.</p>
                    )}
                  </div>
                </div>
                <div className={styles.colorParent}>
                  <p className={styles.colorTitle}>Màu sắc:</p>
                  <div className={styles.colorOptions}>
                    {uniqueColors.length > 0 ? (
                      uniqueColors.map((colorId) => (
                        <div
                          key={colorId}
                          className={`${styles.colorOption} ${
                            selectedColor === colorId ? styles.selected : ""
                          }`}
                          onClick={() =>
                            setSelectedColor(
                              selectedColor === colorId ? null : colorId
                            )
                          }
                        >
                          {colorName[colorId] || "Không có tên màu"}
                        </div>
                      ))
                    ) : (
                      <p>Không có màu sắc cho sản phẩm này.</p>
                    )}
                  </div>
                </div>
                <div className={styles.purchaseQuantityParent}>
                  <p className={styles.purchaseQuantityTitle}>Số lượng:</p>
                  <div className={styles.purchaseQuantity}>
                    <button type="button" onClick={() => changeQuantity(-1)}>
                      -
                    </button>
                    <input
                      type="text"
                      value={quantity}
                      onChange={(e) => {
                        const newQuantity = Math.max(
                          1,
                          Math.min(stock, parseInt(e.target.value) || 1)
                        );
                        setQuantity(newQuantity);
                      }}
                      pattern="\d*"
                      min={1}
                      max={stock}
                    />
                    <button type="button" onClick={() => changeQuantity(1)}>
                      +
                    </button>
                  </div>
                  <div className={styles.quantityParent}>
                    <p className={styles.quantityTitle}>
                      Số sản phẩm có sẵn:{" "}
                      {stock === 0 ? "Vui lòng chọn phân loại" : stock}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.lines}></div>
            <div className={styles.buttonGroup}>
              <div className={styles.addCart}>
                <button onClick={() => handleAction("addToCart")}>
                  Thêm vào giỏ hàng
                </button>
              </div>
              <div className={styles.buyNow}>
                <button onClick={() => handleAction("buyNow")}>Mua ngay</button>
              </div>
            </div>
            <div className={styles.lines}></div>
          </div>
        </div>
        <div className={styles.descriptionDetail}>
          <div className={styles.description}>
            <h2 className={styles.descriptionTitle}>MÔ TẢ CHI TIẾT:</h2>
            <p>
              {description && description.trim()
                ? description
                : "Không có mô tả."}
            </p>
            <div className={styles.commitmentContainer}>
              <h3 className={styles.commitmentTitle}>CAM KẾT DỊCH VỤ:</h3>
              <ul className={styles.commitmentList}>
                <li>Cung cấp sản phẩm chất lượng, chính hãng.</li>
                <li>Hỗ trợ tư vấn tận tâm trước và sau khi mua hàng.</li>
                <li>Giao hàng nhanh chóng, đảm bảo an toàn.</li>
                <li>Đảm bảo thông tin khách hàng được bảo mật tuyệt đối.</li>
                <li>
                  Hỗ trợ giải đáp thắc mắc 24/7 qua hotline: +84 999 999 999.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
