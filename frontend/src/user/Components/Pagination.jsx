import React, { useEffect, useState } from "react";
import styles from "../CSS/Pagination.module.css";

const Pagination = ({
  totalProducts,
  productsPerPage,
  currentPage,
  paginate,
}) => {
  const [totalPages, setTotalPages] = useState(
    Math.ceil(totalProducts / productsPerPage)
  );

  useEffect(() => {
    setTotalPages(Math.ceil(totalProducts / productsPerPage));
  }, [totalProducts, productsPerPage]);

  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  if (endPage - startPage + 1 < maxPagesToShow) {
    if (startPage === 1) {
      endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    } else if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
  }

  return (
    <div className={styles.pagination}>
      {startPage > 1 && (
        <>
          <button onClick={() => paginate(1)}>1</button>
          {startPage > 2 && <span>...</span>}
        </>
      )}
      {Array.from({ length: endPage - startPage + 1 }, (_, i) => (
        <button
          key={startPage + i}
          onClick={() => paginate(startPage + i)}
          className={currentPage === startPage + i ? styles.active : ""}
        >
          {startPage + i}
        </button>
      ))}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span>...</span>}
          <button onClick={() => paginate(totalPages)}>{totalPages}</button>
        </>
      )}
    </div>
  );
};

export default Pagination;
