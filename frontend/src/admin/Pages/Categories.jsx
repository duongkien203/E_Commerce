import React, { useState, useEffect } from "react";
import axios from "axios";
import Popup from "../Components/Popup";
import CategoriesFormPopup from "../Components/CategoriesFormPopup";
import ConfirmPopup from "../Components/ConfirmPopup";
import styles from "../CSS/Categories.module.css";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isConfirmPopupOpen, setConfirmPopupOpen] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isConfirmMultiDeleteOpen, setConfirmMultiDeleteOpen] = useState(false);
  const [searchId, setSearchId] = useState(""); // Thêm state cho tìm kiếm ID

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    axios
      .get("http://localhost/E_Commerce/backend/admin/api/GetCategories.php")
      .then((response) => {
        if (response.data.status === "success") {
          setCategories(response.data.data);
        }
      })
      .catch((error) => console.error("Error fetching categories:", error));
  };

  // Lọc danh mục dựa trên ID tìm kiếm
  const filteredCategories = categories.filter((category) =>
    category.category_id.toString().includes(searchId)
  );

  const handleAddClick = () => {
    setSelectedCategory(null);
    setPopupOpen(true);
  };

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setPopupOpen(true);
  };

  const handleSaveCategory = (newCategory) => {
    if (newCategory.category_id) {
      axios
        .put(
          "http://localhost/E_Commerce/backend/admin/api/UpdateCategory.php",
          {
            category_id: newCategory.category_id,
            category_name: newCategory.category_name,
          }
        )
        .then(() => {
          setCategories((prevCategories) =>
            prevCategories.map((category) =>
              category.category_id === newCategory.category_id
                ? { ...category, category_name: newCategory.category_name }
                : category
            )
          );
          setPopupMessage("Cập nhật thành công");
          setPopupVisible(true);
        })
        .catch((error) => {
          setPopupMessage(`Lỗi: ${error.message}`);
          setPopupVisible(true);
        });
    } else {
      axios
        .post("http://localhost/E_Commerce/backend/admin/api/AddCategory.php", {
          category_name: newCategory.category_name,
        })
        .then((response) => {
          const addedCategory = {
            category_id: response.data.category_id,
            category_name: newCategory.category_name,
          };
          setCategories((prevCategories) => [...prevCategories, addedCategory]);
          setPopupMessage("Thêm thành công");
          setPopupVisible(true);
        })
        .catch((error) => {
          setPopupMessage(`Lỗi: ${error.message}`);
          setPopupVisible(true);
        });
    }
  };

  const handleDeleteClick = (categoryId) => {
    setDeleteCategoryId(categoryId);
    setConfirmPopupOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteCategoryId) return;

    axios
      .delete(
        `http://localhost/E_Commerce/backend/admin/api/DeleteCategory.php?category_id=${deleteCategoryId}`
      )
      .then((response) => {
        if (response.data.status === "success") {
          setCategories((prevCategories) =>
            prevCategories.filter(
              (category) => category.category_id !== deleteCategoryId
            )
          );
          setPopupMessage("Xóa thành công");
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
        setConfirmPopupOpen(false);
      });
  };

  // Chọn hoặc bỏ chọn danh mục trong danh sách xóa nhiều
  const handleSelectCategory = (categoryId) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter((id) => id !== categoryId)
        : [...prevSelected, categoryId]
    );
  };

  const handleSelectAllCategories = () => {
    if (selectedCategories.length === filteredCategories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(
        filteredCategories.map((category) => category.category_id)
      );
    }
  };

  // Xóa nhiều danh mục
  const handleMultiDeleteClick = () => {
    if (selectedCategories.length === 0) {
      setPopupMessage("Vui lòng chọn ít nhất một danh mục để xóa.");
      setPopupVisible(true);
      return;
    }
    setConfirmMultiDeleteOpen(true);
  };

  const handleConfirmMultiDelete = () => {
    axios
      .post(
        "http://localhost/E_Commerce/backend/admin/api/DeleteMultipleCategories.php",
        {
          category_ids: selectedCategories,
        }
      )
      .then((response) => {
        if (response.data.status === "success") {
          setCategories((prevCategories) =>
            prevCategories.filter(
              (category) => !selectedCategories.includes(category.category_id)
            )
          );
          setPopupMessage("Xóa thành công");
          setSelectedCategories([]);
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

  // Xử lý tìm kiếm
  const handleSearchChange = (e) => {
    setSearchId(e.target.value);
  };

  return (
    <div className={styles.categoriesContainer}>
      <div className={styles.categoriesHeader}>
        <h2 className={styles.categoriesTitle}>Quản lý Danh mục</h2>
        <div className={styles.headerActions}>
          <input
            type="text"
            placeholder="Tìm theo ID danh mục..."
            value={searchId}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
          <button className={styles.addCategoryButton} onClick={handleAddClick}>
            + Thêm danh mục
          </button>
          <button
            className={styles.deleteMultipleButton}
            onClick={handleMultiDeleteClick}
          >
            Xóa
          </button>
        </div>
      </div>

      {filteredCategories.length === 0 ? (
        <p className={styles.noData}>Không có danh mục nào để hiển thị.</p>
      ) : (
        <table className={styles.categoriesTable}>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={
                    filteredCategories.length > 0 &&
                    selectedCategories.length === filteredCategories.length
                  }
                  onChange={handleSelectAllCategories}
                />
              </th>
              <th>Số thứ tự</th>
              <th>Mã danh mục</th>
              <th>Danh mục</th>
              <th>Chức năng</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((category, index) => (
              <tr key={category.category_id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.category_id)}
                    onChange={() => handleSelectCategory(category.category_id)}
                  />
                </td>
                <td>{index + 1}</td>
                <td>{category.category_id}</td>
                <td>{category.category_name}</td>
                <td>
                  <div className={styles.actionButtons}>
                    <button
                      className={styles.editButton}
                      onClick={() => handleEditClick(category)}
                    >
                      Sửa
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteClick(category.category_id)}
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <CategoriesFormPopup
        isOpen={isPopupOpen}
        onClose={() => setPopupOpen(false)}
        categoryData={selectedCategory}
        onSubmit={handleSaveCategory}
      />

      {isPopupVisible && (
        <Popup message={popupMessage} onClose={() => setPopupVisible(false)} />
      )}

      {isConfirmPopupOpen && (
        <ConfirmPopup
          message="Bạn có chắc chắn muốn xóa danh mục này?"
          onClose={() => setConfirmPopupOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {isConfirmMultiDeleteOpen && (
        <ConfirmPopup
          message="Bạn có chắc chắn muốn xóa các danh mục đã chọn?"
          onClose={() => setConfirmMultiDeleteOpen(false)}
          onConfirm={handleConfirmMultiDelete}
        />
      )}
    </div>
  );
};

export default Categories;
