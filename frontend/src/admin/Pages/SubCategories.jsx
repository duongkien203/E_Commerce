import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import styles from "../CSS/SubCategories.module.css";
import SubCategoriesFormPopup from "../Components/SubCategoriesFormPopup";
import ConfirmPopup from "../Components/ConfirmPopup";
import Popup from "../Components/Popup";

const SubCategories = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [currentSubCategory, setCurrentSubCategory] = useState(null);
  const [isConfirmPopupOpen, setConfirmPopupOpen] = useState(false);
  const [deleteSubCategoryId, setDeleteSubCategoryId] = useState(null);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [isConfirmMultiDeleteOpen, setConfirmMultiDeleteOpen] = useState(false);
  const [searchId, setSearchId] = useState("");

  // Memoize fetchCategories với useCallback
  const fetchCategories = useCallback(() => {
    axios
      .get("http://localhost/E_Commerce/backend/admin/api/GetCategories.php")
      .then((response) => {
        if (response.data.status === "success") {
          setCategories(response.data.data);
          if (searchId) {
            const foundCategory = response.data.data.find(
              (cat) => cat.category_id.toString() === searchId
            );
            if (foundCategory) {
              setSelectedCategoryId(foundCategory.category_id);
            }
          }
        }
      })
      .catch((error) => {
        setPopupMessage(`Lỗi tải danh mục cha: ${error.message}`);
        setPopupVisible(true);
      });
  }, [searchId]);

  // Memoize fetchSubCategories với useCallback
  const fetchSubCategories = useCallback((categoryId) => {
    axios
      .get(
        `http://localhost/E_Commerce/backend/admin/api/GetSubCategories.php?category_id=${categoryId}`
      )
      .then((response) => {
        if (response.data.status === "success") {
          setSubCategories(response.data.data);
        } else {
          setSubCategories([]);
          setPopupMessage(
            response.data.message || "Không tìm thấy danh mục con"
          );
          setPopupVisible(true);
        }
      })
      .catch((error) => {
        setPopupMessage(`Lỗi tải danh mục con: ${error.message}`);
        setPopupVisible(true);
      });
  }, []); // Không có dependency vì fetchSubCategories chỉ phụ thuộc vào tham số categoryId

  // useEffect để gọi fetchCategories khi component mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // useEffect để gọi fetchSubCategories khi selectedCategoryId thay đổi
  useEffect(() => {
    if (selectedCategoryId) {
      fetchSubCategories(selectedCategoryId);
    } else {
      setSubCategories([]);
    }
  }, [selectedCategoryId, fetchSubCategories]); // Thêm fetchSubCategories vào dependencies

  const handleCategoryChange = (event) => {
    const newCategoryId = event.target.value;
    setSelectedCategoryId(newCategoryId);
    setSearchId(newCategoryId); // Đồng bộ ID với thanh tìm kiếm
  };

  const handleSearchChange = (e) => {
    const newSearchId = e.target.value;
    setSearchId(newSearchId);

    const foundCategory = categories.find(
      (cat) => cat.category_id.toString() === newSearchId
    );
    if (foundCategory) {
      setSelectedCategoryId(foundCategory.category_id);
    } else {
      setSelectedCategoryId(null);
      setSubCategories([]);
    }
  };

  const handleAddClick = () => {
    setCurrentSubCategory(null);
    setShowPopup(true);
  };

  const handleEditClick = (subCategory) => {
    setCurrentSubCategory(subCategory);
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const handleSubCategorySubmit = (data) => {
    const apiUrl = data.subcategory_id
      ? "http://localhost/E_Commerce/backend/admin/api/UpdateSubCategory.php"
      : "http://localhost/E_Commerce/backend/admin/api/AddSubCategory.php";

    axios
      .post(apiUrl, data)
      .then((response) => {
        if (response.data.status === "success") {
          setPopupMessage(
            data.subcategory_id
              ? "Danh mục con đã được cập nhật"
              : "Danh mục con mới đã được thêm"
          );
          fetchSubCategories(selectedCategoryId);
        } else {
          setPopupMessage(response.data.message || "Có lỗi xảy ra!");
        }
      })
      .catch((error) => {
        setPopupMessage(`Lỗi: ${error.message}`);
      })
      .finally(() => {
        setPopupVisible(true);
        setShowPopup(false);
      });
  };

  const handleDeleteClick = (id) => {
    setDeleteSubCategoryId(id);
    setConfirmPopupOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteSubCategoryId) return;

    axios
      .post(
        `http://localhost/E_Commerce/backend/admin/api/DeleteSubCategory.php?subcategory_id=${deleteSubCategoryId}`
      )
      .then((response) => {
        setPopupMessage(
          response.data.status === "success"
            ? "Danh mục con đã được xóa"
            : "Lỗi khi xóa danh mục con."
        );
        fetchSubCategories(selectedCategoryId);
      })
      .catch((error) => {
        setPopupMessage(`Lỗi: ${error.message}`);
      })
      .finally(() => {
        setPopupVisible(true);
        setConfirmPopupOpen(false);
      });
  };

  const handleSelectAll = () => {
    if (selectedSubCategories.length === subCategories.length) {
      setSelectedSubCategories([]);
    } else {
      setSelectedSubCategories(
        subCategories.map((subCategory) => subCategory.subcategory_id)
      );
    }
  };

  const handleSelectSubCategory = (subCategoryId) => {
    setSelectedSubCategories((prevSelected) =>
      prevSelected.includes(subCategoryId)
        ? prevSelected.filter((id) => id !== subCategoryId)
        : [...prevSelected, subCategoryId]
    );
  };

  const handleMultiDeleteClick = () => {
    if (selectedSubCategories.length === 0) {
      setPopupMessage("Vui lòng chọn ít nhất một danh mục để xóa.");
      setPopupVisible(true);
      return;
    }
    setConfirmMultiDeleteOpen(true);
  };

  const handleConfirmMultiDelete = () => {
    axios
      .post(
        "http://localhost/E_Commerce/backend/admin/api/DeleteMultipleSubCategories.php",
        {
          subcategory_ids: selectedSubCategories,
        }
      )
      .then((response) => {
        if (response.data.status === "success") {
          setSubCategories((prevSubCategories) =>
            prevSubCategories.filter(
              (subCategory) =>
                !selectedSubCategories.includes(subCategory.subcategory_id)
            )
          );
          setPopupMessage("Xóa thành công");
          setSelectedSubCategories([]);
        } else {
          setPopupMessage(response.data.message || "Lỗi khi xóa");
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
    <div className={styles.subCategoriesContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Quản lý Danh mục con</h2>
      </div>
      <div className={styles.filter}>
        <label htmlFor="parentCategory">Chọn danh mục cha:</label>
        <div className={styles.searchAndSelect}>
          <input
            type="text"
            placeholder="Tìm theo ID danh mục cha..."
            value={searchId}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
          <select
            id="parentCategory"
            value={selectedCategoryId || ""}
            onChange={handleCategoryChange}
            className={styles.selectInput}
          >
            <option value="">-- Chọn danh mục cha --</option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.category_name} (ID: {category.category_id})
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedCategoryId && (
        <div className={styles.subCategoriesList}>
          <div className={styles.subHeader}>
            <h3>Danh mục con:</h3>
            <button className={styles.addButton} onClick={handleAddClick}>
              + Thêm
            </button>{" "}
            <button
              className={styles.deleteMultipleButton}
              onClick={handleMultiDeleteClick}
            >
              Xóa
            </button>
          </div>
          {subCategories.length > 0 ? (
            <table className={styles.subCategoriesTable}>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={
                        subCategories.length > 0 &&
                        selectedSubCategories.length === subCategories.length
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Mã danh mục lớn</th>
                  <th>Mã danh mục nhỏ</th>
                  <th>Tên danh mục</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {subCategories.map((subCategory) => (
                  <tr key={subCategory.subcategory_id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedSubCategories.includes(
                          subCategory.subcategory_id
                        )}
                        onChange={() =>
                          handleSelectSubCategory(subCategory.subcategory_id)
                        }
                      />
                    </td>
                    <td>{subCategory.category_id}</td>
                    <td>{subCategory.subcategory_id}</td>
                    <td>{subCategory.subcategory_name}</td>
                    <td className={styles.actions}>
                      <button
                        className={styles.editButton}
                        onClick={() => handleEditClick(subCategory)}
                      >
                        Sửa
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() =>
                          handleDeleteClick(subCategory.subcategory_id)
                        }
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Không có danh mục con cho danh mục cha này.</p>
          )}
        </div>
      )}

      {showPopup && (
        <SubCategoriesFormPopup
          isOpen={showPopup}
          categories={categories}
          subCategoryData={currentSubCategory}
          onClose={handlePopupClose}
          onSubmit={handleSubCategorySubmit}
        />
      )}

      {isConfirmPopupOpen && (
        <ConfirmPopup
          message="Bạn có chắc chắn muốn xóa danh mục con này?"
          onClose={() => setConfirmPopupOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {isConfirmMultiDeleteOpen && (
        <ConfirmPopup
          message="Bạn có chắc chắn muốn xóa các danh mục con đã chọn?"
          onClose={() => setConfirmMultiDeleteOpen(false)}
          onConfirm={handleConfirmMultiDelete}
        />
      )}

      {popupVisible && (
        <Popup message={popupMessage} onClose={() => setPopupVisible(false)} />
      )}
    </div>
  );
};

export default SubCategories;
