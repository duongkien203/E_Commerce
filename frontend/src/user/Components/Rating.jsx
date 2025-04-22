import React from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import styles from "../CSS/Rating.module.css";

const Rating = ({ averageRating }) => {
  return (
    <div className={styles.ratingParent}>
      <span>{Number(averageRating).toFixed(1)}</span>
      {Array(5)
        .fill(false)
        .map((_, index) =>
          index < Math.floor(parseFloat(averageRating)) ? (
            <AiFillStar key={index} className={styles.star} /> // Sao đầy
          ) : index === Math.floor(parseFloat(averageRating)) &&
            parseFloat(averageRating) % 1 !== 0 ? (
            <AiFillStar key={index} className={styles.starHalf} /> // Sao đầy một phần (nếu có số thập phân)
          ) : (
            <AiOutlineStar key={index} className={styles.hiddenStar} /> // Sao rỗng
          )
        )}
    </div>
  );
};

export default Rating;
