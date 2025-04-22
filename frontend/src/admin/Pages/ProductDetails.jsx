import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../CSS/ProductDetails.module.css";
import ProductDetailsFormPopup from "../Components/ProductDetailsFormPopup";
import Popup from "../Components/Popup";
import ConfirmPopup from "../Components/ConfirmPopup";

const ProductDetails = () => {
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [products, setProducts] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [isConfirmPopupOpen, setConfirmPopupOpen] = useState(false);
  const [detailToDelete, setDetailToDelete] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState([]); // Thêm state cho các chi tiết được chọn
  const [isConfirmMultiDeleteOpen, setConfirmMultiDeleteOpen] = useState(false); // Thêm state cho popup xác nhận xóa nhiều

  // Lấy danh sách sản phẩm (ID và tên) từ API
  useEffect(() => {
    axios
      .get(
        "http://localhost/E_Commerce/backend/admin/api/GetIdAndNameProducts.php"
      )
      .then((response) => {
        if (response.data.status === "success") {
          setProducts(response.data.data);
        }
      })
      .catch((error) => {
        setErrorMessage(`Lỗi tải danh sách sản phẩm: ${error.message}`);
      });
  }, []);

  // Đồng bộ tên sản phẩm khi ID thay đổi
  useEffect(() => {
    if (productId) {
      const selectedProduct = products.find(
        (product) => product.product_id.toString() === productId
      );
      setProductName(selectedProduct ? selectedProduct.product_name : "");
    } else {
      setProductName("");
    }
  }, [productId, products]);

  // Hàm gọi API để lấy chi tiết sản phẩm
  const fetchProductDetails = () => {
    if (!productId) {
      setErrorMessage("Vui lòng nhập Product ID hoặc chọn tên sản phẩm");
      return;
    }
    setErrorMessage("");
    setSelectedDetails([]); // Reset danh sách đã chọn khi tải lại dữ liệu

    axios
      .get(
        `http://localhost/E_Commerce/backend/admin/api/GetProductDetails.php?product_id=${productId}`
      )
      .then((response) => {
        if (response.data.status === "success") {
          setProductDetails(response.data.data);
        } else {
          setProductDetails([]);
          setErrorMessage(response.data.message || "Không tìm thấy sản phẩm.");
        }
      })
      .catch((error) => {
        setErrorMessage(`Lỗi API: ${error.message}`);
        setProductDetails([]);
      });
  };

  // Xử lý khi nhập ID sản phẩm
  const handleProductIdChange = (e) => {
    const id = e.target.value;
    setProductId(id);
  };

  // Xử lý khi chọn tên sản phẩm
  const handleProductNameChange = (e) => {
    const name = e.target.value;
    setProductName(name);
    const selectedProduct = products.find(
      (product) => product.product_name === name
    );
    setProductId(selectedProduct ? selectedProduct.product_id.toString() : "");
  };

  // Mở popup thêm chi tiết sản phẩm
  const handleAddClick = () => {
    setSelectedDetail(null);
    setPopupOpen(true);
  };

  // Mở popup chỉnh sửa sản phẩm
  const handleEditClick = (detail) => {
    setSelectedDetail(detail);
    setPopupOpen(true);
  };

  // Xử lý lưu chi tiết sản phẩm
  const handleSaveDetails = (newDetail) => {
    const apiUrl = newDetail.product_detail_id
      ? "http://localhost/E_Commerce/backend/admin/api/UpdateProductDetails.php"
      : "http://localhost/E_Commerce/backend/admin/api/AddProductDetails.php";

    axios
      .post(apiUrl, newDetail)
      .then((response) => {
        if (response.data.status === "success") {
          setPopupMessage(response.data.message || "Thao tác thành công");
          fetchProductDetails();
        } else {
          setPopupMessage(response.data.message || "Có lỗi xảy ra!");
        }
      })
      .catch((error) => {
        setPopupMessage(`Lỗi: ${error.message}`);
      })
      .finally(() => {
        setPopupVisible(true);
        setPopupOpen(false);
      });
  };

  // Xử lý xóa một chi tiết sản phẩm
  const handleDeleteClick = (productDetailId) => {
    setDetailToDelete(productDetailId);
    setConfirmPopupOpen(true);
  };

  // Xác nhận xóa một chi tiết
  const handleConfirmDelete = () => {
    if (!detailToDelete) return;

    axios
      .delete(
        "http://localhost/E_Commerce/backend/admin/api/DeleteProductDetails.php",
        {
          data: { product_detail_id: detailToDelete },
        }
      )
      .then((response) => {
        setPopupMessage(
          response.data.status === "success"
            ? "Chi tiết sản phẩm đã được xóa"
            : "Lỗi khi xóa chi tiết sản phẩm."
        );
        fetchProductDetails();
      })
      .catch((error) => {
        setPopupMessage(`Lỗi: ${error.message}`);
      })
      .finally(() => {
        setPopupVisible(true);
        setConfirmPopupOpen(false);
      });
  };

  // Chọn tất cả chi tiết
  const handleSelectAll = () => {
    if (selectedDetails.length === productDetails.length) {
      setSelectedDetails([]);
    } else {
      setSelectedDetails(
        productDetails.map((detail) => detail.product_detail_id)
      );
    }
  };

  // Chọn hoặc bỏ chọn từng chi tiết
  const handleSelectDetail = (detailId) => {
    setSelectedDetails((prevSelected) =>
      prevSelected.includes(detailId)
        ? prevSelected.filter((id) => id !== detailId)
        : [...prevSelected, detailId]
    );
  };

  // Mở popup xác nhận xóa nhiều
  const handleMultiDeleteClick = () => {
    if (selectedDetails.length === 0) {
      setPopupMessage("Vui lòng chọn ít nhất một chi tiết để xóa.");
      setPopupVisible(true);
      return;
    }
    setConfirmMultiDeleteOpen(true);
  };

  // Xác nhận xóa nhiều chi tiết
  const handleConfirmMultiDelete = () => {
    axios
      .post(
        "http://localhost/E_Commerce/backend/admin/api/DeleteMultipleProductDetails.php",
        {
          product_detail_ids: selectedDetails,
        }
      )
      .then((response) => {
        if (response.data.status === "success") {
          setProductDetails((prevDetails) =>
            prevDetails.filter(
              (detail) => !selectedDetails.includes(detail.product_detail_id)
            )
          );
          setSelectedDetails([]); // Reset danh sách đã chọn
          setPopupMessage("Xóa các chi tiết sản phẩm thành công");
        } else {
          setPopupMessage(
            response.data.message || "Lỗi khi xóa các chi tiết sản phẩm"
          );
        }
        setPopupVisible(true);
      })
      .catch((error) => {
        setPopupMessage(`Lỗi: ${error.message}`);
        setPopupVisible(true);
      })
      .finally(() => {
        setConfirmMultiDeleteOpen(false);
      });
  };

  return (
    <div className={styles.containerProductDetails}>
      <h2>Quản Lý Chi Tiết Sản Phẩm</h2>

      {/* Input nhập Product ID và Dropdown chọn tên */}
      <div className={styles.searchBar}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Nhập mã sản phẩm..."
            value={productId}
            onChange={handleProductIdChange}
            onKeyDown={(e) => e.key === "Enter" && fetchProductDetails()}
            className={styles.input}
          />
          <select
            value={productName}
            onChange={handleProductNameChange}
            className={styles.select}
          >
            <option value="">Chọn tên sản phẩm</option>
            {products.map((product) => (
              <option key={product.product_id} value={product.product_name}>
                {product.product_name}
              </option>
            ))}
          </select>
        </div>
        <button onClick={fetchProductDetails} className={styles.searchButton}>
          Tìm kiếm
        </button>
      </div>

      {/* Nút thêm và xóa nhiều */}
      <div className={styles.titleButtonContainer}>
        <button onClick={handleAddClick} className={styles.addButton}>
          + Thêm Chi Tiết
        </button>
        <button
          onClick={handleMultiDeleteClick}
          className={styles.deleteMultipleButton}
        >
          Xóa
        </button>
      </div>

      {/* Hiển thị lỗi nếu có */}
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

      {/* Bảng hiển thị chi tiết sản phẩm */}
      {productDetails.length > 0 ? (
        <table className={styles.productDetailsTable}>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={
                    productDetails.length > 0 &&
                    selectedDetails.length === productDetails.length
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th>ID Chi Tiết</th>
              <th>ID Sản Phẩm</th>
              <th>Tên Sản Phẩm</th>
              <th>Màu</th>
              <th>Size</th>
              <th>Số Lượng</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {productDetails.map((detail) => (
              <tr key={detail.product_detail_id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedDetails.includes(detail.product_detail_id)}
                    onChange={() =>
                      handleSelectDetail(detail.product_detail_id)
                    }
                  />
                </td>
                <td>{detail.product_detail_id}</td>
                <td>{detail.product_id}</td>
                <td>{detail.product_name}</td>
                <td>{detail.color_name}</td>
                <td>{detail.size_name}</td>
                <td>{detail.quantity}</td>
                <td className={styles.actionButtons}>
                  <button
                    onClick={() => handleEditClick(detail)}
                    className={styles.editButton}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteClick(detail.product_detail_id)}
                    className={styles.deleteButton}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.noData}>Không có dữ liệu để hiển thị.</p>
      )}

      {/* Popup form thêm/sửa */}
      <ProductDetailsFormPopup
        isOpen={isPopupOpen}
        onClose={() => setPopupOpen(false)}
        detailData={selectedDetail}
        onSubmit={handleSaveDetails}
      />

      {/* Popup xác nhận xóa một chi tiết */}
      {isConfirmPopupOpen && (
        <ConfirmPopup
          message="Bạn có chắc chắn muốn xóa chi tiết sản phẩm này?"
          onClose={() => setConfirmPopupOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {/* Popup xác nhận xóa nhiều chi tiết */}
      {isConfirmMultiDeleteOpen && (
        <ConfirmPopup
          message="Bạn có chắc chắn muốn xóa các chi tiết sản phẩm đã chọn?"
          onClose={() => setConfirmMultiDeleteOpen(false)}
          onConfirm={handleConfirmMultiDelete}
        />
      )}

      {/* Popup thông báo kết quả */}
      {popupVisible && (
        <Popup message={popupMessage} onClose={() => setPopupVisible(false)} />
      )}
    </div>
  );
};

export default ProductDetails;
