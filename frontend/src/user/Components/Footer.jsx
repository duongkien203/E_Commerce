import React from "react";
import styles from "../CSS/Footer.module.css"; // Chuyển sang CSS Module
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerSection}>
          <h4 className={styles.sectionTitle}>THÔNG TIN LIÊN HỆ</h4>
          <p>
            <FaMapMarkerAlt /> Địa chỉ: Số 218 Đường Lĩnh Nam, Q.Hoàng Mai,
            TP.Hà Nội
          </p>
          <p>
            <FaPhoneAlt /> Số Điện Thoại: 0869.186.926
          </p>
          <p>
            <FaEnvelope /> Email: emkshop@gmail.com
          </p>
        </div>

        <div className={styles.footerSection}>
          <h4 className={styles.sectionTitle}>CHÍNH SÁCH</h4>
          <ul>
            <li>Hợp Tác Phân Phối</li>
            <li>Chính Sách Bảo Mật</li>
            <li>Chính Sách Thanh Toán</li>
            <li>Chính Sách Bảo Hành</li>
            <li>Điều Khoản Dịch Vụ</li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h4 className={styles.sectionTitle}>DANH MỤC SẢN PHẨM</h4>
          <ul>
            <li>
              <a href="/thoi-trang-nam-1">Thời trang nam</a>
            </li>
            <li>
              <a href="/thoi-trang-nu-2">Thời trang nữ</a>
            </li>
            <li>
              <a href="/phu-kien-thoi-trang-3">Phụ kiện thời trang</a>
            </li>
            <li>
              <a href="/giay-dep-nam-4">Giày dép nam</a>
            </li>
            <li>
              <a href="/giay-dep-nu-5">Giày dép nữ</a>
            </li>
            <li>
              <a href="/do-dung-gia-dinh-6">Đồ dùng gia đình</a>
            </li>
            <li>
              <a href="/do-tre-em-7">Đồ trẻ em</a>
            </li>
            <li>
              <a href="/balo-tui-xach-8">Balo - túi xách</a>
            </li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h4 className={styles.sectionTitle}>Theo Dõi Chúng Tôi</h4>
          <div className={styles.mapContainer}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.3037977880517!2d105.8758112!3d20.980455900000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135afd765487289%3A0x21bd5839ba683d5f!2zVHLGsOG7nW5nIMSQ4bqhaSBI4buNYyBLaW5oIFThur8gS-G7uSBUaHXhuq10IEPDtG5nIE5naGnhu4dw!5e0!3m2!1svi!2s!4v1743166071436!5m2!1svi!2s"
              width="250"
              height="200"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="EMK Shop Location"
            ></iframe>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>© {new Date().getFullYear()} EMK Shop. All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
