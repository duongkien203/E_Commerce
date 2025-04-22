import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Banner from "../Components/Banner";
import Pagination from "../Components/Pagination";
import { FaStar } from "react-icons/fa";
import homeStyles from "../CSS/Home.module.css";
import productStyles from "../CSS/Products.module.css";
import categoryStyles from "../CSS/Categories.module.css";

const bannerImages = [
  "/images/banner_images/banner_main/banner_1.jpg",
  "/images/banner_images/banner_main/banner_2.jpg",
  "/images/banner_images/banner_main/banner_3.jpg",
  "/images/banner_images/banner_main/banner_4.jpg",
  "/images/banner_images/banner_main/banner_5.jpg",
  "/images/banner_images/banner_main/banner_6.jpg",
];

function Home() {
  const navigate = useNavigate();
  const location = useLocation(); // Lấy đường dẫn hiện tại để kiểm tra

  // State cho sản phẩm
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  // State cho danh mục
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // Fetch dữ liệu sản phẩm
  useEffect(() => {
    fetch("http://localhost/E_Commerce/backend/user/api/GetProducts.php")
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          // Lọc các sản phẩm có sale > 0
          const discountedProducts = data.data.filter(
            (product) => Number(product.sale) > 0
          );
          setProducts(discountedProducts);
        }
      })
      .catch((error) => console.error("Lỗi khi lấy sản phẩm:", error));
  }, []);

  // Fetch dữ liệu danh mục
  useEffect(() => {
    const tableName = "product_categories";
    const api = `http://localhost/E_Commerce/backend/user/api/GetData.php?table=${tableName}`;
    fetch(api)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Lỗi khi tải dữ liệu!");
        }
        return response.json();
      })
      .then((result) => {
        if (result.status === "success") {
          setCategories(result.data);
        } else {
          throw new Error(result.message || "Lỗi không xác định");
        }
      })
      .catch((error) => {
        setCategoriesError(error.message);
      })
      .finally(() => {
        setCategoriesLoading(false);
      });
  }, []);

  // Hàm fetch ảnh mặc định
  const fetchDefaultImage = async (id) => {
    try {
      const response = await fetch(
        `http://localhost/E_Commerce/backend/user/api/GetDefaultImage.php?id=${id}`
      );
      const result = await response.json();
      if (result.status === "success") {
        return result.data;
      } else {
        throw new Error(result.message || "Có lỗi xảy ra khi tải dữ liệu");
      }
    } catch (err) {
      throw new Error("Có lỗi xảy ra khi tải dữ liệu");
    }
  };

  // Fetch ảnh mặc định cho tất cả sản phẩm
  const [productImages, setProductImages] = useState({});
  useEffect(() => {
    const fetchAllImages = async () => {
      if (products.length > 0) {
        const imagePromises = products.map((product) =>
          fetchDefaultImage(product.product_id).catch(() => null)
        );
        const images = await Promise.all(imagePromises);
        const imageMap = products.reduce((acc, product, index) => {
          acc[product.product_id] = images[index];
          return acc;
        }, {});
        setProductImages(imageMap);
      }
    };
    fetchAllImages();
  }, [products]);

  // Xử lý phân trang
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Xử lý click danh mục
  const handleCategoryClick = (categoryName, categoryId) => {
    const formattedName = categoryName.toLowerCase().replace(/\s+/g, "-");
    navigate(`/${formattedName}-${categoryId}`);
  };

  // Kiểm tra nếu đang ở trang sản phẩm thuộc danh mục nào đó để tự động mở danh mục
  useEffect(() => {
    const categoryPaths = categories.map(
      (cat) =>
        `/${cat.category_name.toLowerCase().replace(/\s+/g, "-")}-${
          cat.category_id
        }`
    );
    if (categoryPaths.some((path) => location.pathname.startsWith(path))) {
      setIsCategoryOpen(true);
    } else {
      setIsCategoryOpen(false);
    }
  }, [location.pathname, categories]);

  return (
    <div className={homeStyles.homeContainer}>
      {/* Banner */}
      <div className={homeStyles.bannerContainer}>
        <div className={homeStyles.bannerMain}>
          {bannerImages.length > 0 ? (
            <Banner images={bannerImages} />
          ) : (
            <p>Không có hình ảnh banner.</p>
          )}
        </div>
        <div className={homeStyles.bannerSub}>
          <img
            src="/images/banner_images/banner_sub/banner_1.jpg"
            alt="banner"
          />
          <img
            src="/images/banner_images/banner_sub/banner_2.jpg"
            alt="banner"
          />
        </div>
      </div>

      {/* Danh mục */}
      {categoriesLoading ? (
        <div>Đang tải danh mục...</div>
      ) : categoriesError ? (
        <div>Lỗi: {categoriesError}</div>
      ) : !categories || categories.length === 0 ? (
        <div>Không có danh mục để hiển thị</div>
      ) : (
        <div className={categoryStyles.categoryContainer}>
          <div
            className={categoryStyles.categoryTitle}
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            aria-expanded={isCategoryOpen}
            role="button"
          >
            Danh mục
            {isCategoryOpen ? (
              <span className={categoryStyles.arrowIcon}>▲</span>
            ) : (
              <span className={categoryStyles.arrowIcon}>▼</span>
            )}
          </div>
          <ul
            className={`${categoryStyles.subList} ${
              isCategoryOpen ? categoryStyles.show : ""
            }`}
          >
            {categories.map((category) => (
              <li
                key={category.category_id}
                className={categoryStyles.categoryItem}
                onClick={() =>
                  handleCategoryClick(
                    category.category_name,
                    category.category_id
                  )
                }
              >
                {category.category_name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sản phẩm đang được giảm giá */}
      <div className={homeStyles.productContainer}>
        <div className={homeStyles.productTitle}>
          Sản phẩm đang được giảm giá
        </div>
        <div className={productStyles.productPage}>
          {currentProducts.length > 0 ? (
            currentProducts.map((row) => {
              const imageData = productImages[row.product_id];
              return (
                <Link to={`/products/${row.product_id}`} key={row.product_id}>
                  <div className={productStyles.product}>
                    <div className={productStyles.productInfo}>
                      <div className={productStyles.imageParent}>
                        {imageData ? (
                          <img
                            className={productStyles.imageProduc}
                            src={imageData.image}
                            alt="Hình ảnh sản phẩm"
                          />
                        ) : (
                          <p>Không có hình ảnh</p>
                        )}
                      </div>
                      <p>{row.product_name || "Tên sản phẩm không có"}</p>
                    </div>
                    <div
                      className={productStyles.priceRatingSoldQuantityParent}
                    >
                      <div className={productStyles.priceParent}>
                        <p className={productStyles.salePrice}>
                          {Number(row.sale_price).toLocaleString()} <u>đ</u>
                        </p>
                      </div>
                      <div className={productStyles.ratingSoldQuantityParent}>
                        <div className={productStyles.ratingParent}>
                          <FaStar color="gold" />{" "}
                          {Number(row.average_rating).toFixed(1)}
                        </div>
                        <p>Đã bán: {row.sold_quantity_sum}</p>
                      </div>
                    </div>
                    <div className={productStyles.sale}>
                      <p>Giảm {row.sale}%</p>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <p>Không có sản phẩm đang giảm giá nào</p>
          )}
        </div>
        <Pagination
          totalProducts={products.length}
          productsPerPage={productsPerPage}
          currentPage={currentPage}
          paginate={paginate}
        />
      </div>
    </div>
  );
}

export default Home;
