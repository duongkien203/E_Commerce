import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import styles from "../CSS/BackToTop.module.css"; // Tạo file CSS này

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Kiểm tra vị trí cuộn để hiển thị hoặc ẩn nút
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Hàm cuộn lên đầu trang
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      {isVisible && (
        <button className={styles.backToTop} onClick={scrollToTop}>
          <FaArrowUp size={20} />
        </button>
      )}
    </div>
  );
};

export default BackToTop;
