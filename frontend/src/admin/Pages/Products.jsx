import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "../Components/Pagination";
import ProductFormPopup from "../Components/ProductFormPopup";
import ConfirmPopup from "../Components/ConfirmPopup";
import Popup from "../Components/Popup";
import ProductActivityHistoryPopup from "../Components/ProductActivityHistoryPopup";
import styles from "../CSS/Products.module.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isConfirmPopupOpen, setConfirmPopupOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [productsPerPage] = useState(10);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [isHistoryPopupOpen, setHistoryPopupOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]); // Thêm state cho các sản phẩm được chọn
  const [isConfirmMultiDeleteOpen, setConfirmMultiDeleteOpen] = useState(false); // Thêm state cho popup xác nhận xóa nhiều
  const [searchId, setSearchId] = useState(""); // Thêm state cho tìm kiếm ID

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios
      .get("http://localhost/E_Commerce/backend/admin/api/GetProducts.php")
      .then((response) => {
        if (response.data.status === "success") {
          setProducts(response.data.data);
          setSelectedProducts([]); // Reset danh sách đã chọn khi tải lại dữ liệu
        }
      })
      .catch((error) => {
        setPopupMessage(`Lỗi tải sản phẩm: ${error.message}`);
        setPopupVisible(true);
      });
  };

  // Lọc sản phẩm dựa trên ID tìm kiếm
  const filteredProducts = products.filter((product) =>
    product.product_id.toString().includes(searchId)
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleAddClick = () => {
    setSelectedProduct(null);
    setPopupOpen(true);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setPopupOpen(true);
  };

  const handleSaveProduct = (newProduct) => {
    const apiUrl = newProduct.product_id
      ? "http://localhost/E_Commerce/backend/admin/api/UpdateProduct.php"
      : "http://localhost/E_Commerce/backend/admin/api/AddProduct.php";

    axios
      .post(apiUrl, newProduct)
      .then((response) => {
        if (response.data.status === "success") {
          setPopupMessage(
            newProduct.product_id
              ? "Sản phẩm đã được cập nhật"
              : "Sản phẩm mới đã được thêm"
          );
          fetchProducts();
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

  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setConfirmPopupOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!productToDelete) return;

    axios
      .delete(
        "http://localhost/E_Commerce/backend/admin/api/DeleteProduct.php",
        {
          data: { product_id: productToDelete },
        }
      )
      .then((response) => {
        setPopupMessage(
          response.data.status === "success"
            ? "Sản phẩm đã được xóa"
            : "Lỗi khi xóa sản phẩm."
        );
        fetchProducts();
      })
      .catch((error) => {
        setPopupMessage(`Lỗi: ${error.message}`);
      })
      .finally(() => {
        setPopupVisible(true);
        setConfirmPopupOpen(false);
      });
  };

  const handleViewHistory = (productId) => {
    setSelectedProductId(productId);
    setHistoryPopupOpen(true);
  };

  // Thêm hàm chọn tất cả
  const handleSelectAll = () => {
    if (selectedProducts.length === currentProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(currentProducts.map((product) => product.product_id));
    }
  };

  // Thêm hàm chọn/bỏ chọn từng sản phẩm
  const handleSelectProduct = (productId) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  // Thêm hàm mở popup xác nhận xóa nhiều
  const handleMultiDeleteClick = () => {
    if (selectedProducts.length === 0) {
      setPopupMessage("Vui lòng chọn ít nhất một sản phẩm để xóa.");
      setPopupVisible(true);
      return;
    }
    setConfirmMultiDeleteOpen(true);
  };

  // Thêm hàm xác nhận xóa nhiều
  const handleConfirmMultiDelete = () => {
    axios
      .post(
        "http://localhost/E_Commerce/backend/admin/api/DeleteMultipleProducts.php",
        {
          product_ids: selectedProducts,
        }
      )
      .then((response) => {
        if (response.data.status === "success") {
          setProducts((prevProducts) =>
            prevProducts.filter(
              (product) => !selectedProducts.includes(product.product_id)
            )
          );
          setPopupMessage("Xóa các sản phẩm thành công");
          setSelectedProducts([]); // Reset danh sách đã chọn
        } else {
          setPopupMessage(response.data.message || "Lỗi khi xóa sản phẩm");
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Xử lý tìm kiếm
  const handleSearchChange = (e) => {
    setSearchId(e.target.value);
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
  };

  return (
    <div className={styles.productsContainer}>
      <div className={styles.productsHeader}>
        <h2 className={styles.productsTitle}>Quản lý Sản phẩm</h2>
        <div className={styles.headerActions}>
          <input
            type="text"
            placeholder="Tìm theo ID sản phẩm..."
            value={searchId}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
          <button className={styles.addProductButton} onClick={handleAddClick}>
            + Thêm sản phẩm
          </button>
          <button
            className={styles.deleteMultipleButton}
            onClick={handleMultiDeleteClick}
          >
            Xóa
          </button>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className={styles.noProductsMessage}>Không có sản phẩm nào</div>
      ) : (
        <>
          <table className={styles.productsTable}>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={
                      currentProducts.length > 0 &&
                      selectedProducts.length === currentProducts.length
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th>ID</th>
                <th>Ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Danh mục cha</th>
                <th>Danh mục con</th>
                <th>Giá gốc</th>
                <th>Sale (%)</th>
                <th>Mô tả</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr key={product.product_id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.product_id)}
                      onChange={() => handleSelectProduct(product.product_id)}
                    />
                  </td>
                  <td>{product.product_id}</td>
                  <td>
                    <img
                      src={product.image_url}
                      alt={product.product_name}
                      className={styles.productImage}
                    />
                  </td>
                  <td>{product.product_name}</td>
                  <td>{product.category_name}</td>
                  <td>{product.subcategory_name}</td>
                  <td>{formatPrice(product.price)}</td>
                  <td>{product.sale}</td>
                  <td>{product.description}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.historyButton}
                        onClick={() => handleViewHistory(product.product_id)}
                      >
                        Lịch sử
                      </button>
                      <button
                        className={styles.editButton}
                        onClick={() => handleEditClick(product)}
                      >
                        Sửa
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDeleteClick(product.product_id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            totalProducts={filteredProducts.length}
            productsPerPage={productsPerPage}
            currentPage={currentPage}
            paginate={paginate}
          />
        </>
      )}

      <ProductFormPopup
        isOpen={isPopupOpen}
        onClose={() => setPopupOpen(false)}
        productData={selectedProduct}
        onSubmit={handleSaveProduct}
      />

      {isConfirmPopupOpen && (
        <ConfirmPopup
          message="Bạn có chắc chắn muốn xóa sản phẩm này?"
          onClose={() => setConfirmPopupOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {isConfirmMultiDeleteOpen && (
        <ConfirmPopup
          message="Bạn có chắc chắn muốn xóa các sản phẩm đã chọn?"
          onClose={() => setConfirmMultiDeleteOpen(false)}
          onConfirm={handleConfirmMultiDelete}
        />
      )}

      {popupVisible && (
        <Popup message={popupMessage} onClose={() => setPopupVisible(false)} />
      )}

      <ProductActivityHistoryPopup
        isOpen={isHistoryPopupOpen}
        onClose={() => setHistoryPopupOpen(false)}
        productId={selectedProductId}
      />
    </div>
  );
};

export default Products;
