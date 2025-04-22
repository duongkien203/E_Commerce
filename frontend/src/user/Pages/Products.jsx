import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { useParams, Link } from "react-router-dom";
import Pagination from "../Components/Pagination";
import styles from "../CSS/Products.module.css";

const ProductList = () => {
  const { category, searchKey } = useParams();
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [sortPrice, setSortPrice] = useState("default");
  const [sortSale, setSortSale] = useState("default");
  const [filterRating, setFilterRating] = useState("default");
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [saleFilter, setSaleFilter] = useState("default");
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const [selectAllSubcategories, setSelectAllSubcategories] = useState(false); // State mới cho "Tất cả"

  const parts = category ? category.split("-") : [];
  const categoryId = parts.pop();

  // Fetch subcategories
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await fetch(
          `http://localhost/E_Commerce/backend/user/api/GetDataById.php?table=product_subcategories&columnName=category_id&id=${categoryId}&fetchType=all`
        );
        const data = await response.json();
        if (data.status === "success") {
          setSubcategories(data.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy subcategories:", error);
      }
    };

    fetchSubcategories();
  }, [categoryId]);

  // Fetch products và ảnh mặc định cùng lúc
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = searchKey
          ? `http://localhost/E_Commerce/backend/user/api/GetDataById.php?table=products&columnName=product_name&id=${searchKey}&fetchType=all`
          : `http://localhost/E_Commerce/backend/user/api/GetDataById.php?table=products&columnName=category_id&id=${categoryId}&fetchType=all`;

        const response = await fetch(url);
        const data = await response.json();
        if (data.status === "success") {
          const productsWithImages = await Promise.all(
            data.data.map(async (product) => {
              const imageResponse = await fetch(
                `http://localhost/E_Commerce/backend/user/api/GetDefaultImage.php?id=${product.product_id}`
              );
              const imageData = await imageResponse.json();
              return {
                ...product,
                image:
                  imageData.status === "success" ? imageData.data.image : null,
              };
            })
          );

          if (searchKey) {
            const filteredProducts = productsWithImages.filter((product) =>
              searchKey
                .split(" ")
                .every((keyword) =>
                  product.product_name
                    .toLowerCase()
                    .includes(keyword.toLowerCase())
                )
            );
            setAllProducts(filteredProducts);
            setProducts(filteredProducts);
          } else {
            setAllProducts(productsWithImages);
            setProducts(productsWithImages);
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };

    fetchProducts();
  }, [categoryId, searchKey]);

  // Kiểm tra tự động "Tất cả" khi tất cả subcategories được chọn
  useEffect(() => {
    const allSubcategoryIds = subcategories.map(
      (subcategory) => subcategory.subcategory_id
    );
    const isAllSelected = allSubcategoryIds.every((id) =>
      selectedSubcategories.includes(id)
    );
    setSelectAllSubcategories(isAllSelected);
  }, [selectedSubcategories, subcategories]);

  // Các hàm xử lý filter và sort
  const handleSelectAllSubcategories = () => {
    const allSubcategoryIds = subcategories.map(
      (subcategory) => subcategory.subcategory_id
    );
    setSelectedSubcategories(selectAllSubcategories ? [] : allSubcategoryIds); // Toggle chọn tất cả hoặc không
    setSelectAllSubcategories(!selectAllSubcategories);
  };

  const handleCheckboxChange = (subcategoryId) => {
    setSelectedSubcategories((prevSelected) =>
      prevSelected.includes(subcategoryId)
        ? prevSelected.filter((id) => id !== subcategoryId)
        : [...prevSelected, subcategoryId]
    );
  };

  const handleSortPriceChange = (event) => {
    setSortPrice(event.target.value);
    setSortSale("default");
  };

  const handleSortSaleChange = (event) => {
    setSortSale(event.target.value);
    setSortPrice("default");
  };

  const handleApplyPriceFilter = () => {
    if (minPrice && maxPrice && parseFloat(minPrice) > parseFloat(maxPrice)) {
      setErrorMessage("Giá bắt đầu không được lớn hơn giá kết thúc!");
      setMinPrice("");
      setMaxPrice("");
    } else {
      setErrorMessage("");
      const min = minPrice ? parseFloat(minPrice) : null;
      const max = maxPrice ? parseFloat(maxPrice) : null;
      setProducts(
        allProducts.filter(
          (product) =>
            (min === null || product.sale_price >= min) &&
            (max === null || product.sale_price <= max)
        )
      );
    }
  };

  const handleFilterRatingChange = (rating) => {
    setFilterRating(rating);
  };

  const handleSaleFilterChange = (value) => {
    setSaleFilter(value);
  };

  const handleClearFilters = () => {
    setSelectedSubcategories([]);
    setMinPrice("");
    setMaxPrice("");
    setFilterRating("default");
    setSaleFilter("default");
    setSelectAllSubcategories(false); // Reset "Tất cả"
    setProducts(allProducts);
  };

  // Logic lọc và sắp xếp sản phẩm
  const filteredProducts = products
    .filter((product) => {
      if (selectedSubcategories.length === 0) return true;
      return selectedSubcategories.includes(product.subcategory_id);
    })
    .filter((product) => {
      if (saleFilter === "default") return true;
      return saleFilter === "onSale"
        ? Number(product.sale) > 0
        : Number(product.sale) === 0;
    })
    .filter((product) => {
      if (filterRating === "default") return true;
      const rating = parseFloat(filterRating);
      return (
        product.average_rating >= rating && product.average_rating < rating + 1
      );
    });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortPrice !== "default") {
      return sortPrice === "price_asc"
        ? a.sale_price - b.sale_price
        : b.sale_price - a.sale_price;
    }
    if (sortSale !== "default") {
      return sortSale === "sale_asc" ? a.sale - b.sale : b.sale - a.sale;
    }
    return 0;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedSubcategories,
    filterRating,
    sortPrice,
    sortSale,
    minPrice,
    maxPrice,
    saleFilter,
  ]);

  return (
    <div className={styles.containerProducts}>
      <div className={styles.fillterPanelContainer}>
        <h3 className={styles.titleFillter}>
          {searchKey ? "Lọc sản phẩm" : "Danh mục"}
        </h3>
        <ul>
          <li>
            <label>
              <input
                type="checkbox"
                onChange={handleSelectAllSubcategories}
                checked={selectAllSubcategories}
              />
              Tất cả
            </label>
          </li>
          {subcategories.map((subcategory) => (
            <li key={subcategory.subcategory_id}>
              <label>
                <input
                  type="checkbox"
                  onChange={() =>
                    handleCheckboxChange(subcategory.subcategory_id)
                  }
                  checked={selectedSubcategories.includes(
                    subcategory.subcategory_id
                  )}
                />
                {subcategory.subcategory_name || "Không có tên phân loại"}
              </label>
            </li>
          ))}
        </ul>
        {/* Bộ lọc Giảm giá */}
        <div className={styles.saleFilter}>
          <h3>Giảm giá</h3>
          <div>
            <label>
              <input
                type="radio"
                name="saleFilter"
                value="onSale"
                checked={saleFilter === "onSale"}
                onChange={() => handleSaleFilterChange("onSale")}
              />
              Giảm giá
            </label>
          </div>
          <div>
            <label>
              <input
                type="radio"
                name="saleFilter"
                value="noSale"
                checked={saleFilter === "noSale"}
                onChange={() => handleSaleFilterChange("noSale")}
              />
              Không giảm giá
            </label>
          </div>
          <div>
            <label>
              <input
                type="radio"
                name="saleFilter"
                value="default"
                checked={saleFilter === "default"}
                onChange={() => handleSaleFilterChange("default")}
              />
              Tất cả
            </label>
          </div>
        </div>
        <div className={styles.priceFilter}>
          <h3>Khoảng giá</h3>
          <input
            type="number"
            placeholder="Giá từ"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Giá đến"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          {errorMessage && (
            <p className={styles.errorMessage}>{errorMessage}</p>
          )}
          <button onClick={handleApplyPriceFilter}>Áp dụng</button>
        </div>
        <div className={styles.ratingFilter}>
          <h3>Đánh giá</h3>
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating}>
              <label>
                <input
                  type="radio"
                  name="ratingFilter"
                  value={rating}
                  checked={filterRating === rating}
                  onChange={() => handleFilterRatingChange(rating)}
                />
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} color={i < rating ? "gold" : "lightgray"} />
                ))}
              </label>
            </div>
          ))}
        </div>
        <button className={styles.clearFilterBtn} onClick={handleClearFilters}>
          Xóa tất cả
        </button>
      </div>

      <div className={styles.rightContainer}>
        <div className={styles.productContainer}>
          {currentProducts.length === 0 ? (
            <p>Không có sản phẩm nào.</p>
          ) : (
            <div>
              <div className={styles.sortPanelContainer}>
                <h3>Sắp xếp theo</h3>
                <div className={styles.sortOption}>
                  <label htmlFor="priceSort">Giá:</label>
                  <select
                    id="priceSort"
                    value={sortPrice}
                    onChange={handleSortPriceChange}
                  >
                    <option value="default">Mặc định</option>
                    <option value="price_asc">Giá tăng dần</option>
                    <option value="price_desc">Giá giảm dần</option>
                  </select>
                </div>
                {saleFilter !== "noSale" && (
                  <div className={styles.sortOption}>
                    <label htmlFor="saleSort">Giảm giá:</label>
                    <select
                      id="saleSort"
                      value={sortSale}
                      onChange={handleSortSaleChange}
                    >
                      <option value="default">Mặc định</option>
                      <option value="sale_asc">Giảm giá tăng dần</option>
                      <option value="sale_desc">Giảm giá giảm dần</option>
                    </select>
                  </div>
                )}
              </div>
              <div className={styles.productPage}>
                {currentProducts.map((row) => (
                  <Link to={`/products/${row.product_id}`} key={row.product_id}>
                    <div className={styles.product}>
                      <div className={styles.productInfo}>
                        <div className={styles.imageParent}>
                          {row.image ? (
                            <img
                              className={styles.imageProduc}
                              src={row.image}
                              alt="Hình ảnh sản phẩm"
                            />
                          ) : (
                            <p>Không có hình ảnh</p>
                          )}
                        </div>
                        <p>{row.product_name || "Tên sản phẩm không có"}</p>
                      </div>
                      <div className={styles.priceRatingSoldQuantityParent}>
                        <div className={styles.priceParent}>
                          <p className={styles.salePrice}>
                            {Number(row.sale_price).toLocaleString()} <u>đ</u>
                          </p>
                        </div>
                        <div className={styles.ratingSoldQuantityParent}>
                          <div className={styles.ratingParent}>
                            <FaStar color="gold" />{" "}
                            {Number(row.average_rating).toFixed(1)}
                          </div>
                          <p>Đã bán: {row.sold_quantity_sum}</p>
                        </div>
                      </div>
                      {Number(row.sale) > 0 && (
                        <div className={styles.sale}>
                          <p>Giảm {row.sale}%</p>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
              <Pagination
                totalProducts={sortedProducts.length}
                productsPerPage={productsPerPage}
                currentPage={currentPage}
                paginate={(pageNumber) => setCurrentPage(pageNumber)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
