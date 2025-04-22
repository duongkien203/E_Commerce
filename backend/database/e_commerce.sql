-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th4 10, 2025 lúc 06:35 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

DROP DATABASE IF EXISTS `e_commerce`; -- Drop the database if it exists
CREATE DATABASE `e_commerce`;         -- Create a new database
USE `e_commerce`;                     -- Switch to the new database

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `e_commerce`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `accounts`
--

CREATE TABLE `accounts` (
  `account_id` int(9) NOT NULL,
  `avatar` varchar(255) NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(100) NOT NULL,
  `full_name` varchar(50) NOT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `address` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `status` varchar(50) NOT NULL,
  `role_id` int(9) NOT NULL,
  `reset_token` varchar(255) NOT NULL,
  `token_expiry` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `accounts`
--

INSERT INTO `accounts` (`account_id`, `avatar`, `username`, `password`, `full_name`, `phone_number`, `address`, `email`, `status`, `role_id`, `reset_token`, `token_expiry`) VALUES
(1, '/uploads/avatars/67ed4448130eb_17ee935b-c63a-4374-8fc3-91b2559e02f2.jpg', 'adminkien', '$2y$10$kY5.a/5buDfv3qQCy5MTKuDF97I4E0wCUtCTWfKIcktdVpZMQKAcO', 'Dương Văn Kiên', '0888888888', 'Số 218 Đường Lĩnh Nam, Q.Hoàng Mai, TP.Hà Nộii', 'dvkien.dhti15a4hn@sv.uneti.edu.vn', 'active', 1, '', '2025-04-10 16:32:46'),
(2, '/uploads/avatars/67ed45d242692_minh.png', 'userminh', '$2y$10$kY5.a/5buDfv3qQCy5MTKuDF97I4E0wCUtCTWfKIcktdVpZMQKAcO', 'Hồ Anh Minh', '0999999999', 'Số 218 Đường Lĩnh Nam, Q.Hoàng Mai, TP.Hà Nội', 'haminh.dhti15a4hn@sv.uneti.edu.vn', 'active', 2, '', '2025-04-10 16:33:15'),
(3, '/uploads/avatars/67ed46982271b_huy.avif', 'userhuy', '$2y$10$kY5.a/5buDfv3qQCy5MTKuDF97I4E0wCUtCTWfKIcktdVpZMQKAcO', 'Nguyễn Trần Huy', '0666666666', 'Số 218 Đường Lĩnh Nam, Q.Hoàng Mai, TP.Hà Nội', 'nguyentranhuy@gmail.com', 'active', 3, '', '2025-04-10 16:33:17'),
(4, '/uploads/avatars/67ebe55defe0a_Logo-DH-Kinh-te-Ky-thuat-Cong-nghiep-UNETI.webp', 'userhoanganh', '$2y$10$kY5.a/5buDfv3qQCy5MTKuDF97I4E0wCUtCTWfKIcktdVpZMQKAcO', 'Nguyễn Hoàng Anh', NULL, '', 'nguyenhoanganh@gmail.com', 'active', 2, '', '2025-04-10 16:33:18'),
(5, '/uploads/avatars/67ebe55defe0a_Logo-DH-Kinh-te-Ky-thuat-Cong-nghiep-UNETI.webp', 'userhuong', '$2y$10$kY5.a/5buDfv3qQCy5MTKuDF97I4E0wCUtCTWfKIcktdVpZMQKAcO', 'Trần Thu Hương', NULL, '', 'tranthuhuong@gmail.com', 'active', 2, '', '2025-04-10 16:33:19'),
(6, '/uploads/avatars/67ebe55defe0a_Logo-DH-Kinh-te-Ky-thuat-Cong-nghiep-UNETI.webp', 'userhung', '$2y$10$kY5.a/5buDfv3qQCy5MTKuDF97I4E0wCUtCTWfKIcktdVpZMQKAcO', 'Vũ Thanh Hùng', NULL, '', 'vuthanhhung@gmail.com', 'active', 2, '', '2025-04-10 16:33:21');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cart`
--

CREATE TABLE `cart` (
  `cart_id` int(9) NOT NULL,
  `account_id` int(9) NOT NULL,
  `product_detail_id` int(9) NOT NULL,
  `purchase_quantity` int(9) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `cart`
--

INSERT INTO `cart` (`cart_id`, `account_id`, `product_detail_id`, `purchase_quantity`) VALUES
(20, 2, 73, 1),
(21, 2, 964, 1),
(23, 2, 19, 2),
(24, 2, 63, 3),
(25, 2, 774, 2),
(26, 2, 867, 2),
(27, 2, 143, 2),
(28, 2, 329, 1),
(29, 2, 934, 1),
(30, 2, 953, 1),
(32, 2, 666, 1),
(35, 2, 639, 1),
(36, 2, 983, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `contacts`
--

CREATE TABLE `contacts` (
  `contact_id` int(9) NOT NULL,
  `account_id` int(9) NOT NULL,
  `full_name` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `status` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `contacts`
--

INSERT INTO `contacts` (`contact_id`, `account_id`, `full_name`, `email`, `subject`, `message`, `status`) VALUES
(1, 2, 'Hồ Anh Minh', 'haminh.dhti15a4hn@sv.uneti.edu.vn', 'Hỗ trợ', 'Hãy hỗ trợ tôi thanh toán đơn hàng', 'responded'),
(2, 2, 'Hồ Anh Minh', 'haminh.dhti15a4hn@sv.uneti.edu.vn', 'Tư vấn sản phẩm', 'Hãy tư vấn sản phẩm phù hợp với yêu cầu của tôi', 'pending'),
(3, 3, 'Vũ Thanh Hùng', 'vuthanhhung@gmail.com', 'Hỗ trợ', 'Hãy hỗ trợ tôi thanh toán đơn hàng qua VNPay', 'responded');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `discount_codes`
--

CREATE TABLE `discount_codes` (
  `discount_id` int(9) NOT NULL,
  `code` varchar(50) NOT NULL,
  `description` varchar(255) NOT NULL,
  `discount_value` float NOT NULL,
  `quantity` int(9) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `discount_codes`
--

INSERT INTO `discount_codes` (`discount_id`, `code`, `description`, `discount_value`, `quantity`, `start_date`, `end_date`, `status`) VALUES
(1, 'EMKCODE', 'GIảm giá 20%', 20, 97, '2025-03-16', '2025-06-30', 'active'),
(2, 'THUONGMAIDIENTU', 'Giảm giá 5%', 5, 100, '2025-03-16', '2025-06-10', 'active'),
(3, 'ECOMMERCE', 'Giảm giá 10%', 10, 94, '2025-03-16', '2025-06-20', 'active');

--
-- Bẫy `discount_codes`
--
DELIMITER $$
CREATE TRIGGER `before_insert_discount_codes` BEFORE INSERT ON `discount_codes` FOR EACH ROW BEGIN
    IF NEW.quantity = 0 THEN
        SET NEW.status = 'expired';
    ELSEIF NEW.start_date > CURDATE() THEN
        SET NEW.status = 'not_yet_active';
    ELSEIF NEW.start_date <= CURDATE() AND NEW.end_date >= CURDATE() THEN
        SET NEW.status = 'active';
    ELSE
        SET NEW.status = 'expired';
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `before_update_discount_codes` BEFORE UPDATE ON `discount_codes` FOR EACH ROW BEGIN
    IF NEW.quantity = 0 THEN
        SET NEW.status = 'expired';
    ELSEIF NEW.start_date > CURDATE() THEN
        SET NEW.status = 'not_yet_active';
    ELSEIF NEW.start_date <= CURDATE() AND NEW.end_date >= CURDATE() THEN
        SET NEW.status = 'active';
    ELSE
        SET NEW.status = 'expired';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `invoices`
--

CREATE TABLE `invoices` (
  `invoice_id` int(9) NOT NULL,
  `account_id` int(9) NOT NULL,
  `order_date` datetime NOT NULL,
  `item_total` int(9) NOT NULL,
  `discount` decimal(18,0) NOT NULL,
  `amount_sum` decimal(18,0) NOT NULL,
  `payment_status` varchar(50) NOT NULL,
  `shipping_information` varchar(255) NOT NULL,
  `status` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `invoices`
--

INSERT INTO `invoices` (`invoice_id`, `account_id`, `order_date`, `item_total`, `discount`, `amount_sum`, `payment_status`, `shipping_information`, `status`) VALUES
(103944898, 5, '2023-04-13 21:50:37', 1, 0, 1269000, 'unpaid', 'Trần Thu Hương, 0938112233, 218 Đường Lĩnh Nam, Phường Lĩnh Nam, Quận Hoàng Mai, Thành phố Hà Nội', 'pending confirmation'),
(198187021, 2, '2025-03-19 15:28:12', 2, 195044, 1755392, 'paid', 'Dương Văn Kiên, 0999999999, Hoàng Giang, Toàn Thắng, Xã Toàn Thắng, Huyện Hiệp Hòa, Tỉnh Bắc Giang', 'completed'),
(207056703, 4, '2024-02-18 15:19:38', 2, 0, 1554000, 'paid', 'Dương Văn Kiên, 0999999999, Hoàng Giang, Toàn Thắng, Xã Toàn Thắng, Huyện Hiệp Hòa, Tỉnh Bắc Giang', 'completed'),
(347850025, 5, '2023-06-23 21:45:38', 1, 0, 384000, 'paid', 'Trần Thu Hương, 0938112233, 218 Đường Lĩnh Nam, Phường Lĩnh Nam, Quận Hoàng Mai, Thành phố Hà Nội', 'completed'),
(411502646, 6, '2022-05-19 21:39:00', 1, 0, 866760, 'paid', 'Vũ Thanh Hùng, 0333333333, 218 Đường Lĩnh Nam, Phường Lĩnh Nam, Quận Hoàng Mai, Thành phố Hà Nội', 'completed'),
(437546931, 6, '2025-04-02 21:35:59', 1, 33600, 302400, 'paid', 'Vũ Thanh Hùng, 0333333333, 218 Đường Lĩnh Nam, Phường Lĩnh Nam, Quận Hoàng Mai, Thành phố Hà Nội', 'completed'),
(461283707, 4, '2025-04-02 15:20:21', 2, 318800, 1275200, 'paid', 'Dương Văn Kiên, 0999999999, Hoàng Giang, Toàn Thắng, Xã Toàn Thắng, Huyện Hiệp Hòa, Tỉnh Bắc Giang', 'completed'),
(468622198, 2, '2022-05-15 15:28:23', 1, 57710, 1096490, 'paid', 'Dương Văn Kiên, 0999999999, Hoàng Giang, Toàn Thắng, Xã Toàn Thắng, Huyện Hiệp Hòa, Tỉnh Bắc Giang', 'completed'),
(474807098, 4, '2025-01-11 22:15:29', 1, 0, 504000, 'paid', 'Nguyễn Hoàng Anh, 0985385223, 218 Đường Lĩnh Nam, Phường Lĩnh Nam, Quận Hoàng Mai, Thành phố Hà Nội', 'completed'),
(507610581, 4, '2021-09-21 15:32:14', 1, 0, 396900, 'paid', 'Dương Văn Kiên, 0999999999, Hoàng Giang, Toàn Thắng, Xã Toàn Thắng, Huyện Hiệp Hòa, Tỉnh Bắc Giang', 'completed'),
(532337413, 2, '2022-02-10 15:19:55', 1, 16720, 317680, 'paid', 'Dương Văn Kiên, 0999999999, Hoàng Giang, Toàn Thắng, Xã Toàn Thắng, Huyện Hiệp Hòa, Tỉnh Bắc Giang', 'completed'),
(532589139, 2, '2021-08-19 15:59:08', 1, 14760, 280440, 'paid', 'Dương Văn Kiên, 0999999999, Hoàng Giang, Toàn Thắng, Xã Toàn Thắng, Huyện Hiệp Hòa, Tỉnh Bắc Giang', 'completed'),
(539385467, 4, '2023-08-13 15:28:46', 2, 176774, 3358706, 'paid', 'Dương Văn Kiên, 0999999999, Hoàng Giang, Toàn Thắng, Xã Toàn Thắng, Huyện Hiệp Hòa, Tỉnh Bắc Giang', 'completed'),
(541693989, 2, '2022-01-19 15:28:35', 1, 194641, 1751769, 'paid', 'Dương Văn Kiên, 0999999999, Hoàng Giang, Toàn Thắng, Xã Toàn Thắng, Huyện Hiệp Hòa, Tỉnh Bắc Giang', 'completed'),
(568413124, 6, '2022-03-10 21:37:01', 1, 0, 184000, 'paid', 'Vũ Thanh Hùng, 0333333333, 218 Đường Lĩnh Nam, Phường Lĩnh Nam, Quận Hoàng Mai, Thành phố Hà Nội', 'completed'),
(638018240, 5, '2022-05-25 21:45:51', 1, 0, 279000, 'unpaid', 'Trần Thu Hương, 0938112233, 218 Đường Lĩnh Nam, Phường Lĩnh Nam, Quận Hoàng Mai, Thành phố Hà Nội', 'pending confirmation'),
(736535363, 6, '2022-02-16 21:38:24', 1, 0, 936000, 'paid', 'Vũ Thanh Hùng, 0333333333, 218 Đường Lĩnh Nam, Phường Lĩnh Nam, Quận Hoàng Mai, Thành phố Hà Nội', 'completed'),
(739179350, 5, '2025-04-02 21:41:42', 1, 85000, 765000, 'paid', 'Trần Thu Hương, 0938112233, 218 Đường Lĩnh Nam, Phường Lĩnh Nam, Quận Hoàng Mai, Thành phố Hà Nội', 'completed'),
(764972342, 5, '2025-04-02 21:42:07', 1, 0, 1603980, 'paid', 'Trần Thu Hương, 0938112233, 218 Đường Lĩnh Nam, Phường Lĩnh Nam, Quận Hoàng Mai, Thành phố Hà Nội', 'completed'),
(842361663, 2, '2025-02-13 15:57:06', 1, 0, 4620000, 'paid', 'Dương Văn Kiên, 0999999999, Hoàng Giang, Toàn Thắng, Xã Toàn Thắng, Huyện Hiệp Hòa, Tỉnh Bắc Giang', 'completed'),
(884861053, 2, '2024-01-03 15:31:20', 1, 57400, 229600, 'paid', 'Dương Văn Kiên, 0999999999, Hoàng Giang, Toàn Thắng, Xã Toàn Thắng, Huyện Hiệp Hòa, Tỉnh Bắc Giang', 'completed'),
(897218545, 4, '2025-03-18 15:25:22', 3, 0, 1145890, 'unpaid', 'Dương Văn Kiên, 0999999999, Hoàng Giang, Toàn Thắng, Xã Toàn Thắng, Huyện Hiệp Hòa, Tỉnh Bắc Giang', 'pending confirmation'),
(936787953, 2, '2023-09-08 15:58:22', 1, 0, 9102500, 'unpaid', 'Dương Văn Kiên, 0999999999, Hoàng Giang, Toàn Thắng, Xã Toàn Thắng, Huyện Hiệp Hòa, Tỉnh Bắc Giang', 'pending confirmation');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `invoice_details`
--

CREATE TABLE `invoice_details` (
  `invoice_detail_id` int(9) NOT NULL,
  `invoice_id` int(9) NOT NULL,
  `product_id` int(9) NOT NULL,
  `product_detail_id` int(9) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `product_color` varchar(50) NOT NULL,
  `product_size` varchar(20) NOT NULL,
  `purchase_quantity` int(9) NOT NULL,
  `price` decimal(18,0) NOT NULL,
  `sale_price` decimal(18,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `invoice_details`
--

INSERT INTO `invoice_details` (`invoice_detail_id`, `invoice_id`, `product_id`, `product_detail_id`, `product_name`, `product_color`, `product_size`, `purchase_quantity`, `price`, `sale_price`) VALUES
(1, 207056703, 6, 50, 'Áo khoác cardigan nam Áo Khoác Cardigan lót nhung phong cách Hàn Quốc giữ ấm mẫu mới.', 'Be', 'M', 2, 525000, 441000),
(2, 207056703, 12, 103, 'Áo sweater Thơm phối viền tay vải chân cua dày dặn form đẹp Áo sweater Thơm phối viền tay vải đẹp mới nhất.', 'Xám', 'L', 2, 400000, 336000),
(3, 532337413, 23, 239, 'Quần dài ROWAY, vải linen co giãn nhẹ, form regular | suông linen.', 'Đen', 'L', 1, 380000, 334400),
(4, 461283707, 31, 319, 'Áo khoác phao mác cao su AGAIN 37° mùa đông dày dặn nữ dài tay bo chun Hàn Quốc phối màu form dài rộng.', 'Đen', 'L', 2, 500000, 425000),
(5, 461283707, 54, 571, 'Đầm vest nữ công sở Maihouse tay ngắn dập ly form dáng dài chất lụa sọc gân đi chơi dạo phố.', 'Nude', 'L', 3, 400000, 248000),
(8, 897218545, 71, 657, 'MẮT KÍNH THỜI TRANG NAM NỮ CAO CẤP SAL FULLBOX.Kính Râm Phong Cách Hàn Quốc Chống tia UV.Xuất Xứ Trung Quốc.', 'Đen', 'Free Size', 1, 1238000, 705660),
(9, 897218545, 83, 684, 'Mũ Lưỡi Trai JEEP, Nón Kết Nam Nữ Cao Cấp M194.', 'Be', 'Free Size', 1, 450000, 346500),
(10, 897218545, 87, 694, 'Mũ Nồi beret Cao Cấp Đính Kim Cương Chữ d Thời Trang Thu Đông Hàn Quốc Mới Cho Nữ.', 'Đen', 'Free Size', 1, 103000, 93730),
(11, 198187021, 97, 782, 'Giày Tây Công Sở Nam Cao Cấp - Da bò nhập khẩu mềm mại [SB03].', 'Đen', '40', 1, 1500000, 1320000),
(12, 198187021, 105, 867, 'Giày cao gót Beijiani da cừu Rhinestone ngọc trai Xiuhe cao cấp váy cưới phù dâu Giày cưới cô dâu Giày nữ mùa thu.', 'Mơ', '38', 1, 887937, 630435),
(13, 468622198, 114, 934, 'CHĂN LÔNG CHỒN, CHĂN HỒ LY CAO CẤP 6KG, CHĂN CAO CẤP,chất lượng hàng đầu siêu mướt mềm mịn ấm áp.', 'Nâu', '180x200x28 cm', 1, 1990000, 1154200),
(14, 541693989, 121, 959, 'Xe ô tô điện trẻ em ROLL-ROYCE SPORT 4 bánh 2 động cơ có điều khiển và tự lái xe an toàn cho bé tải trọng 60kg.', 'Trắng', 'Free Size', 1, 3299000, 1946410),
(15, 539385467, 131, 972, 'Balo đựng laptop MARK RYDEN 15.6 Inch cho nam.', 'Đen', 'Free Size', 2, 857000, 702740),
(16, 539385467, 137, 979, 'Túi Xách Nam Công Sở Cặp Da Doanh Nhân GENCE CDX14 Da Bò Cao Cấp Màu Nâu Đậm.', 'Nâu', 'Free Size', 1, 3000000, 2130000),
(17, 884861053, 147, 998, 'Túi xách nữ công sở, túi tote da đựng vừa laptop, A4 có khóa kéo chắc chắn kèm khăn lụa ví nhỏ HY14.', 'Đen', 'Free Size', 1, 350000, 287000),
(18, 507610581, 148, 1001, 'Túi xách tote nữ GILAN Gani bag ( 3 màu) - đựng được Laptop, A4.', 'Be nâu', 'Free Size', 1, 490000, 396900),
(19, 842361663, 119, 955, 'Tủ Quần Áo Kết Hợp Cửa Lùa Hiện Đại SIB Decor Màu Trắng Phối Vân Gỗ Sồi TA07.', 'Trắng', '1M8 x 2M4 x 0.6M', 1, 6000000, 4620000),
(20, 936787953, 113, 925, 'Đệm Foam Luna Gel mát lạnh thương hiệu SU:M cao cấp, tiêu chuẩn xuất Đức - ép cuộn, êm ái, nâng đỡ cơ thể tối ưu Foam112.', 'Bạc', '180x200x28 cm', 1, 16550000, 9102500),
(21, 532589139, 13, 110, 'Áo Nỉ Nam UMA LIMITED Lót Lông Thêu U Chất Liệu Nỉ Dày Dặn Cao Cấp Sweater Dài Tay ULA68.', 'Đen', 'M', 1, 360000, 295200),
(22, 437546931, 12, 103, 'Áo sweater Thơm phối viền tay vải chân cua dày dặn form đẹp Áo sweater Thơm phối viền tay vải đẹp mới nhất.', 'Xám', 'L', 1, 400000, 336000),
(23, 568413124, 30, 315, 'Quần short Bamboostreetwear Stu cotton không xù 272.', 'Trắng', 'L', 1, 200000, 184000),
(24, 736535363, 63, 638, 'Đồng Hồ Nữ Daniel Welington Classic Petite Sterling White & Vòng Tay DW Cuff Chính Hãng.', 'Vàng', 'Free Size', 1, 2080000, 936000),
(25, 411502646, 75, 664, 'Kính râm thời trang nam nữ MUSEE 01 cao cấp chống UV.Kính mát phong cách Hàn Quốc bảo hành 1 năm.', 'Đen', 'Free Size', 1, 1398000, 866760),
(26, 739179350, 31, 318, 'Áo khoác phao mác cao su AGAIN 37° mùa đông dày dặn nữ dài tay bo chun Hàn Quốc phối màu form dài rộng.', 'Đen', 'M', 2, 500000, 425000),
(27, 764972342, 38, 394, 'Áo khoác nữ lông thỏ unisex form rộng thụng MÀU TRƠN CÓ MŨ siêu rộng thiết kế phong cách Hàn Quốc.', 'Trắng', 'M', 3, 798000, 534660),
(28, 347850025, 40, 402, 'Áo Dạ Tweed Nữ Màu Đen Dáng Ngắn Phối Cúc Đồng Siêu Sang QC CAO CẤP - CAM KẾT Y HÌNH.', 'Đen', 'M', 2, 240000, 192000),
(29, 638018240, 145, 993, 'Túi xách Túi đeo vai thời trang Túi Tote dung tích lớn thông thường.', 'Be', 'Free Size', 2, 155000, 139500),
(30, 103944898, 109, 909, 'Giày nữ Mary Jane quai ngang đính đá cao cấp, hàng siêu nhẹ đế cao 5-7cm.', 'Đen', '38', 2, 705000, 634500),
(31, 474807098, 115, 940, 'Bộ chăn ga phi lụa ROMANTIC 1 tone màu sang trọng, bắt mắt, chăn chần bông microgel mềm mượt êm ái, thoáng khí.', 'Vàng', '180x200x28 cm', 1, 1050000, 504000);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` int(9) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `notifications`
--

INSERT INTO `notifications` (`notification_id`, `title`, `message`, `created_at`) VALUES
(1, 'Giảm Giá Sốc', 'Thông điệp: Nhanh tay lên! Săn ngay những món hàng yêu thích với mức giảm giá lên đến 70%. Thời gian có hạn!', '2025-03-30 05:41:58'),
(2, 'Ưu Đãi Mới Cập Nhật', 'Thông điệp: Khám phá các ưu đãi mới nhất và tận hưởng ngay hôm nay.', '2025-03-28 05:41:58'),
(3, 'Giảm Giá Đối Với Khách Hàng Mới', 'Thông điệp: Đặc biệt ưu đãi cho khách hàng mới. Nhận ngay mã giảm giá khi đăng ký.', '2025-03-01 05:41:58'),
(4, 'Ưu Đãi Ngày Lễ', 'Thông điệp: Ưu đãi lớn nhân dịp ngày lễ! Giảm giá đặc biệt cho các sản phẩm yêu thích.', '2025-03-12 05:41:58'),
(5, 'Thông Báo Hàng Đã Về Kho', 'Thông điệp: Sản phẩm bạn mong chờ đã về kho. Đặt hàng ngay hôm nay!', '2025-03-09 05:41:58'),
(6, 'Deal hời mỗi ngày', 'Hôm nay: Giảm giá 50% cho tất cả sản phẩm áo thun', '2025-03-01 14:22:00'),
(7, 'Flash Sale Cực Sốc', 'Thời gian có hạn – chỉ áp dụng từ 12h - 22h hôm nay', '2025-04-01 14:12:00'),
(8, 'Đại tiệc SALE cuối tuần', 'Chỉ áp dụng từ thứ 6 đến Chủ Nhật, đừng bỏ lỡ', '2025-03-29 14:27:08');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `pending_ratings`
--

CREATE TABLE `pending_ratings` (
  `pending_rating_id` int(9) NOT NULL,
  `account_id` int(9) NOT NULL,
  `product_id` int(9) NOT NULL,
  `invoice_id` int(9) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `pending_ratings`
--

INSERT INTO `pending_ratings` (`pending_rating_id`, `account_id`, `product_id`, `invoice_id`, `created_at`) VALUES
(1, 2, 97, 198187021, '2025-03-19 09:02:23'),
(2, 2, 105, 198187021, '2025-03-19 09:02:23'),
(3, 2, 6, 207056703, '2025-03-19 09:02:24'),
(4, 2, 12, 207056703, '2025-03-19 09:02:24'),
(5, 2, 31, 461283707, '2025-03-19 09:02:26'),
(6, 2, 54, 461283707, '2025-03-19 09:02:26'),
(7, 2, 114, 468622198, '2025-03-19 09:02:28'),
(8, 2, 13, 532589139, '2025-03-19 09:02:30'),
(9, 2, 148, 507610581, '2025-03-19 09:06:19');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
--

CREATE TABLE `products` (
  `product_id` int(9) NOT NULL,
  `category_id` int(9) NOT NULL,
  `subcategory_id` int(9) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `price` decimal(18,0) NOT NULL,
  `sale` int(3) NOT NULL,
  `sale_price` decimal(18,0) NOT NULL,
  `sold_quantity_sum` int(9) NOT NULL,
  `rating_count` int(9) NOT NULL,
  `average_rating` float NOT NULL DEFAULT 5,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`product_id`, `category_id`, `subcategory_id`, `product_name`, `price`, `sale`, `sale_price`, `sold_quantity_sum`, `rating_count`, `average_rating`, `description`) VALUES
(1, 1, 1, 'Áo Khoác Gió Bomber Dù Hai Lớp Chống Nước Cản Gió Chống Tia Uv, Có Túi Trong Mẫu Mới.', 299000, 8, 275080, 1278, 5, 4.8, 'Áo khoác gió bomber thiết kế hiện đại với chất liệu dù hai lớp cao cấp, giúp chống nước và cản gió hiệu quả. Được tích hợp công nghệ chống tia UV, sản phẩm mang lại sự an toàn khi sử dụng ngoài trời. Điểm nhấn là túi trong tiện dụng, thích hợp cho mọi hoạt động hàng ngày.'),
(2, 1, 1, 'Áo Khoác Philip Plen Hoddie Khóa Zip Họa Tiết Đính Đá MIx Thêu Siêu Nét_Áo Khoác Nam Chất Vải Nỉ Chân Cua Bản SCap.', 2320000, 15, 1972000, 634, 5, 4.8, 'Sản phẩm nổi bật với thiết kế khóa zip thời trang, họa tiết đính đá kết hợp với thêu sắc nét, tạo phong cách độc đáo. Chất liệu nỉ chân cua mềm mại, giữ ấm tốt, phù hợp cho cả phong cách đường phố lẫn lịch sự.'),
(3, 1, 1, 'Áo khoác gió nam bomber siêu cản gió GNH Active 2 lớp lót lông cao cấp siêu ấm form dáng thể thao.', 570000, 11, 507300, 1372, 5, 5, 'Áo khoác gió nam thiết kế thể thao với lớp ngoài cản gió tối ưu và lớp lót lông mềm mại bên trong, mang lại cảm giác ấm áp trong những ngày lạnh. Sản phẩm có form dáng năng động, phù hợp với các hoạt động ngoài trời.'),
(4, 1, 1, 'Áo phao nam unisex form rộng có mũ hàng quảng châu cao cấp.', 600000, 0, 600000, 2279, 5, 4.8, 'Áo phao unisex form rộng phong cách thời thượng, chất liệu dày dặn giúp giữ ấm vượt trội. Thiết kế có mũ tiện lợi và đường may tỉ mỉ, sản phẩm là lựa chọn lý tưởng cho mùa đông lạnh giá.'),
(5, 1, 1, 'Áo khoác bông mùa đông Áo khoác bông nam cổ đứng màu gradient.', 692000, 15, 588200, 1901, 5, 4.8, 'Sản phẩm với thiết kế cổ đứng sang trọng, sử dụng chất liệu bông dày dặn, giữ nhiệt tốt. Điểm nhấn màu gradient độc đáo, mang lại vẻ ngoài cuốn hút và khác biệt.'),
(6, 1, 1, 'Áo khoác cardigan nam Áo Khoác Cardigan lót nhung phong cách Hàn Quốc giữ ấm mẫu mới.', 525000, 0, 525000, 1906, 5, 4.8, 'Áo khoác cardigan lót nhung mềm mại, thiết kế theo phong cách Hàn Quốc hiện đại. Sản phẩm không chỉ giữ ấm hiệu quả mà còn dễ phối đồ, phù hợp cho nhiều hoàn cảnh sử dụng.'),
(7, 1, 1, 'Áo khoác dạ nam ROWAY chất liệu dạ ép cao cấp | Dạ ép zip.', 450000, 9, 409500, 1083, 5, 4.8, 'Áo khoác dạ nam ROWAY với chất liệu dạ ép cao cấp, thiết kế tối giản nhưng sang trọng. Đường zip chắc chắn và tông màu thanh lịch giúp sản phẩm trở thành lựa chọn hoàn hảo cho mùa đông.'),
(8, 1, 1, 'Áo khoác bomber dạ SEIXIDO áo khoác nam dáng vừa áo varsity tay da N05.', 399000, 0, 399000, 642, 5, 4.8, 'Thiết kế bomber pha trộn dạ ép và tay da tinh tế, mang phong cách varsity cổ điển. Form dáng vừa vặn, đường may tỉ mỉ, áo khoác SEIXIDO phù hợp với phong cách trẻ trung, năng động.'),
(9, 1, 1, 'Áo Gile Cable-Knit Len Dệt Kim Lông Cừu - Local Brand Revvour.', 350000, 13, 304500, 439, 5, 5, 'Áo gile len dệt kim họa tiết cable-knit sang trọng, sử dụng chất liệu lông cừu mềm mại. Sản phẩm của Revvour mang đến sự ấm áp và phong cách thời thượng, dễ phối với nhiều loại trang phục.'),
(10, 1, 1, 'Áo Polo Nam Aldo Cotton Cao Cấp Mát Mẻ, Mềm, Mịn,Phong Cách Sang Trọng - REVVOUR.', 375000, 12, 330000, 712, 5, 4.8, 'Áo polo cotton cao cấp với bề mặt mềm mịn, thoáng mát, mang lại cảm giác dễ chịu khi mặc. Thiết kế đơn giản nhưng lịch lãm, phù hợp cho cả công việc và dạo phố.'),
(11, 1, 1, 'VEGSVIR - Áo Sweater Nỉ Chân Cua Unisex Form Rộng CLASSIC.', 300000, 0, 300000, 2666, 5, 4.8, 'Áo sweater nỉ chân cua dày dặn với thiết kế form rộng unisex, phù hợp cho mọi giới tính. Chất liệu cao cấp giữ ấm tốt, màu sắc đơn giản dễ phối đồ.'),
(12, 1, 1, 'Áo sweater Thơm phối viền tay vải chân cua dày dặn form đẹp Áo sweater Thơm phối viền tay vải đẹp mới nhất.', 400000, 16, 336000, 1554, 5, 5, 'Sản phẩm nổi bật với chi tiết phối viền tay tinh tế, chất vải chân cua dày dặn. Thiết kế form đẹp và hợp thời trang, áo sweater Thơm là lựa chọn hoàn hảo cho mùa lạnh.'),
(13, 1, 1, 'Áo Nỉ Nam UMA LIMITED Lót Lông Thêu U Chất Liệu Nỉ Dày Dặn Cao Cấp Sweater Dài Tay ULA68.', 360000, 0, 360000, 3103, 5, 5, 'Áo nỉ nam UMA LIMITED sử dụng chất liệu nỉ dày dặn, bên trong lót lông mềm mại giữ ấm tối đa. Điểm nhấn là chi tiết thêu chữ U tinh tế, mang lại phong cách trẻ trung và thời thượng.'),
(14, 1, 1, 'Áo Giữ Nhiệt Nam UMA MEN Lông Thỏ Chất Nỉ Lông Cao Cấp Mặc Mùa Thu Đông Giữ Ấm Cơ Thể Cực Tốt AGN26.', 315000, 12, 277200, 1982, 5, 4.8, 'Sản phẩm giữ nhiệt nam UMA MEN với lớp lông thỏ cao cấp, giúp giữ ấm cơ thể hiệu quả trong mùa đông. Thiết kế ôm vừa vặn, co giãn thoải mái, phù hợp cho mọi hoạt động.\r\n\r\n'),
(15, 1, 1, 'Áo Giữ Nhiệt Nam Dài Tay Vải Thun Lạnh Co Giãn 4 Chiều Thoải Mái Giữ Ấm Tốt VESCAN.', 58000, 0, 58000, 1551, 5, 4.8, 'Áo giữ nhiệt vải thun lạnh với khả năng co giãn 4 chiều, mang lại sự thoải mái khi mặc. Sản phẩm giữ ấm hiệu quả, nhẹ nhàng và dễ dàng phối với các trang phục khác.'),
(16, 1, 2, 'Quần short tây nam CLASSIC HAFOS EZ COLLECTION quần âu nam chất vải cotton co giãn, hạn chế nhăn, form dáng sang trọng.', 379000, 0, 379000, 1207, 5, 5, 'Quần short tây nam CLASSIC mang phong cách thanh lịch, sử dụng chất liệu cotton co giãn, hạn chế nhăn và dễ bảo quản. Với form dáng chuẩn, sản phẩm phù hợp cho cả công sở lẫn các dịp dạo phố.'),
(17, 1, 2, 'Quần kaki nam HAFOS Smart Basic co giãn, mềm mịn, quần dài kaki nam ống suông Quần dài nam chuẩn form Menswear.', 450000, 0, 450000, 1572, 5, 4.8, 'Quần kaki HAFOS thiết kế tối giản với form dáng menswear thời thượng. Chất vải mềm mịn, co giãn nhẹ, ống suông thoải mái, là lựa chọn hoàn hảo cho phong cách năng động và lịch sự.'),
(18, 1, 2, 'Quần âu cạp phối chun nam CEFFYLO màu Đen chất vải cotton thoáng mát có độ bền cao co giãn.', 580000, 18, 475600, 476, 5, 5, 'Sản phẩm quần âu CEFFYLO với thiết kế cạp chun tiện lợi, chất liệu cotton thoáng mát và độ co giãn nhẹ. Gam màu đen sang trọng, phù hợp cho cả đi làm và đi chơi.'),
(19, 1, 2, 'Quần Jean Nam Baggy Form Suông Ống Rách Thời Trang,Quần Jean Nam Ống Suông Chất Liệu Cao Cấp.', 318000, 13, 276660, 952, 5, 5, 'Quần jean baggy nam thiết kế phá cách với chi tiết ống rách thời trang. Chất liệu jean cao cấp bền đẹp, form suông thoải mái, phù hợp với phong cách trẻ trung, cá tính.'),
(20, 1, 2, 'Quần Nỉ Track Pants Unisex Chất Liệu 2 Da Thu Đông Form Rộng.', 350000, 0, 350000, 980, 5, 4.8, 'Quần nỉ Track Pants với chất liệu 2 da giữ ấm tốt, phù hợp cho mùa thu đông. Thiết kế form rộng unisex hiện đại, mang lại sự thoải mái và phong cách đường phố năng động.'),
(21, 1, 2, 'WNS Logo Pant - Quần Dài Nỉ Hàn Form Unisex Chính Hãng Local Brand WNS.', 300000, 13, 261000, 957, 5, 4.8, 'Quần dài WNS Logo Pant từ local brand chính hãng, chất nỉ cao cấp giữ ấm tốt. Thiết kế form unisex chuẩn phong cách Hàn Quốc, thích hợp cho cả nam và nữ.'),
(22, 1, 2, 'Quần Dài Nam Form Suông, Vải Linen Mềm Mịn, Thoải Mái, Thanh Lịch QDL999.', 350000, 11, 311500, 806, 5, 4.8, 'Sản phẩm quần dài nam vải linen mềm mại, mang lại cảm giác thoáng mát, thoải mái khi mặc. Thiết kế form suông thanh lịch, dễ dàng phối đồ cho nhiều dịp khác nhau.'),
(23, 1, 2, 'Quần dài ROWAY, vải linen co giãn nhẹ, form regular | suông linen.', 380000, 12, 334400, 1784, 5, 5, 'Quần dài ROWAY sử dụng vải linen co giãn nhẹ, thiết kế form regular vừa vặn, tạo nên phong cách thanh lịch nhưng không kém phần tiện dụng.'),
(24, 1, 2, 'Quần Short logo Teelab,Quần đùi basic dây rút chất cotton thỏa mái thoáng mát thấm hút mồ hôi năng động.', 180000, 0, 180000, 1080, 5, 4.8, 'Quần short logo Teelab với thiết kế basic, dây rút tiện lợi. Chất cotton thoáng mát, thấm hút mồ hôi tốt, mang lại sự thoải mái và năng động cho người mặc.'),
(25, 1, 2, 'Quần Short Ba Chiều Nam S-XL 3 Màu In Hình Đơn Giản Phù Hợp Với Quần Short Mùa Hè Dạo Phố Quần Crop.', 468000, 18, 383760, 1852, 5, 4.8, 'Sản phẩm quần short ba chiều nam thiết kế in hình tối giản, đa dạng màu sắc. Form dáng phù hợp cho mùa hè, dễ dàng phối đồ khi dạo phố hoặc các hoạt động ngoài trời.'),
(26, 1, 2, 'Quần Short Màu Trơn Cảm Giác Cao Cấp Nam 2 Màu Size S-XL Mùa Hè Mỏng Phong Cách Thể Thao Năm Điểm Quần 1 Dạo Phố Trắng.', 250000, 0, 250000, 1080, 5, 4.8, 'Quần short màu trơn cao cấp với chất liệu nhẹ mỏng thoáng mát, phù hợp cho mùa hè. Thiết kế thể thao năng động, mang lại cảm giác thoải mái và phong cách hiện đại.'),
(27, 1, 2, 'Quần Short Âu UMA LIMITED Chất Kaki Chéo Hàn Cạp Chun Co Giãn Thoải Mái, Quần Ngố Nam Ống Suông Style Hàn Quốc ULQ01.', 300000, 0, 300000, 1521, 5, 4.8, 'Quần short âu UMA LIMITED với chất kaki chéo Hàn Quốc bền đẹp, cạp chun co giãn thoải mái. Thiết kế ống suông chuẩn phong cách Hàn Quốc, phù hợp cho cả đi làm và dạo phố.'),
(28, 1, 2, 'Quần short nam KAKI GIÓ cạp chun pha cúc trẻ trung.', 218000, 13, 189660, 2535, 5, 4.8, 'Sản phẩm quần short kaki gió với thiết kế cạp chun pha cúc độc đáo. Chất liệu gió thoáng mát, dễ chịu, mang phong cách trẻ trung và năng động.'),
(29, 1, 2, 'Quần Shot Nam Quần ngố nam đẹp quần đùi nam dập vân thêu nổi.', 189000, 9, 171990, 1791, 5, 4.8, 'Quần short nam thiết kế độc đáo với họa tiết dập vân thêu nổi, tạo điểm nhấn thời trang. Chất liệu cao cấp, thoải mái, phù hợp với nhiều hoàn cảnh sử dụng.'),
(30, 1, 2, 'Quần short Bamboostreetwear Stu cotton không xù 272.', 200000, 8, 184000, 2342, 5, 4.8, 'Quần short Bamboostreetwear sử dụng chất liệu cotton cao cấp, không xù lông. Thiết kế hiện đại, mang lại cảm giác thoải mái và phong cách thời thượng.'),
(31, 2, 3, 'Áo khoác phao mác cao su AGAIN 37° mùa đông dày dặn nữ dài tay bo chun Hàn Quốc phối màu form dài rộng.', 500000, 15, 425000, 1072, 5, 4.8, 'Áo khoác phao AGAIN 37° được thiết kế cho mùa đông lạnh giá với lớp phao dày dặn và khả năng giữ ấm vượt trội. Điểm nhấn là mác cao su thương hiệu nổi bật, mang đến cảm giác sang trọng. Tay áo bo chun giữ nhiệt tốt, thiết kế phối màu trẻ trung, dáng dài rộng theo phong cách Hàn Quốc hiện đại. Đây là lựa chọn lý tưởng để bảo vệ cơ thể trong thời tiết giá lạnh mà vẫn giữ phong cách thời thượng.'),
(32, 2, 3, 'Áo Phao Nữ Logo Cateen, Áo Khoác Phao Nữ Unisex Form Rộng Dáng Xuông Mùa Đông Freesize.', 225000, 10, 202500, 1112, 5, 4.8, 'Áo phao nữ Cateen mang phong cách unisex đa dụng, phù hợp cho cả nam và nữ. Chất liệu phao dày giữ ấm hiệu quả, logo Cateen in nổi bật tạo điểm nhấn thương hiệu. Với dáng xuông thoải mái và freesize dễ mặc, sản phẩm là lựa chọn hoàn hảo cho các hoạt động ngoài trời mùa đông, từ đi học đến dạo phố.'),
(33, 2, 3, 'Áo Khoác Phao Unisex FREE SZ Thêu Trái Tim Có Mũ Dáng Thụng Hothit 2024.', 350000, 0, 350000, 1112, 5, 5, 'Thiết kế áo khoác phao thêu trái tim đáng yêu, dáng thụng thoải mái và thời trang. Áo đi kèm mũ tiện lợi, phù hợp cho nhiều phong cách từ năng động đến dễ thương. Chất liệu phao giữ ấm tốt, freesize giúp mọi dáng người đều có thể mặc đẹp.'),
(34, 2, 3, 'ÁO PHAO NỮ LÓT LÔNG QUẢNG CHÂU DÁNG NGẮN.', 450000, 13, 391500, 2706, 5, 4.8, 'Áo phao lót lông Quảng Châu với thiết kế dáng ngắn trẻ trung, phù hợp với mọi độ tuổi. Lớp lót lông mềm mại bên trong giữ nhiệt tốt, mang lại cảm giác ấm áp trong những ngày lạnh. Chất liệu cao cấp giúp áo nhẹ nhàng nhưng vẫn bền đẹp sau thời gian dài sử dụng.'),
(35, 2, 3, 'Áo Dạ Tweed Kẻ Dáng Dài Hai Màu Siêu Cá Tính, Áo Dạ Nữ Kẻ Khoác Siêu Xinh (Có Bigsize) D005.', 259000, 12, 227920, 1112, 5, 5, 'Chiếc áo dạ tweed kẻ hai màu mang phong cách cổ điển pha lẫn hiện đại. Với dáng dài thanh lịch, chất liệu dạ tweed cao cấp giúp giữ ấm tốt và tạo nét sang trọng. Sản phẩm có bigsize, phù hợp với mọi dáng người, là lựa chọn lý tưởng cho những dịp đi làm hay dạo phố.'),
(36, 2, 3, 'Áo Khoác Trần Bông Mỏng MAYBE_VER2 Gió Dù Chống Nước Hai Lớp Mùa Đông Nữ Unisex, Áo Phao Mỏng Form Rộng Ấm Áp.', 350000, 15, 297500, 1112, 5, 4.8, 'Áo khoác trần bông MAYBE_VER2 thiết kế với lớp gió dù chống nước hiệu quả, giúp bảo vệ bạn trong những ngày mưa rét. Áo có hai lớp giữ nhiệt tốt nhưng vẫn nhẹ nhàng và thoải mái. Form rộng unisex phù hợp với mọi dáng người, mang đến sự tiện dụng và phong cách hiện đại.'),
(37, 2, 3, 'Áo khoác lông thỏ CÓ MŨ tai gấu dày dặn rộng thụng siêu xinh hàng QC.', 700000, 29, 497000, 1594, 5, 4.8, 'Chiếc áo khoác lông thỏ mềm mại với thiết kế mũ tai gấu dễ thương, phù hợp cho những bạn trẻ yêu thích phong cách đáng yêu. Lớp lông dày dặn giữ ấm tối ưu, form rộng thụng tạo sự thoải mái khi mặc, thích hợp cho cả dạo phố và đi học.'),
(38, 2, 3, 'Áo khoác nữ lông thỏ unisex form rộng thụng MÀU TRƠN CÓ MŨ siêu rộng thiết kế phong cách Hàn Quốc.', 798000, 33, 534660, 1115, 5, 5, 'Áo khoác lông thỏ màu trơn đơn giản nhưng tinh tế, phù hợp với phong cách Hàn Quốc hiện đại. Form dáng rộng thụng dễ mặc, lớp lông mềm mại giữ ấm cực tốt. Thiết kế unisex phù hợp cho cả nam và nữ, là sự lựa chọn hoàn hảo cho những ngày đông giá rét.'),
(39, 2, 3, 'Áo khoác dạ tweed nữ 2 lớp cục đồng cao cấp mùa thu đông thiết kế hàn quốc siêu ấm (Áo 2 Lớp).', 360000, 23, 277200, 482, 5, 5, 'Chiếc áo dạ tweed nữ cao cấp với lớp lót giữ ấm, được thiết kế sang trọng cùng chi tiết cúc đồng tinh xảo. Dáng áo dài giúp tôn lên vóc dáng người mặc, phù hợp với mọi hoàn cảnh từ công sở đến tiệc tùng.'),
(40, 2, 3, 'Áo Dạ Tweed Nữ Màu Đen Dáng Ngắn Phối Cúc Đồng Siêu Sang QC CAO CẤP - CAM KẾT Y HÌNH.', 240000, 20, 192000, 488, 5, 4.8, 'Áo dạ tweed màu đen dáng ngắn, thiết kế hiện đại với chi tiết cúc đồng sang trọng. Chất liệu dạ cao cấp mang lại sự ấm áp và đẳng cấp. Sản phẩm cam kết giống hình, là sự lựa chọn hoàn hảo cho những ngày lạnh giá.\r\n\r\n'),
(41, 2, 6, 'Quần nữ ống suông nỉ dày dặn, quần ống rộng mịn đẹp xếp ly.', 139000, 0, 139000, 1594, 5, 4.8, 'Quần nữ ống suông với chất liệu nỉ dày dặn, giữ ấm tốt và chống nhăn. Thiết kế xếp ly tạo điểm nhấn tinh tế, giúp tôn dáng và phù hợp với nhiều phong cách, từ công sở đến dạo phố.'),
(42, 2, 6, 'Quần kaki ống rộng túi hộp nữ cao cấp Hàn Quốc tôn dáng,quần jogger có dây rút phong cách cá tính,năng động.', 135000, 10, 121500, 1594, 5, 4.8, 'Sản phẩm quần kaki túi hộp mang đậm phong cách Hàn Quốc trẻ trung. Thiết kế ống rộng thoải mái, dây rút tiện lợi, kết hợp với chất liệu cao cấp giúp tôn dáng và tăng sự năng động, cá tính.'),
(43, 2, 6, 'Quần Tây Ống Suông (Chất Gold Nhật) Mềm Mịn Lưng Cao Tôn Dáng Nữ Dài 97cm và 102cm.', 210000, 13, 182700, 3336, 5, 4.8, 'Quần tây nữ ống suông với chất liệu Gold Nhật mềm mại, tạo cảm giác dễ chịu khi mặc. Thiết kế lưng cao giúp tôn dáng tối ưu, chiều dài đa dạng 97cm và 102cm phù hợp với nhiều chiều cao.'),
(44, 2, 6, 'Quần nỉ ống rộng dằn dọc hông mẫu hót 2024. Quần nữ ống rộng chất nỉ hàn chống bai xù Blessing hàng loại 1.', 320000, 19, 259200, 2224, 5, 4.8, 'Chiếc quần nỉ ống rộng Blessing với thiết kế dằn dọc hông hiện đại, mang lại vẻ ngoài năng động và phong cách. Chất nỉ Hàn Quốc chống bai xù đảm bảo độ bền, là lựa chọn lý tưởng cho mùa đông.'),
(45, 2, 6, 'Quần kaki ống suông nữ lưng cao phong cách Hàn Quốc trẻ trung đa dạng màu.', 250000, 16, 210000, 2706, 5, 4.8, 'Quần kaki nữ ống suông với lưng cao tôn dáng và mang lại sự thoải mái khi mặc. Thiết kế theo phong cách Hàn Quốc trẻ trung, cùng bảng màu đa dạng, dễ dàng phối đồ cho nhiều phong cách khác nhau.'),
(46, 2, 6, 'Quần tây ống rộng dài xuông nữ lưng cao Sevensen quần suông quần âu quần công sở.', 250000, 18, 205000, 1597, 5, 5, 'Quần tây ống rộng Sevensen mang phong cách thời trang hiện đại với thiết kế dáng suông thanh lịch, phù hợp với môi trường công sở hay các buổi gặp gỡ quan trọng. Sản phẩm được may từ chất liệu vải cao cấp, mềm mại và thoáng khí, giúp bạn luôn thoải mái trong suốt ngày dài. Với phần lưng cao ôm sát, quần tây tạo hiệu ứng tôn dáng và kéo dài đôi chân. Đường may tinh tế cùng chi tiết túi tiện lợi mang đến sự hoàn thiện cho sản phẩm. Đây chắc chắn là món đồ không thể thiếu trong tủ đồ của bạn.'),
(47, 2, 6, 'Quần tây ống rộng suông nữ lưng thun phía sau ống đứng dáng suông bigsize màu đen lưng cao khóa trước co giãn.', 250000, 18, 205000, 482, 5, 4.8, 'Chiếc quần tây ống rộng suông nữ này được thiết kế để vừa vặn và thoải mái với mọi dáng người. Lưng thun phía sau kết hợp với khóa kéo phía trước giúp quần dễ dàng mặc vào và ôm trọn vòng eo một cách tự nhiên. Màu đen cơ bản, dễ phối đồ cùng chất vải co giãn cao cấp mang lại sự thanh lịch và tiện dụng cho mọi hoàn cảnh. Quần phù hợp cho cả đi làm, dự tiệc hay dạo phố, giúp bạn luôn tự tin và nổi bật.'),
(48, 2, 4, 'Chân váy xếp ly đính nơ ren 2 tầng váy nữ cạp cao chữ A mini thiết kế hàn quốc lolita tennis trendy.', 170000, 0, 170000, 1112, 5, 4.8, 'Độc đáo và nữ tính, chân váy xếp ly đính nơ ren 2 tầng là sự kết hợp hoàn hảo giữa phong cách Hàn Quốc trẻ trung và sự thanh lịch truyền thống. Phần cạp cao ôm sát tạo vòng eo thon gọn, trong khi thiết kế dáng chữ A mini mang đến sự năng động và cuốn hút. Nơ ren đính nổi bật làm điểm nhấn, cùng chất liệu vải mềm mại giúp sản phẩm bồng bềnh và giữ dáng tốt. Chiếc váy này phù hợp cho cả đi chơi, dự tiệc hoặc các buổi hẹn hò lãng mạn.'),
(49, 2, 4, 'Chân váy ngắn đính nơ, chân váy xếp ly dáng xòe phối ren cạp cao basic hottrend cho nữ.', 150000, 15, 127500, 1112, 5, 4.8, 'Chân váy ngắn dáng xòe phối ren là item thời trang không thể thiếu cho những cô nàng yêu thích sự ngọt ngào và hiện đại. Sản phẩm được làm từ chất liệu vải cao cấp, bề mặt mềm mịn và co giãn tốt. Điểm nhấn là chiếc nơ xinh xắn ở phần cạp cao, giúp tôn lên vòng eo thon gọn và nữ tính. Thiết kế xếp ly tinh tế làm tăng độ bồng bềnh, tạo sự thoải mái khi di chuyển. Phù hợp để phối với áo thun, áo sơ mi hoặc áo len trong mọi hoàn cảnh.'),
(50, 2, 5, 'Đầm nữ dự tiệc có bigsize thiết kế cúp ngực xòe tay bồng nhún.', 750000, 60, 300000, 2224, 5, 4.8, 'Chiếc đầm dự tiệc sang trọng này nổi bật với thiết kế cúp ngực gợi cảm và tay bồng nhún mềm mại, tạo sự quý phái và nữ tính. Phần chân váy xòe rộng mang lại sự thoải mái, đồng thời tôn lên vóc dáng cân đối của người mặc. Sản phẩm được làm từ chất liệu cao cấp với độ bóng nhẹ, thích hợp cho các buổi tiệc tối hoặc sự kiện quan trọng. Với đủ size, kể cả bigsize, chiếc đầm này hứa hẹn là sự lựa chọn hoàn hảo cho mọi dáng người.'),
(51, 2, 7, 'Váy Đen Phối Cổ Sơmi Kèm Nơ Siêu Xinh Cho Nữ (Có Ảnh Thật).', 250000, 19, 202500, 482, 5, 5, 'Chiếc váy đen phối cổ sơ mi này là sự kết hợp hoàn hảo giữa nét cổ điển và hiện đại. Thiết kế cổ sơ mi trắng nổi bật trên nền đen, kèm theo nơ tinh tế, mang lại vẻ thanh lịch và sang trọng. Phần chân váy dáng xòe nhẹ giúp bạn thêm phần duyên dáng, trong khi chất liệu vải cao cấp mềm mại, thoáng mát đảm bảo sự thoải mái trong suốt ngày dài. Đây là lựa chọn lý tưởng cho các buổi hẹn hò, đi làm hoặc dự tiệc.'),
(52, 2, 5, 'Đầm dự tiệc Nhật Vy đính cúc bọc dập ly dáng xoè chất lụa phù hợp công sở đi chơi sang trọng cho nữ.', 400000, 0, 400000, 814, 5, 4.8, 'Đầm Nhật Vy được thiết kế dành riêng cho những dịp đặc biệt, với điểm nhấn là hàng cúc bọc tinh xảo và chi tiết dập ly chạy dọc thân váy. Phần chân váy xòe nhẹ nhàng mang lại sự thoải mái và thanh lịch. Chất liệu lụa cao cấp không chỉ mềm mịn mà còn tạo hiệu ứng ánh sáng nhẹ, tôn lên vẻ ngoài rạng rỡ. Đầm phù hợp để diện trong các buổi tiệc, đi làm hay gặp gỡ bạn bè, mang lại sự tự tin và cuốn hút.'),
(53, 2, 5, 'Đầm bigsize Maihouse cổ vest nút bọc dập ly chất lụa phù hợp công sở dự tiệc thanh lịch cho nữ.', 400000, 33, 268000, 1538, 5, 4.8, 'Chiếc đầm bigsize từ Maihouse được thiết kế đặc biệt với cổ vest thanh lịch và hàng nút bọc tinh tế. Phần chân váy dập ly tạo cảm giác nhẹ nhàng, giúp tôn dáng nhưng vẫn thoải mái cho người mặc. Sản phẩm được làm từ chất lụa mềm mại, không chỉ mang lại cảm giác dễ chịu mà còn tạo vẻ ngoài sang trọng. Đây là món đồ lý tưởng cho các buổi tiệc công sở hoặc sự kiện quan trọng.'),
(54, 2, 5, 'Đầm vest nữ công sở Maihouse tay ngắn dập ly form dáng dài chất lụa sọc gân đi chơi dạo phố.', 400000, 38, 248000, 790, 5, 4.8, 'Với thiết kế tay ngắn và form dáng dài, chiếc đầm vest Maihouse là sự lựa chọn hoàn hảo cho những cô nàng yêu thích sự tinh tế. Chất lụa sọc gân mềm mại giúp tạo sự thoải mái khi mặc, đồng thời đường dập ly ở thân váy mang lại vẻ ngoài gọn gàng và thời thượng. Phù hợp để đi làm, đi chơi hoặc dạo phố, chiếc đầm này sẽ giúp bạn luôn tự tin và nổi bật.'),
(55, 2, 6, 'Quần Ống Rộng Nữ Cạp Chun Vải Đũi Cao Cấp Lên Dáng Siêu Xinh.', 139000, 39, 84790, 1542, 5, 5, 'Quần ống rộng nữ được làm từ chất liệu vải đũi cao cấp, với cạp chun co giãn mang lại sự thoải mái tối đa. Thiết kế dáng suông giúp tạo hiệu ứng kéo dài đôi chân, phù hợp với mọi vóc dáng. Chất liệu nhẹ nhàng, thoáng khí đảm bảo sự dễ chịu trong những ngày nắng nóng. Đây là sản phẩm lý tưởng để phối cùng áo phông, áo sơ mi hoặc áo len, tạo nên phong cách trẻ trung, năng động.'),
(56, 2, 6, 'Quần Jeans Nữ Ống Rộng Loe Màu Trắng Form Rộng Dài Chùm Phủ Chân.', 260000, 0, 260000, 426, 5, 5, 'Chiếc quần jeans ống rộng màu trắng này mang phong cách thời trang hiện đại, với dáng loe nhẹ tạo sự độc đáo và cá tính. Chất liệu denim cao cấp giúp quần giữ form tốt, bền đẹp theo thời gian. Màu trắng cơ bản dễ dàng phối với nhiều loại trang phục, từ áo thun năng động đến áo sơ mi thanh lịch. Sản phẩm này phù hợp để diện trong mọi hoàn cảnh, từ đi làm đến dạo phố.'),
(57, 2, 6, 'Quần bò ống xuông trắng basic, quần jean ống rộng trắng dành cho nữ dễ phối đồ.', 250000, 0, 250000, 421, 5, 4.8, 'Đơn giản nhưng không kém phần nổi bật, quần bò ống xuông trắng là lựa chọn hoàn hảo cho các cô nàng yêu thích sự tinh tế. Thiết kế basic dễ phối với mọi loại áo, từ áo crop top đến áo len dáng rộng. Chất liệu jeans cao cấp giúp quần giữ được sự mềm mại nhưng vẫn cứng cáp, tạo cảm giác thoải mái khi mặc. Đây là item không thể thiếu trong tủ đồ hàng ngày.'),
(58, 2, 6, 'Quần Ống Rộng Nữ Chất Dạ Đẹp siêu Mềm Mịn,Co Giãn ,Kẻ Caro.', 145000, 26, 107300, 1666, 5, 5, 'Chiếc quần ống rộng chất dạ này mang đến sự sang trọng và tinh tế, với họa tiết kẻ caro cổ điển. Chất liệu dạ mềm mịn và co giãn nhẹ tạo sự thoải mái khi di chuyển, trong khi cạp cao giúp tôn lên vóc dáng. Thiết kế này phù hợp để phối cùng áo len, áo khoác dài hoặc blazer, tạo nên phong cách mùa đông ấm áp và thời thượng.'),
(59, 2, 6, 'QUẦN ỐNG RỘNG NỮ KẺ SỌC CHẤT DẠ HÀN CAO CẤP CẠP CHUN DÂY ÚT SIÊU HÁCH DÁNG.', 139000, 19, 112590, 833, 5, 5, 'Quần ống rộng nữ kẻ sọc mang phong cách Hàn Quốc hiện đại, với chất liệu dạ cao cấp giúp giữ ấm và thoải mái. Cạp chun dây rút tiện lợi, phù hợp với mọi dáng người. Thiết kế sọc dọc không chỉ tạo hiệu ứng kéo dài đôi chân mà còn mang đến sự thời thượng. Đây là lựa chọn lý tưởng để diện trong các dịp đi làm hoặc dạo phố.'),
(60, 2, 6, 'Quần ống rộng suông nữ lưng cao 1 cúc chuẩn form LAVILO chất vải chéo xotifia mềm mịn chống nhăn tốt.', 300000, 17, 249000, 1194, 5, 4.8, 'Quần ống rộng LAVILO là biểu tượng của sự thanh lịch với thiết kế lưng cao và 1 cúc cài tinh tế. Chất vải chéo xotifia mềm mịn, chống nhăn tốt giúp quần luôn giữ được form dáng đẹp mắt. Sản phẩm này phù hợp cho các buổi họp công sở hoặc sự kiện trang trọng, mang đến phong cách chuyên nghiệp và cuốn hút.'),
(61, 3, 8, 'Đồng hồ nam PABLO RAEZ dạ quang chống nước lịch sự đơn giản U850 CARIENT.', 350000, 0, 350000, 225, 5, 5, 'Đồng hồ nam PABLO RAEZ U850 CARIENT là sự kết hợp hoàn hảo giữa phong cách lịch lãm và tính năng tiện ích. Được trang bị mặt đồng hồ dạ quang, giúp dễ dàng xem giờ trong điều kiện thiếu sáng, cùng với khả năng chống nước tối ưu, chiếc đồng hồ này mang đến sự an tâm cho người sử dụng trong mọi hoàn cảnh. Dây đeo được làm từ chất liệu thép không gỉ, bền bỉ và chắc chắn, tạo nên một sản phẩm vừa đẹp mắt lại vừa tiện lợi.'),
(62, 3, 8, 'Đồng hồ nam Olevs lộ cơ automatic chính hãng,Đồng hồ đeo tay cao cấp, Đồng hồ lịch chống nước.', 2980000, 0, 2980000, 209, 5, 4.8, 'Đồng hồ Olevs lộ cơ automatic mang đến sự tinh tế trong thiết kế với mặt kính trong suốt cho phép người đeo chiêm ngưỡng cơ chế hoạt động của bộ máy bên trong. Đây là một chiếc đồng hồ cao cấp, có tính năng lịch và khả năng chống nước, phù hợp với mọi phong cách và nhu cầu sử dụng. Dây đeo kim loại chắc chắn cùng với thiết kế thời thượng, giúp tôn lên phong cách cá nhân của người sử dụng.'),
(63, 3, 8, 'Đồng Hồ Nữ Daniel Welington Classic Petite Sterling White & Vòng Tay DW Cuff Chính Hãng.', 2080000, 55, 936000, 301, 5, 5, 'Đồng hồ Daniel Wellington Classic Petite Sterling White là lựa chọn tuyệt vời cho các cô gái yêu thích sự nhẹ nhàng và thanh thoát. Với mặt đồng hồ trắng tinh khôi kết hợp cùng dây đeo mảnh, chiếc đồng hồ này thể hiện vẻ đẹp thanh lịch và sang trọng. Vòng tay DW Cuff đi kèm làm tôn thêm sự quý phái, giúp tạo điểm nhấn cho bất kỳ bộ trang phục nào. Đây là một sản phẩm chính hãng, lý tưởng cho những dịp đặc biệt.'),
(64, 3, 8, 'Đồng Hồ Nữ Quadro Pressed Sterling & Vòng Tay Classic Cuff V1 DW Chính Hãng.', 2680000, 58, 1125600, 271, 5, 4.8, 'Đồng hồ nữ Daniel Wellington Quadro Pressed Sterling sở hữu thiết kế vuông tinh tế, mang đến một vẻ đẹp độc đáo và hiện đại. Mặt đồng hồ sáng bóng, nổi bật trên dây đeo kim loại thanh mảnh. Kết hợp cùng vòng tay Classic Cuff V1, sản phẩm này không chỉ là đồng hồ mà còn là một phụ kiện sang trọng, giúp tôn lên vẻ đẹp của bạn. Đây là sản phẩm chính hãng, đảm bảo chất lượng và sự bền bỉ.'),
(65, 3, 8, 'OLEVS Đồng hồ nữ chính hãng chống nước thạch anh thời trang thép không gỉ 9999.', 881000, 0, 881000, 360, 5, 4.8, 'OLEVS 9999 là một chiếc đồng hồ nữ mang đậm phong cách thời trang hiện đại với bộ máy thạch anh chính xác. Thiết kế chống nước và dây đeo thép không gỉ giúp sản phẩm này bền bỉ với thời gian và dễ dàng bảo trì. Mặt đồng hồ đơn giản nhưng sang trọng, dễ dàng kết hợp với nhiều trang phục khác nhau, từ công sở cho đến những buổi tiệc sang trọng.'),
(66, 3, 8, 'Đồng Hồ OPK 8115 Chính Hãng Dành Cho Nữ Chống Nước Dây Kim Loại Thép Không Gỉ Giá Rẻ Mặt Nhỏ Đẹp Hàn Quốc.', 300000, 0, 300000, 208, 5, 5, 'Đồng hồ OPK 8115 là sự kết hợp hoàn hảo giữa tính năng và giá trị. Với thiết kế nhỏ gọn, mặt đồng hồ thanh thoát, chiếc đồng hồ này mang đến vẻ đẹp dịu dàng, nữ tính cho người đeo. Dây kim loại thép không gỉ chắc chắn và khả năng chống nước tuyệt vời khiến sản phẩm trở thành lựa chọn lý tưởng cho phụ nữ hiện đại.'),
(67, 3, 8, 'Đồng hồ nữ OLEVS 9931 chính hãng dây đeo bằng thép không gỉ có lịch phát sáng chống thấm nước.', 600000, 0, 600000, 287, 5, 4.8, 'Đồng hồ OLEVS 9931 là sự kết hợp giữa tính năng và thẩm mỹ. Mặt đồng hồ phát sáng giúp dễ dàng xem giờ trong điều kiện thiếu sáng. Dây đeo bằng thép không gỉ vừa bền bỉ lại vừa sang trọng, phù hợp với những cô nàng yêu thích sự thanh lịch và tiện dụng. Khả năng chống thấm nước giúp sản phẩm này luôn giữ được vẻ đẹp lâu dài theo thời gian.'),
(68, 3, 8, 'Đồng hồ nữ chính hãng IBSO sang trọng đẳng cấp.', 1049000, 38, 650380, 212, 5, 5, 'Đồng hồ nữ IBSO mang đến vẻ đẹp đẳng cấp với thiết kế sang trọng, phù hợp cho những dịp đặc biệt. Được chế tác từ chất liệu cao cấp, sản phẩm này không chỉ bền bỉ mà còn mang đến sự tự tin cho người sử dụng. Mặt đồng hồ nổi bật, có thể kết hợp với nhiều bộ trang phục khác nhau, từ đi làm đến đi tiệc.'),
(69, 3, 8, 'Đồng Hồ Đeo Tay OPK 8105 Thép Không Gỉ Chống Nước Thời Trang Cho Nữ.', 338000, 15, 287300, 197, 5, 5, 'Đồng hồ OPK 8105 có thiết kế thời trang, thanh thoát nhưng không kém phần mạnh mẽ. Với mặt đồng hồ tròn và dây đeo bằng thép không gỉ, sản phẩm này có khả năng chống nước, thích hợp cho những cô gái năng động và yêu thích sự tiện dụng. Đây là một lựa chọn tuyệt vời cho những ai tìm kiếm một chiếc đồng hồ đẹp và bền bỉ.'),
(70, 3, 8, 'Đồng hồ nữ OLEVS 9971 chính hãng dây đeo bằng thép không gỉ có chức năng phát sáng chống thấm nước.', 600000, 20, 480000, 194, 5, 4.8, 'OLEVS 9971 là chiếc đồng hồ nữ chính hãng được thiết kế với tính năng phát sáng, giúp bạn dễ dàng theo dõi giờ giấc ngay cả trong bóng tối. Dây đeo thép không gỉ sang trọng và khả năng chống thấm nước khiến sản phẩm này trở thành người bạn đồng hành lý tưởng cho các cô nàng yêu thích sự tiện lợi và thời trang.'),
(71, 3, 9, 'MẮT KÍNH THỜI TRANG NAM NỮ CAO CẤP SAL FULLBOX.Kính Râm Phong Cách Hàn Quốc Chống tia UV.Xuất Xứ Trung Quốc.', 1238000, 43, 705660, 129, 5, 4.8, 'Mắt kính SAL mang phong cách thời trang Hàn Quốc, với thiết kế trẻ trung và hiện đại. Chống tia UV hiệu quả, bảo vệ mắt bạn khỏi tác động của ánh nắng mặt trời. Sản phẩm này có hộp đựng fullbox, rất thích hợp để làm quà tặng hoặc sử dụng hàng ngày. Với xuất xứ từ Trung Quốc, sản phẩm này đảm bảo chất lượng và giá trị sử dụng lâu dài.'),
(72, 3, 9, 'Kính Râm Thời Trang Dáng Tròn TAMBU.Mắt Kính Mát Nam Nữ Hàn Quốc Cao Cấp Siêu Bền Chống Tia UV.', 1478000, 43, 842460, 200, 5, 4.8, 'Kính râm TAMBU với thiết kế dáng tròn đặc biệt, mang đến một phong cách thời trang độc đáo. Sản phẩm phù hợp cho cả nam và nữ, được làm từ chất liệu cao cấp, bền bỉ và chắc chắn. Chống tia UV hiệu quả, giúp bảo vệ mắt khỏi ánh sáng có hại từ mặt trời. Kính phù hợp với nhiều phong cách và là lựa chọn lý tưởng cho các tín đồ thời trang.'),
(73, 3, 9, 'Kính râm thời trang nam nữ ROCOCO new 2033 cao cấp Fullbox.Kính mát thời trang phong cách Hàn Quốc.', 1478000, 0, 1478000, 330, 5, 4.8, 'Kính râm ROCOCO 2033 là sản phẩm mắt kính thời trang cao cấp, được thiết kế theo phong cách Hàn Quốc trẻ trung và năng động. Với khả năng chống UV hiệu quả, sản phẩm không chỉ bảo vệ mắt mà còn làm nổi bật phong cách cá nhân. Fullbox đi kèm, rất thích hợp làm quà tặng hoặc sử dụng trong những chuyến đi chơi xa.'),
(74, 3, 9, 'Kính râm nam nữ N78 new 2023 cao cấp chống UV.Kính mát phong cách Hàn Quốc Fullbox bảo hành 1 năm.', 1358000, 39, 828380, 107, 5, 4.8, 'Kính râm N78 được thiết kế hiện đại, sang trọng, với chất liệu cao cấp và tính năng chống tia UV tuyệt vời. Phù hợp cho cả nam và nữ, kính mát này giúp bảo vệ mắt một cách hiệu quả dưới ánh sáng mặt trời gay gắt. Sản phẩm đi kèm fullbox và bảo hành 1 năm, mang lại sự an tâm cho người sử dụng.'),
(75, 3, 9, 'Kính râm thời trang nam nữ MUSEE 01 cao cấp chống UV.Kính mát phong cách Hàn Quốc bảo hành 1 năm.', 1398000, 38, 866760, 202, 5, 4.8, 'Kính râm MUSEE 01 mang đến vẻ đẹp thanh lịch và thời trang, được thiết kế với phong cách Hàn Quốc nổi bật. Với khả năng chống UV tuyệt vời, sản phẩm này không chỉ bảo vệ mắt mà còn tôn lên phong cách của bạn. Fullbox đi kèm, cùng với chế độ bảo hành 1 năm, giúp bạn hoàn toàn yên tâm về chất lượng và độ bền của sản phẩm.'),
(76, 3, 9, 'Kính Mát Nam Nữ Basic Màu đen dáng vuông Chống Bụi Bảo Vệ Mắt Chống tia UV400.', 250000, 0, 250000, 92, 5, 4.8, 'Kính mát Basic màu đen với dáng vuông là sự lựa chọn hoàn hảo cho những ai yêu thích phong cách đơn giản nhưng vẫn đầy thời trang. Với thiết kế hiện đại và chất liệu cao cấp, chiếc kính này không chỉ giúp bảo vệ mắt khỏi tia UV400 mà còn chống bụi, mang lại sự an tâm khi sử dụng. Phù hợp với cả nam và nữ, sản phẩm này dễ dàng phối hợp với nhiều loại trang phục khác nhau.'),
(77, 3, 9, 'Kính mát nữ ChiGlasses HÌNH CHỮ H thiết kế cao cấp sang trọng sành điệu đeo khi đi chơi đi du lich đi biển.', 180000, 20, 144000, 307, 5, 4.8, 'Kính mát nữ ChiGlasses với hình chữ H độc đáo mang đến vẻ ngoài sang trọng và sành điệu. Sản phẩm được thiết kế cao cấp, với kiểu dáng thời thượng, thích hợp để đeo khi đi chơi, du lịch hoặc đi biển. Với khả năng chống UV và bảo vệ mắt, đây là phụ kiện lý tưởng cho những chuyến đi đầy phong cách.'),
(78, 3, 9, 'Kính râm thời trang nam nữ ChiGlasses RẤT TIỆN LỢI chống tia UV chống bụi chống chói chống nước đeo đi biển đi xe.', 170000, 38, 105400, 289, 5, 4.8, 'Kính râm ChiGlasses là sự kết hợp hoàn hảo giữa tính thời trang và tiện lợi. Được trang bị tính năng chống tia UV, chống bụi, chống chói và chống nước, chiếc kính này rất phù hợp để đeo khi đi biển, đi xe hoặc tham gia các hoạt động ngoài trời. Thiết kế đơn giản nhưng tinh tế, phù hợp với cả nam và nữ.'),
(79, 3, 9, 'Kính Mát Nữ Thời Trang Vuông To Gọng Kim Loại Chống Tia Uv400 Nhiều Màu.', 180000, 0, 180000, 413, 5, 5, 'Kính mát nữ thời trang vuông to với gọng kim loại tinh tế là lựa chọn tuyệt vời cho các cô gái yêu thích phong cách nổi bật. Chất liệu gọng kim loại bền bỉ kết hợp với khả năng chống tia UV400 giúp bảo vệ mắt tối đa. Sản phẩm có nhiều màu sắc để bạn lựa chọn, dễ dàng kết hợp với nhiều bộ trang phục khác nhau.'),
(80, 3, 9, 'Kính mắt Nam Nữ LATIO PREMIUM, gọng kính TITAN CAO CẤP siêu bền bỉ và nhẹ, hoạ tiết tinh tế cuốn hút.', 599000, 0, 599000, 218, 5, 4.8, 'Kính mắt LATIO PREMIUM được làm từ gọng titan cao cấp, siêu bền và nhẹ, mang đến sự thoải mái khi sử dụng. Thiết kế tinh tế với hoạ tiết cuốn hút, sản phẩm này không chỉ mang đến khả năng bảo vệ mắt mà còn tôn lên phong cách thời trang của người đeo. Phù hợp cho cả nam và nữ, kính LATIO là lựa chọn tuyệt vời cho những ai yêu thích sự sang trọng và bền bỉ.'),
(81, 3, 10, 'Mũ vành dạ nơ nhỏ cao cấp mới cho nữ.', 500000, 10, 450000, 221, 5, 4.8, 'Mũ vành dạ nơ nhỏ là phụ kiện hoàn hảo cho các cô gái yêu thích sự nhẹ nhàng và thanh thoát. Với chất liệu dạ cao cấp, mũ có thiết kế đơn giản nhưng sang trọng, kết hợp với chi tiết nơ nhỏ làm điểm nhấn. Mũ này sẽ giúp bạn trở nên nổi bật và cuốn hút, rất phù hợp để diện trong những dịp đi chơi hoặc tham gia các sự kiện ngoài trời.'),
(82, 3, 10, 'Mũ nồi da MARY mũ beret thùy thủ nón nồi họa tiết thời trang đi biển phong cách hàn quốc.', 350000, 37, 220500, 215, 5, 4.8, 'Mũ nồi da MARY là món phụ kiện không thể thiếu cho những cô gái yêu thích phong cách Hàn Quốc. Với thiết kế beret thùy thủ tinh tế, mũ này giúp bạn dễ dàng tạo dựng vẻ ngoài nữ tính và thời thượng. Chất liệu da mềm mại và họa tiết thời trang sẽ làm tôn lên phong cách độc đáo của bạn, đặc biệt phù hợp khi đi biển hay tham gia các buổi dã ngoại.'),
(83, 3, 10, 'Mũ Lưỡi Trai JEEP, Nón Kết Nam Nữ Cao Cấp M194.', 450000, 0, 450000, 308, 5, 5, 'Mũ lưỡi trai JEEP M194 là lựa chọn tuyệt vời cho những ai yêu thích sự năng động và khỏe khoắn. Với thiết kế đơn giản, dễ phối đồ và chất liệu cao cấp, mũ kết hợp giữa tính thời trang và tính năng bảo vệ hiệu quả. Sản phẩm này phù hợp cho cả nam và nữ, thích hợp khi tham gia các hoạt động thể thao hoặc đi du lịch.'),
(84, 3, 10, 'Mũ Phớt Cói Panama Nam Nữ Vành Rộng 7CM MP046.', 850000, 29, 603500, 310, 5, 4.8, 'Mũ phớt cói Panama MP046 với vành rộng 7cm là lựa chọn hoàn hảo cho những chuyến đi biển hoặc những ngày hè oi ả. Mũ không chỉ bảo vệ bạn khỏi nắng nóng mà còn giúp bạn trở nên thanh thoát và thời trang. Với chất liệu cói tự nhiên, sản phẩm này mang lại sự thoải mái và dễ chịu khi đeo, rất thích hợp cho cả nam và nữ.'),
(85, 3, 10, 'Mũ Nón lưỡi trai MLB chất liệu vải Kaki Navy Cream Logo NY , nón lưỡi trai Thời trang, Thể thao.', 250000, 0, 250000, 207, 5, 4.8, 'Mũ nón lưỡi trai MLB làm từ chất liệu vải kaki chất lượng cao, thiết kế với logo NY đặc trưng. Mũ mang đến vẻ ngoài trẻ trung, năng động và rất dễ phối đồ. Với khả năng chống nắng tốt, mũ này rất phù hợp cho những ai yêu thích thể thao hoặc phong cách thời trang đường phố.'),
(86, 3, 10, 'Mũ Beret Nhật Bản Ngọt Ngào Dễ Phối Đồ Có Khóa Kim Loại Phong Cách Retro Xuân Thu Cho Nữ.', 85000, 8, 78200, 286, 5, 5, 'Mũ beret Nhật Bản là sự kết hợp hoàn hảo giữa phong cách retro và hiện đại. Với thiết kế ngọt ngào và dễ phối đồ, mũ có khóa kim loại tiện lợi, tạo nên sự khác biệt trong từng chi tiết. Phù hợp cho mùa xuân thu, chiếc mũ này sẽ giúp bạn trở nên thanh lịch và cuốn hút hơn trong những dịp đặc biệt.'),
(87, 3, 10, 'Mũ Nồi beret Cao Cấp Đính Kim Cương Chữ d Thời Trang Thu Đông Hàn Quốc Mới Cho Nữ.', 103000, 0, 103000, 316, 5, 4.8, 'Mũ nồi beret cao cấp đính kim cương chữ D là phụ kiện thời trang sang trọng dành cho các cô gái yêu thích sự nổi bật. Với thiết kế tinh tế, mũ không chỉ giữ ấm trong mùa thu đông mà còn giúp bạn tạo điểm nhấn ấn tượng trong phong cách thời trang. Được đính kim cương giả, mũ này giúp bạn tỏa sáng mà không cần quá cầu kỳ.'),
(88, 3, 10, 'Mũ Bucket Nam Nữ, Nón Vành Tròn Tai Bèo DENIM Vải Cotton Cao Cấp.', 238000, 19, 192780, 505, 5, 4.8, 'Mũ Bucket DENIM với vành tròn và tai bèo là lựa chọn tuyệt vời cho những ai yêu thích sự trẻ trung và năng động. Chất liệu vải denim và cotton cao cấp giúp mũ vừa bền bỉ lại thoải mái khi sử dụng. Phù hợp cho cả nam và nữ, chiếc mũ này sẽ là phụ kiện không thể thiếu cho những ngày hè hay các chuyến đi biển.'),
(89, 3, 10, 'Mũ Beret Nữ, Mũ Beret Lưỡi Vịt Màu Trắng Đen nâu Phong Cách Retro Nhật Bản.', 62000, 0, 62000, 310, 5, 5, 'Mũ beret nữ lưỡi vịt mang đến phong cách retro Nhật Bản đặc trưng. Với màu sắc thanh lịch và thiết kế gọn gàng, mũ này dễ dàng phối hợp với nhiều bộ trang phục khác nhau. Sản phẩm này không chỉ bảo vệ bạn khỏi nắng mà còn giúp tôn lên vẻ đẹp nữ tính, phù hợp với nhiều dịp khác nhau.'),
(90, 3, 10, 'Mũ bucket vành cụp, nón tai bèo, mũ vải nhung dày dặn thời trang cao cấp RESCUE Uzzlang có dây rút.', 129000, 12, 113520, 314, 5, 4.8, 'Mũ bucket vành cụp với nón tai bèo được làm từ chất liệu vải nhung cao cấp, mang đến sự ấm áp và phong cách độc đáo. Mũ có dây rút điều chỉnh, giúp bạn dễ dàng thay đổi kích thước sao cho vừa vặn nhất. Thiết kế thời trang, phù hợp với nhiều hoàn cảnh, từ đi dạo phố đến tham gia các buổi tiệc ngoài trời.'),
(91, 4, 12, 'Giày Da Nam Cao Cấp Đốc Tờ ZANISTO CS073 Chất Da Cao Cấp Bền Bỉ Đế Cao Su Non Tăng Chiều Cao 3,5cm.', 900000, 0, 900000, 1314, 5, 4.8, 'Giày da nam cao cấp ZANISTO CS073 mang đến sự kết hợp hoàn hảo giữa chất lượng và thiết kế thời trang. Chất da cao cấp bền bỉ và đế cao su non tăng chiều cao 3,5cm, giúp bạn tự tin và nổi bật. Với thiết kế đơn giản nhưng sang trọng, giày này thích hợp cho cả những buổi đi làm và các dịp gặp gỡ bạn bè, đối tác. Sản phẩm là lựa chọn tuyệt vời cho những ai yêu thích sự tinh tế và thoải mái.'),
(92, 4, 12, 'Giày thể thao thời trang nam cao cấp với thiết kế sành điệu, thanh lịch và cá tính.', 2380000, 33, 1594600, 1360, 5, 4.8, 'Giày thể thao nam cao cấp mang đến vẻ ngoài năng động và trẻ trung, kết hợp giữa sự sành điệu và thanh lịch. Với thiết kế cá tính, giày không chỉ mang đến sự thoải mái cho đôi chân mà còn giúp bạn dễ dàng phối hợp với nhiều bộ trang phục khác nhau, từ áo thun thể thao đến quần jeans hay quần short.'),
(93, 4, 12, 'Giày Derby JOG04 - kiểu dáng Modern Derby , tăng chiều cao cho nam ( D2 ).', 650000, 23, 500500, 684, 5, 5, 'Giày Derby JOG04 mang phong cách hiện đại, kết hợp với thiết kế cổ điển mang đến sự lịch lãm cho phái mạnh. Đặc biệt, giày có khả năng tăng chiều cao, giúp bạn tự tin hơn trong mọi tình huống. Dễ dàng phối đồ với nhiều phong cách khác nhau, giày này là lựa chọn lý tưởng cho những ai yêu thích sự sang trọng và tiện ích.'),
(94, 4, 12, 'Giày tây HT.NEO da bò 100% giày lười, đế kếp bền bỉ, sang trọng, đường may tinh tế,tỉ mỉ GT89.', 650000, 19, 526500, 1445, 5, 4.8, 'Giày tây HT.NEO với chất liệu da bò 100% mang lại sự bền bỉ và sang trọng. Giày lười thiết kế thanh lịch, dễ dàng mang vào và tháo ra mà không cần dây. Đế kếp chắc chắn và đường may tinh tế, sản phẩm này hoàn hảo cho các buổi họp mặt, đi làm hay các dịp quan trọng, giúp bạn luôn thể hiện phong cách lịch lãm và tinh tế.'),
(95, 4, 12, 'Giầy bóng rổ đường phố trắng xanh Nike Jordan 1 Hyper Royal.', 12000000, 16, 10080000, 751, 5, 4.8, 'Giày bóng rổ Nike Jordan 1 Hyper Royal với thiết kế đường phố độc đáo, kết hợp giữa màu trắng và xanh đầy bắt mắt, là sự lựa chọn lý tưởng cho những tín đồ của thể thao và thời trang. Được trang bị đế cao su chắc chắn và đệm khí êm ái, giày này không chỉ mang đến hiệu suất tốt trên sân bóng mà còn dễ dàng kết hợp với các trang phục thể thao năng động.'),
(96, 4, 12, 'Giày_jordan 1 low paris màu xám full box.', 2300000, 12, 2024000, 722, 5, 5, 'Giày Jordan 1 Low Paris màu xám mang đến sự kết hợp hoàn hảo giữa phong cách thể thao và thời trang đường phố. Thiết kế đơn giản nhưng tinh tế, với chất liệu da cao cấp và đường may sắc nét. Sản phẩm này đi kèm với full box, là lựa chọn tuyệt vời cho những ai yêu thích sự phong cách và muốn nâng cấp bộ sưu tập giày của mình.'),
(97, 4, 12, 'Giày Tây Công Sở Nam Cao Cấp - Da bò nhập khẩu mềm mại [SB03].', 1500000, 12, 1320000, 1504, 5, 4.8, 'Giày tây công sở nam cao cấp với chất liệu da bò nhập khẩu mềm mại mang đến sự thoải mái tuyệt đối khi di chuyển trong môi trường làm việc. Thiết kế sang trọng và tinh tế, kết hợp cùng đường may sắc sảo, giày này giúp bạn tạo dựng phong cách chuyên nghiệp, lịch lãm và tự tin. Sản phẩm phù hợp với các dịp công sở, họp mặt đối tác hay tiệc tùng.'),
(98, 4, 12, 'Giày Sneaker Nam FST 1985 Chất Vải Canvas K22 Kiểu Dáng Hàn Quốc Dễ Phối Đồ, Thoáng, Nhẹ.', 450000, 0, 450000, 1492, 5, 5, 'Giày Sneaker nam FST 1985 được làm từ chất vải canvas cao cấp, mang đến cảm giác thoáng mát và nhẹ nhàng. Với kiểu dáng Hàn Quốc hiện đại, giày dễ dàng phối hợp với nhiều trang phục khác nhau, từ quần jeans đến quần short. Đây là lựa chọn lý tưởng cho những ngày hè năng động, mang lại sự thoải mái trong từng bước đi.'),
(99, 4, 12, 'Giày _AF1 trắng cao cổ bản cao cấp đủ size nam nữ full bill box 36_44 FAKE Đền X3.', 1550000, 25, 1162500, 745, 5, 4.8, 'Giày AF1 trắng cao cổ với thiết kế đặc trưng và chất lượng cao cấp, là biểu tượng của sự năng động và thời trang. Với đầy đủ size từ 36 đến 44 cho cả nam và nữ, giày này mang lại sự thoải mái tuyệt đối trong suốt cả ngày dài. Sản phẩm đi kèm full bill box, cam kết đền gấp 3 nếu phát hiện hàng giả.'),
(100, 4, 12, 'Giày Dio B27 Low Đen Trắng Black White Da Thật Lai Au Dành Cho Nam [ Fullbox Cao Cấp ].', 1550000, 26, 1147000, 745, 5, 4.8, 'Giày Dio B27 Low với màu đen trắng nổi bật là sự kết hợp giữa phong cách thể thao và thời trang cao cấp. Được làm từ chất liệu da thật lai Âu, giày mang đến sự bền bỉ và thoải mái khi di chuyển. Thiết kế low-top phù hợp với nhiều trang phục, từ thể thao đến street style. Sản phẩm đi kèm fullbox, là lựa chọn lý tưởng cho những ai yêu thích sự sang trọng và phong cách.'),
(101, 5, 15, 'Giày guốc cao Prada đủ sz hàng xịn logo hãng cao cấp.', 1030000, 15, 875500, 1134, 5, 4.8, 'Giày guốc cao Prada được chế tác từ chất liệu cao cấp với thiết kế tinh tế và sang trọng, phù hợp cho những buổi tiệc hay sự kiện quan trọng. Với logo Prada nổi bật, giày không chỉ thể hiện đẳng cấp mà còn mang đến sự thoải mái cho người sử dụng. Giày guốc này có sẵn nhiều size, dễ dàng lựa chọn cho mọi đôi chân, giúp bạn tự tin hơn trong mọi hoàn cảnh.'),
(102, 5, 15, 'Guốc nữ cao gót cao cấp PALMPAJ.', 1150000, 0, 1150000, 607, 5, 5, 'Guốc nữ cao gót PALMPAJ sở hữu thiết kế thanh thoát và duyên dáng, với chất liệu cao cấp mang lại cảm giác thoải mái cho người dùng. Đế guốc chắc chắn, gót cao giúp tôn dáng, làm nổi bật phong cách của người sử dụng. Sản phẩm này phù hợp với những buổi tiệc, sự kiện hay các dịp đi chơi, mang lại vẻ đẹp nữ tính và sang trọng.'),
(103, 5, 15, 'ORD GUỐC MŨI NHỌN ĐÍNH NƠ CAO CẤP 10CM.', 735000, 19, 595350, 1164, 5, 4.8, 'Guốc mũi nhọn ORD với thiết kế đính nơ tinh tế, gót cao 10cm giúp bạn tăng thêm chiều cao và tôn dáng. Được làm từ chất liệu cao cấp, giày mang lại sự sang trọng và thanh lịch cho người sử dụng. Với thiết kế mũi nhọn và đế chắc chắn, giày này dễ dàng kết hợp với nhiều bộ trang phục, từ váy đi tiệc đến bộ đồ công sở.'),
(104, 5, 14, 'Màu Đỏ mùa thu Giày cao gót mới Giày cưới gót dày không mỏi Giày cưới cao cấp cảm giác Xiuhe Giày cưới một lớp.', 866150, 26, 640951, 579, 5, 4.8, 'Giày cao gót cưới màu đỏ mùa thu với thiết kế gót dày không mỏi, mang lại sự thoải mái cho đôi chân trong suốt cả ngày dài. Chất liệu cao cấp và thiết kế đẹp mắt phù hợp với các cô dâu muốn có đôi giày cưới vừa thời trang lại tiện dụng. Được làm từ chất liệu mềm mại, giày tạo cảm giác dễ chịu, giúp bạn tự tin trong ngày trọng đại của mình.'),
(105, 5, 14, 'Giày cao gót Beijiani da cừu Rhinestone ngọc trai Xiuhe cao cấp váy cưới phù dâu Giày cưới cô dâu Giày nữ mùa thu.', 887937, 29, 630435, 578, 5, 4.8, 'Giày cao gót Beijiani được làm từ da cừu mềm mại và trang trí bằng rhinestone và ngọc trai sang trọng. Đây là sự lựa chọn lý tưởng cho cô dâu hoặc phù dâu trong các đám cưới, giúp tôn lên vẻ đẹp và sự duyên dáng. Thiết kế tỉ mỉ và chất liệu cao cấp mang lại sự thoải mái và phong cách thời thượng, khiến bạn nổi bật trong ngày trọng đại.'),
(106, 5, 14, 'Giày Cotton Dày Lông Cừu Thấp Mùa Đông 2024 Phong Cách Mới Bé Gái Giày Thể Thao Ấm Áp Giày Thể Thao KT2812.', 401578, 25, 301184, 1784, 5, 4.8, 'Giày thể thao cotton dày lông cừu cho bé gái mang đến sự ấm áp và thoải mái trong mùa đông. Với thiết kế trẻ trung và năng động, giày rất dễ phối đồ và giúp bé thoải mái vận động. Lớp lông cừu bên trong giữ ấm chân cho bé trong suốt cả ngày, phù hợp cho các hoạt động ngoài trời hay đi chơi trong mùa lạnh.'),
(107, 5, 14, 'Giày nữ Yong Ge Giày sành điệu thể thao mặt da ZS83 Giày trượt ván thường ngày giày trắng Giày sành điệu học sinh Dễ phối nữ.', 433553, 20, 346842, 1171, 5, 4.8, 'Giày nữ Yong Ge với thiết kế thể thao sành điệu, mặt da mềm mại và kiểu dáng thời trang, phù hợp cho những ai yêu thích phong cách thể thao năng động. Giày có thể dễ dàng kết hợp với nhiều trang phục từ quần jeans, áo thun cho đến bộ đồ thể thao. Chất liệu da cao cấp cùng đế cao su chắc chắn mang lại sự thoải mái và bền bỉ khi sử dụng hàng ngày.'),
(108, 5, 14, 'Giày Nữ Giày Ayuan Giày đi tuyết Zhongbang lót nhung mùa đông đi Bộ hai kiểu cotton mùa đông.', 580766, 0, 580766, 624, 5, 5, 'Giày Ayuan với thiết kế đặc biệt dành cho mùa đông, có lớp lót nhung ấm áp giúp giữ ấm chân trong những ngày lạnh giá. Giày đi tuyết này có kiểu dáng đơn giản nhưng vô cùng thoải mái và dễ phối đồ. Đế giày chắc chắn, chống trượt tốt, phù hợp cho việc đi bộ ngoài trời trong mùa đông.'),
(109, 5, 14, 'Giày nữ Mary Jane quai ngang đính đá cao cấp, hàng siêu nhẹ đế cao 5-7cm.', 705000, 10, 634500, 597, 5, 5, 'Giày Mary Jane nữ với quai ngang đính đá sang trọng, thiết kế tinh tế giúp bạn tạo điểm nhấn nổi bật cho bộ trang phục. Đế giày cao 5-7cm, vừa đủ để tôn dáng mà vẫn tạo sự thoải mái khi di chuyển. Chất liệu cao cấp và kiểu dáng nữ tính, sản phẩm này rất phù hợp cho các buổi tiệc hoặc sự kiện trang trọng.'),
(110, 5, 14, 'GIÀY CAO GÓT NỮ MŨI NHỌN - GIÀY CAO GÓT NỮ GÓT TRỤ CAO 9 PHÂN SẴN MÀU TRẮNG.', 389000, 19, 315090, 607, 5, 4.8, 'Giày cao gót nữ mũi nhọn với gót trụ cao 9 phân mang lại sự kết hợp giữa vẻ đẹp hiện đại và cổ điển. Màu trắng tinh khôi của giày dễ dàng kết hợp với nhiều loại trang phục, từ váy liền, áo sơ mi cho đến các bộ đồ công sở. Đế giày vững chắc giúp bạn di chuyển thoải mái mà không lo bị đau chân, là lựa chọn lý tưởng cho những dịp quan trọng.'),
(111, 6, 17, 'Đệm Dunlopillo Evita nệm lò xo cao cấp êm ái tạo giấc ngủ ngon.', 36321000, 16, 30509640, 300, 5, 5, 'Đệm lò xo Dunlopillo Evita mang đến sự kết hợp hoàn hảo giữa công nghệ hiện đại và thiết kế sang trọng. Với hệ thống lò xo cao cấp cùng lớp bọc êm ái, đệm giúp nâng đỡ cơ thể và mang lại giấc ngủ sâu, dễ chịu. Sản phẩm là lựa chọn lý tưởng để cải thiện chất lượng giấc ngủ và sức khỏe của bạn.'),
(112, 6, 17, 'Đệm Lò Xo Túi President DADA Dòng Cao Cấp Dùng Cho Phòng Tổng Thống - Very Firm Nâng Đỡ Massage 7 Điểm Chạm Cơ Thể.', 23910000, 0, 23910000, 333, 5, 5, 'Đệm lò xo túi President DADA được thiết kế dành riêng cho không gian sang trọng như phòng tổng thống. Với độ cứng lý tưởng (Very Firm) và công nghệ massage 7 điểm chạm, đệm đảm bảo sự hỗ trợ tối đa cho cơ thể, giảm áp lực và giúp thư giãn cơ bắp. Chất liệu cao cấp và kiểu dáng hiện đại làm nổi bật đẳng cấp của sản phẩm.'),
(113, 6, 17, 'Đệm Foam Luna Gel mát lạnh thương hiệu SU:M cao cấp, tiêu chuẩn xuất Đức - ép cuộn, êm ái, nâng đỡ cơ thể tối ưu Foam112.', 16550000, 45, 9102500, 380, 5, 5, 'Đệm Foam Luna Gel SU:M với lớp gel mát lạnh mang lại cảm giác thoải mái, dễ chịu ngay cả trong thời tiết nóng. Sản phẩm đạt tiêu chuẩn chất lượng Đức, thiết kế ép cuộn tiện lợi cho việc vận chuyển và lắp đặt. Đệm nâng đỡ cơ thể tối ưu, hỗ trợ cột sống, phù hợp với mọi lứa tuổi.'),
(114, 6, 16, 'CHĂN LÔNG CHỒN, CHĂN HỒ LY CAO CẤP 6KG, CHĂN CAO CẤP,chất lượng hàng đầu siêu mướt mềm mịn ấm áp.', 1990000, 0, 1990000, 964, 5, 4.8, 'Chăn lông chồn cao cấp với trọng lượng 6kg mang đến độ mềm mại, mịn màng và cảm giác ấm áp vượt trội. Sản phẩm được chế tác từ chất liệu chất lượng hàng đầu, giữ nhiệt tốt và thích hợp cho những ngày đông lạnh giá. Với thiết kế sang trọng, chăn không chỉ giúp bạn giữ ấm mà còn làm đẹp không gian phòng ngủ.'),
(115, 6, 16, 'Bộ chăn ga phi lụa ROMANTIC 1 tone màu sang trọng, bắt mắt, chăn chần bông microgel mềm mượt êm ái, thoáng khí.', 1050000, 52, 504000, 907, 5, 4.8, 'Bộ chăn ga ROMANTIC làm từ chất liệu phi lụa cao cấp với thiết kế 1 tone màu thanh lịch và sang trọng. Lớp chần bông microgel mang đến sự mềm mại, êm ái và thoáng khí, giúp giấc ngủ thêm phần dễ chịu. Bộ sản phẩm phù hợp với nhiều phong cách nội thất và làm tăng sự tinh tế cho không gian phòng ngủ.'),
(116, 6, 18, 'Sofa giường thông minh có ngăn chứa đồ , Ghế sofa giường đa năng hàng nhập khẩu cao cấp.', 5000000, 26, 3700000, 683, 5, 4.8, 'Sofa giường thông minh là giải pháp tối ưu cho không gian sống hiện đại. Sản phẩm kết hợp giữa ghế sofa tiện nghi và giường ngủ thoải mái, tích hợp thêm ngăn chứa đồ giúp tiết kiệm diện tích. Với chất liệu nhập khẩu cao cấp và thiết kế tinh tế, sofa giường phù hợp với cả không gian nhỏ gọn lẫn căn hộ cao cấp.'),
(117, 6, 19, 'Tủ Quần Áo Gỗ Nguyên Khối Tủ Quần Áo Treo Đơn Giản Hiện Đại Phòng Ngủ Gia Đình Bằng Gỗ Sáp Mới Kiểu Trung Quốc.', 90551168, 39, 55236212, 3189, 5, 4.8, 'Tủ quần áo gỗ nguyên khối với kiểu dáng đơn giản và hiện đại, mang phong cách Trung Quốc truyền thống. Được làm từ gỗ sáp tự nhiên, tủ có độ bền cao, chống mối mọt và thân thiện với môi trường. Sản phẩm không chỉ là vật dụng lưu trữ quần áo mà còn là điểm nhấn sang trọng cho phòng ngủ.'),
(118, 6, 19, 'TỦ QUẦN ÁO GỖ MDF ĐA NĂNG, THIẾT KẾ HIỆN ĐẠI, TỦ LÙA KẾT HỢP CÁNH MỞ VÀ NHIỀU NGĂN KÉO.', 8200000, 20, 6560000, 225, 5, 5, 'Tủ quần áo gỗ MDF đa năng được thiết kế theo phong cách hiện đại, kết hợp cửa lùa và cánh mở linh hoạt. Nhiều ngăn kéo và ngăn chứa giúp tối ưu không gian lưu trữ, đồng thời giữ cho phòng ngủ luôn gọn gàng. Chất liệu MDF bền đẹp, dễ dàng vệ sinh và thích hợp với mọi không gian nội thất.'),
(119, 6, 19, 'Tủ Quần Áo Kết Hợp Cửa Lùa Hiện Đại SIB Decor Màu Trắng Phối Vân Gỗ Sồi TA07.', 6000000, 0, 6000000, 223, 5, 4.8, 'Tủ quần áo SIB Decor với thiết kế cửa lùa hiện đại, màu trắng kết hợp vân gỗ sồi tạo nên vẻ đẹp thanh lịch và tối giản. Sản phẩm có không gian lưu trữ rộng rãi, phù hợp với các gia đình yêu thích phong cách nội thất nhẹ nhàng, tinh tế. Chất liệu gỗ MDF cao cấp đảm bảo độ bền và tuổi thọ lâu dài.');
INSERT INTO `products` (`product_id`, `category_id`, `subcategory_id`, `product_name`, `price`, `sale`, `sale_price`, `sold_quantity_sum`, `rating_count`, `average_rating`, `description`) VALUES
(120, 6, 19, 'Tủ quần áo cách diệu MInis ,đơn giản sang trọng sản phẩm đã lắp đặt hoàn chỉnh , bảo hành 12 tháng.', 5299999, 0, 5299999, 217, 5, 4.8, 'Tủ quần áo Minis được thiết kế cách điệu, đơn giản nhưng không kém phần sang trọng. Sản phẩm đã được lắp đặt hoàn chỉnh, sẵn sàng sử dụng và đi kèm chế độ bảo hành 12 tháng. Với kiểu dáng thanh lịch và chất liệu bền bỉ, tủ phù hợp cho cả không gian hiện đại và cổ điển.'),
(121, 7, 23, 'Xe ô tô điện trẻ em ROLL-ROYCE SPORT 4 bánh 2 động cơ có điều khiển và tự lái xe an toàn cho bé tải trọng 60kg.', 3299000, 41, 1946410, 221, 5, 4.8, 'Xe ô tô điện trẻ em ROLL-ROYCE SPORT mang lại trải nghiệm lái xe đẳng cấp cho bé. Thiết kế sang trọng, lấy cảm hứng từ dòng xe ROLL-ROYCE, kết hợp 4 bánh xe lớn và 2 động cơ mạnh mẽ. Xe được trang bị chế độ tự lái và điều khiển từ xa, đảm bảo an toàn tối đa. Tải trọng lên đến 60kg, phù hợp với nhiều lứa tuổi, giúp bé vừa chơi vừa rèn luyện kỹ năng vận động.'),
(122, 7, 23, 'Xe ô tô điện trẻ em Lamborghini 2025 có điều khiển từ xa và tự lái tải trọng 55kg, xe đồ chơi cao cấp cho bé yêu bibocar.', 2399000, 0, 2399000, 219, 5, 4.8, 'Chiếc xe ô tô điện Lamborghini 2025 là phiên bản mô phỏng dòng siêu xe huyền thoại, thiết kế hiện đại và đầy cá tính. Xe hỗ trợ cả chế độ tự lái và điều khiển từ xa, giúp bố mẹ dễ dàng hỗ trợ bé. Tải trọng 55kg, khung xe chắc chắn và hệ thống đèn LED nổi bật, đây là món quà lý tưởng cho bé yêu thích tốc độ.'),
(123, 7, 23, 'Xe ô tô điện trẻ em Mec G63 AMG 4 bánh 2 động cơ có điều khiển từ xa an toàn cho bé tải trọng 60kg xe ô tô điện Bibocar.', 2999000, 0, 2999000, 230, 5, 5, 'Lấy cảm hứng từ dòng SUV nổi tiếng Mec G63 AMG, chiếc ô tô điện trẻ em này mang đến vẻ ngoài mạnh mẽ và sang trọng. Xe trang bị 4 bánh xe lớn và 2 động cơ bền bỉ, kết hợp chế độ tự lái và điều khiển từ xa để bé vui chơi an toàn. Tải trọng 60kg cùng nhiều tính năng như âm thanh và đèn LED làm tăng tính hấp dẫn.'),
(124, 7, 21, 'Đồ chơi lắp ghép khối xây dựng building block Loz mô hình The Tree House- Ngôi nhà trên cây.', 1899000, 23, 1462230, 112, 5, 4.8, 'Bộ lắp ghép Loz \"The Tree House\" mang đến trải nghiệm sáng tạo đầy thú vị. Với hàng trăm mảnh ghép tinh xảo, bé có thể tạo nên một ngôi nhà trên cây sống động với từng chi tiết nhỏ. Sản phẩm không chỉ giúp rèn luyện tư duy mà còn mang lại niềm vui khi hoàn thành tác phẩm độc đáo.'),
(125, 7, 22, 'Người máy biến hình Transformer Nemesis Grimlock IF EX-50K Samurai Series Kagemusha Boohmaru.', 1250000, 0, 1250000, 118, 5, 4.8, 'Mô hình Transformer Nemesis Grimlock thuộc dòng Samurai Series, sở hữu thiết kế tinh xảo và chi tiết. Người máy có khả năng biến hình linh hoạt, kết hợp phong cách cổ điển và hiện đại. Đây là sản phẩm lý tưởng cho các fan của Transformer, đồng thời là món đồ chơi sáng tạo và hấp dẫn.'),
(126, 7, 22, 'METAL ROBOT Spirits Destiny Gundam 140mm ABS&PVC&DIE-CAST Finished Figure.', 6574251, 11, 5851083, 106, 5, 4.8, 'Mô hình METAL ROBOT Spirits Destiny Gundam là sản phẩm cao cấp dành cho người yêu thích Gundam. Được chế tác từ chất liệu ABS, PVC và die-cast, mô hình có độ bền cao, chi tiết tinh tế. Kích thước 140mm nhỏ gọn nhưng đầy uy lực, sản phẩm mang lại sự hài lòng cho cả trẻ em và người lớn.\n\n'),
(127, 7, 22, 'Mô Hình Ráp Sẵn Metal Build 1/72 Animester Mecha Wolf Warrior.', 3800000, 0, 3800000, 98, 5, 4.8, 'Mô hình Mecha Wolf Warrior thuộc dòng Metal Build với tỷ lệ 1/72, thể hiện một chiến binh sói mạnh mẽ và đầy nghệ thuật. Các chi tiết ráp sẵn sắc nét, chất liệu cao cấp và thiết kế đẹp mắt làm cho sản phẩm trở thành một bộ sưu tập đáng giá.'),
(128, 7, 22, 'Mô Hình Lắp Ráp MG HiRM MNP-XH02 Cao Ren CaoRen.', 980000, 5, 931000, 110, 5, 5, 'Mô hình lắp ráp MG HiRM Cao Ren mang phong cách chiến binh cổ điển pha lẫn hiện đại. Sản phẩm có độ chi tiết cao, các khớp nối linh hoạt cho phép tạo dáng đa dạng. Đây là bộ lắp ráp lý tưởng cho các fan yêu thích sáng tạo và nghệ thuật chế tác mô hình.'),
(129, 7, 20, 'Đồ chơi Cá sấu cắn tay cho bé - đồ chơi giải trí vui nhộn cá mập cắn tay.', 74000, 32, 50320, 116, 5, 5, 'Trò chơi cá sấu cắn tay là sản phẩm giải trí đơn giản nhưng không kém phần thú vị. Bé chỉ cần nhấn lần lượt các chiếc răng của cá sấu, chờ đợi \"hàm cắn\" bất ngờ xảy ra. Đồ chơi giúp bé rèn luyện phản xạ nhanh và mang lại những giây phút vui cười sảng khoái.'),
(130, 7, 20, 'Đồ Chơi yoyo v3 Tốc Độ Cao Bằng Hợp Kim Nhôm Cho Bé.', 495903, 19, 401681, 120, 5, 4.8, 'Yoyo V3 làm từ hợp kim nhôm cao cấp, đảm bảo độ bền và hiệu suất tốt nhất. Với thiết kế chuyên nghiệp, sản phẩm mang lại tốc độ quay cao và dễ dàng thực hiện các kỹ thuật yoyo phức tạp. Đây là món đồ chơi giúp bé rèn luyện sự khéo léo và tập trung.'),
(131, 8, 24, 'Balo đựng laptop MARK RYDEN 15.6 Inch cho nam.', 857000, 18, 702740, 109, 5, 4.8, 'Balo MARK RYDEN cho nam là sự kết hợp hoàn hảo giữa tính năng và phong cách. Với khả năng chứa laptop lên đến 15.6 inch, chiếc balo này thiết kế với chất liệu vải chống thấm nước cao cấp, đảm bảo an toàn cho thiết bị của bạn trong mọi điều kiện thời tiết. Ngoài ra, balo còn có các ngăn phụ trợ thông minh giúp bạn dễ dàng lưu trữ điện thoại, ví tiền và các vật dụng cá nhân khác. Với kiểu dáng hiện đại, sản phẩm này chắc chắn là lựa chọn lý tưởng cho những ai yêu thích sự tiện dụng và thời trang.'),
(132, 8, 24, 'Ba lô hàng ngày MARK RYDEN.', 900000, 0, 900000, 232, 5, 4.8, 'Với thiết kế tối giản nhưng không kém phần sang trọng, ba lô hàng ngày MARK RYDEN mang đến sự kết hợp hoàn hảo giữa công năng và phong cách. Được làm từ chất liệu bền bỉ, chiếc ba lô này dễ dàng theo bạn đến bất kỳ đâu, từ công sở cho đến những chuyến du lịch ngắn ngày. Các ngăn trong ba lô được bố trí khoa học, giúp bạn dễ dàng sắp xếp đồ dùng mà không lo bị lộn xộn. Sản phẩm này là sự lựa chọn lý tưởng cho những người bận rộn nhưng vẫn muốn giữ vẻ ngoài chỉn chu.'),
(133, 8, 24, 'Ba lô nam da bò thật; Balo du lịch da bò sáp BP408LEA (Nâu sáp) - 100% da bò thật, BH 3 năm.', 2230000, 19, 1806300, 114, 5, 5, 'Chiếc ba lô này mang đến vẻ đẹp hoài cổ và sự bền bỉ tuyệt vời từ chất liệu da bò sáp tự nhiên. Với thiết kế tinh tế và sang trọng, ba lô BP408LEA là sự lựa chọn hoàn hảo cho những chuyến du lịch hay công tác dài ngày. Được làm từ 100% da bò thật, sản phẩm có khả năng chống nước, dễ dàng bảo quản và sử dụng lâu dài. Đặc biệt, với chế độ bảo hành lên đến 3 năm, bạn hoàn toàn yên tâm về chất lượng và độ bền của sản phẩm.'),
(134, 8, 25, 'Cặp da nam cao cấp hàng hiệu WilliamPOLO chất liệu da Bò nguyên tấm ( Lap 15,6 inch ) - POLO 203085.', 3500000, 35, 2275000, 125, 5, 4.8, 'Cặp da WilliamPOLO là sự lựa chọn tuyệt vời cho các quý ông yêu thích sự lịch lãm và sang trọng. Được làm từ chất liệu da bò nguyên tấm, cặp có độ bền cao và dễ dàng làm mới qua thời gian. Với thiết kế đơn giản nhưng vô cùng tinh tế, cặp đựng vừa laptop 15,6 inch, thích hợp để bạn mang theo trong các cuộc họp, công tác hay những dịp quan trọng. Chắc chắn rằng bạn sẽ luôn tự tin và đẳng cấp với sản phẩm này.'),
(135, 8, 24, 'Ba lô nam da bò thật; Balo da bò nam nữ BP411LEA (Đen) - 100% da bò thật, BH 3 năm.', 1500000, 0, 1500000, 118, 5, 5, 'Ba lô BP411LEA được thiết kế dành riêng cho những người yêu thích sự mạnh mẽ và thời trang. Được làm từ da bò thật, sản phẩm có độ bền vượt trội và khả năng chống thấm nước tốt, giúp bảo vệ đồ dùng bên trong. Kiểu dáng tối giản, màu đen cổ điển phù hợp cho cả nam và nữ, mang đến sự linh hoạt và dễ dàng phối hợp với nhiều trang phục khác nhau. Với bảo hành 3 năm, sản phẩm này sẽ là người bạn đồng hành lâu dài trong những chuyến đi hay công việc hàng ngày của bạn.'),
(136, 8, 25, 'Cặp da nam cao cấp hàng hiệu WilliamPOLO chất liệu da Bò nguyên tấm - POLO 223161.', 2800000, 33, 1876000, 105, 5, 4.8, 'WilliamPOLO POLO 223161 là chiếc cặp da cao cấp, hoàn hảo cho những người đàn ông thành đạt. Được làm từ da bò nguyên tấm, cặp có vẻ ngoài sang trọng, chắc chắn và có thể chứa đựng laptop 15,6 inch cùng nhiều vật dụng cá nhân khác. Màu sắc trang nhã và thiết kế tối giản giúp bạn luôn nổi bật trong mọi hoàn cảnh, từ công sở cho đến những buổi gặp mặt quan trọng.'),
(137, 8, 25, 'Túi Xách Nam Công Sở Cặp Da Doanh Nhân GENCE CDX14 Da Bò Cao Cấp Màu Nâu Đậm.', 3000000, 29, 2130000, 120, 5, 4.8, 'Túi xách GENCE CDX14 là một sản phẩm hoàn hảo cho các quý ông công sở. Được làm từ da bò cao cấp, chiếc túi không chỉ bền bỉ mà còn thể hiện được phong cách lịch lãm và sang trọng. Màu nâu đậm cùng với thiết kế thông minh, các ngăn đựng rộng rãi giúp bạn dễ dàng chứa đựng laptop, tài liệu và các vật dụng cá nhân một cách gọn gàng và an toàn. Đây là món phụ kiện không thể thiếu cho những người luôn bận rộn nhưng vẫn muốn giữ được vẻ ngoài hoàn hảo.'),
(138, 8, 25, 'Túi Xách Nam Cặp Da Đen Cầm Tay GENCE CGL09 Chất Liệu Da Bò Khóa Số Cao Cấp Màu Đen.', 3500000, 26, 2590000, 112, 5, 5, 'Túi xách GENCE CGL09 là sự lựa chọn lý tưởng cho những ai yêu thích sự đơn giản và tinh tế. Chất liệu da bò cao cấp mang đến vẻ đẹp bền bỉ, đồng thời khóa số an toàn giúp bảo vệ tài sản của bạn. Màu đen cổ điển phù hợp với nhiều phong cách thời trang khác nhau, giúp bạn luôn tự tin trong các buổi họp mặt hay công việc hàng ngày.'),
(139, 8, 25, 'Túi Xách Cặp Đựng Laptop Nam Da Bò Cao Cấp Thiết Kế Công Sở Sang Trọng Chính Hãng LAVATINO - HB02.', 4500000, 0, 4500000, 232, 5, 4.8, 'LAVATINO HB02 là chiếc túi xách cặp đựng laptop sang trọng, được làm từ da bò cao cấp, mang đến sự kết hợp hoàn hảo giữa thiết kế tinh tế và tính năng tiện dụng. Với khả năng chứa đựng laptop và các vật dụng cá nhân, sản phẩm này là lựa chọn lý tưởng cho các quý ông công sở. Màu sắc trang nhã cùng với kiểu dáng lịch lãm sẽ giúp bạn luôn nổi bật trong mọi tình huống.'),
(140, 8, 25, 'Túi Xách Cặp Da Doanh Nhân Túi Xách Công Sở GENCE CTS13 Da Bò Khóa Số Cao Cấp Màu Nâu.', 3000000, 35, 1950000, 123, 5, 4.8, 'Túi xách GENCE CTS13 là lựa chọn hoàn hảo cho những doanh nhân yêu thích sự tinh tế và phong cách. Với chất liệu da bò cao cấp, túi mang đến vẻ đẹp sang trọng và độ bền vượt trội. Khóa số an toàn giúp bảo vệ tài sản quý giá của bạn. Thiết kế gọn gàng nhưng đầy đủ các ngăn đựng, túi có thể chứa đựng laptop, tài liệu và các vật dụng cá nhân một cách ngăn nắp. Màu nâu trầm ấm dễ dàng phối hợp với nhiều trang phục, là món phụ kiện không thể thiếu cho các quý ông thành đạt.'),
(141, 8, 25, 'Túi xách tay da PU mềm mại sức chứa lớn thời trang Túi tote Khóa kéo đóng cửa Cho Nữ.', 168000, 0, 168000, 243, 5, 4.8, 'Túi xách tote nữ này là lựa chọn hoàn hảo cho những ai yêu thích sự đơn giản nhưng tinh tế. Với chất liệu da PU mềm mại, túi không chỉ có độ bền cao mà còn rất nhẹ nhàng và dễ dàng mang theo trong mọi hoàn cảnh. Thiết kế khóa kéo đóng cửa giúp bảo vệ đồ đạc của bạn một cách an toàn. Sức chứa lớn của túi giúp bạn đựng được nhiều vật dụng cần thiết, từ điện thoại, ví tiền cho đến sách vở, laptop, phù hợp cho những cô nàng bận rộn.'),
(142, 8, 25, 'Túi xách nữ thời trang sức chứa lớn túi đẹp gói nữ.', 173333, 0, 173333, 231, 5, 4.8, 'Túi xách nữ thời trang này là sự kết hợp hoàn hảo giữa vẻ đẹp hiện đại và công năng tiện dụng. Được làm từ chất liệu da cao cấp, túi xách không chỉ mang đến vẻ ngoài sang trọng mà còn rất bền bỉ. Sức chứa lớn giúp bạn dễ dàng mang theo mọi thứ từ điện thoại, ví tiền đến sách vở và các vật dụng cá nhân khác. Đây chắc chắn là món phụ kiện không thể thiếu cho những cô nàng năng động và yêu thích thời trang.'),
(143, 8, 25, 'Túi xách vải canvas phong cách Nhật Bản dành cho nữ Công suất lớn đa năng.', 103333, 0, 103333, 228, 5, 4.8, 'Chiếc túi xách vải canvas này mang đậm phong cách Nhật Bản với thiết kế tối giản nhưng vô cùng sang trọng. Chất liệu vải canvas chắc chắn, bền bỉ và dễ dàng làm sạch, là lựa chọn lý tưởng cho những ai yêu thích sự thoải mái và tiện dụng. Sức chứa lớn giúp bạn dễ dàng đựng sách vở, đồ dùng cá nhân và các vật dụng cần thiết khác. Đây là món đồ không thể thiếu trong tủ đồ của những cô nàng yêu thích sự nhẹ nhàng và phong cách.'),
(144, 8, 25, 'Túi xách nữ công sở tote da pu size lớn để vừa A4 laptop đi học đi chơi cao cấp TX154.', 198000, 35, 128700, 236, 5, 4.8, 'Túi xách công sở TX154 là sự kết hợp hoàn hảo giữa sự sang trọng và tiện dụng. Chất liệu da PU cao cấp mang lại vẻ ngoài mềm mại, nhưng không kém phần bền bỉ. Với kích thước lớn, túi có thể chứa đựng laptop, tài liệu A4, giúp bạn dễ dàng mang theo mọi vật dụng cần thiết cho công việc hay học tập. Thiết kế đơn giản nhưng tinh tế với các chi tiết nhỏ nhấn mạnh vẻ đẹp thanh lịch, là lựa chọn lý tưởng cho những cô nàng công sở yêu thích sự sang trọng và tiện dụng.'),
(145, 8, 25, 'Túi xách Túi đeo vai thời trang Túi Tote dung tích lớn thông thường.', 155000, 10, 139500, 447, 5, 5, 'Túi tote đeo vai này là lựa chọn lý tưởng cho những ai yêu thích sự thoải mái và phong cách thời trang. Với thiết kế dung tích lớn, túi có thể chứa đựng nhiều vật dụng cá nhân cần thiết, từ ví tiền, điện thoại đến sách vở, áo khoác và các vật dụng khác. Chất liệu vải bền bỉ cùng kiểu dáng tối giản mang đến sự linh hoạt trong việc kết hợp với các trang phục khác nhau. Đây chắc chắn là món phụ kiện không thể thiếu cho những cô nàng yêu thích sự nhẹ nhàng, thanh thoát.'),
(146, 8, 24, 'Ba Lô Đi Học In Chữ Đơn Giản Sức Chứa Lớn Phong Cách Hàn Quốc.', 263333, 0, 263333, 235, 5, 5, 'Chiếc ba lô này mang đến vẻ đẹp trẻ trung, năng động với thiết kế đơn giản nhưng vô cùng thời trang. Với chất liệu vải bền bỉ và thiết kế tối ưu, ba lô có thể chứa đựng sách vở, laptop và nhiều vật dụng cá nhân khác. Kiểu dáng thanh lịch với chữ in trên bề mặt mang đậm phong cách Hàn Quốc, là sự lựa chọn lý tưởng cho những bạn trẻ yêu thích sự năng động và tiện dụng trong việc học tập và sinh hoạt hàng ngày.'),
(147, 8, 25, 'Túi xách nữ công sở, túi tote da đựng vừa laptop, A4 có khóa kéo chắc chắn kèm khăn lụa ví nhỏ HY14.', 350000, 18, 287000, 241, 5, 4.8, 'Túi xách HY14 là sự kết hợp hoàn hảo giữa sự thanh lịch và tiện dụng, thích hợp cho các cô nàng công sở. Với chất liệu da cao cấp, túi không chỉ bền bỉ mà còn mang đến vẻ đẹp sang trọng, giúp bạn dễ dàng kết hợp với nhiều bộ trang phục khác nhau. Thiết kế với ngăn chính rộng rãi, đựng vừa laptop và tài liệu A4, giúp bạn dễ dàng mang theo mọi vật dụng cần thiết. Khóa kéo chắc chắn và chi tiết khăn lụa, ví nhỏ tạo điểm nhấn làm túi thêm phần ấn tượng.'),
(148, 8, 25, 'Túi xách tote nữ GILAN Gani bag ( 3 màu) - đựng được Laptop, A4.', 490000, 0, 490000, 5357, 5, 4.8, 'Túi xách GILAN Gani bag là sự lựa chọn tuyệt vời cho những ai yêu thích sự tiện dụng và thời trang. Với thiết kế tối giản nhưng đầy tinh tế, túi có thể chứa đựng laptop, tài liệu A4 và nhiều vật dụng cá nhân khác. Chất liệu vải cao cấp cùng với màu sắc trang nhã mang đến sự linh hoạt trong việc phối đồ, từ công sở đến các buổi gặp mặt. Đây là món phụ kiện không thể thiếu cho những cô nàng yêu thích sự hiện đại và thanh lịch.'),
(149, 8, 25, 'Túi xách tote nữ GILAN Oreo bag ( 2 màu) - đựng được Laptop, A4.', 490000, 0, 490000, 235, 5, 4.8, 'Túi xách GILAN Oreo bag là sản phẩm lý tưởng cho các cô nàng yêu thích sự sang trọng và tiện dụng. Với thiết kế đơn giản nhưng không kém phần nổi bật, túi có thể đựng được laptop, tài liệu A4 và nhiều vật dụng khác. Chất liệu vải mềm mại, bền bỉ và các chi tiết hoàn thiện tỉ mỉ giúp túi không chỉ đẹp mà còn rất chắc chắn. Màu sắc nhẹ nhàng dễ dàng phối hợp với mọi trang phục, là món phụ kiện không thể thiếu trong tủ đồ của những tín đồ thời trang.'),
(150, 8, 25, 'Túi đeo vai nữ GILAN Jane bag ( 2 màu) - đựng được Ipad, sổ sách và nhiều đồ dùng cá nhân.', 450000, 25, 337500, 240, 5, 5, 'Túi đeo vai GILAN Jane bag là sự kết hợp hoàn hảo giữa phong cách và tiện dụng. Được thiết kế dành riêng cho những cô nàng yêu thích sự nhẹ nhàng và năng động, túi có thể đựng Ipad, sổ sách và các vật dụng cá nhân khác. Chất liệu vải mềm mại, dễ chịu và kiểu dáng thanh lịch mang lại sự thoải mái tối đa khi sử dụng. Màu sắc dễ phối hợp với nhiều trang phục, là món phụ kiện tuyệt vời cho những ai yêu thích sự đơn giản nhưng không kém phần thời trang.\n\n'),
(151, 8, 24, 'Test', 155500, 10, 139950, 0, 0, 5, 'Sản phẩm test');

--
-- Bẫy `products`
--
DELIMITER $$
CREATE TRIGGER `trg_calculate_sale_price_insert` BEFORE INSERT ON `products` FOR EACH ROW BEGIN
    IF NEW.sale = 0 THEN
        SET NEW.sale_price = NEW.price; -- Nếu sale là 0, sale_price = price
    ELSE
        SET NEW.sale_price = NEW.price * (1 - NEW.sale / 100); -- Tính sale_price thông thường
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_calculate_sale_price_update` BEFORE UPDATE ON `products` FOR EACH ROW BEGIN
    IF NEW.sale = 0 THEN
        SET NEW.sale_price = NEW.price; -- Nếu sale là 0, sale_price = price
    ELSE
        SET NEW.sale_price = NEW.price * (1 - NEW.sale / 100); -- Tính sale_price thông thường
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_activity_history`
--

CREATE TABLE `product_activity_history` (
  `activity_history_id` int(9) NOT NULL,
  `product_id` int(9) NOT NULL,
  `action_type` varchar(10) NOT NULL,
  `action_by` varchar(50) NOT NULL,
  `action_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `product_activity_history`
--

INSERT INTO `product_activity_history` (`activity_history_id`, `product_id`, `action_type`, `action_by`, `action_date`) VALUES
(1, 1, 'create', 'Dương Văn Kiên', '2024-12-18 05:53:46'),
(2, 2, 'create', 'Dương Văn Kiên', '2025-02-05 14:20:30'),
(3, 3, 'create', 'Dương Văn Kiên', '2025-02-13 19:45:50'),
(4, 4, 'create', 'Dương Văn Kiên', '2025-02-10 18:30:25'),
(5, 5, 'create', 'Dương Văn Kiên', '2025-02-12 16:35:40'),
(6, 6, 'create', 'Dương Văn Kiên', '2025-02-08 15:29:55'),
(7, 7, 'create', 'Dương Văn Kiên', '2025-02-09 16:45:10'),
(8, 8, 'create', 'Dương Văn Kiên', '2025-02-11 18:23:45'),
(9, 9, 'create', 'Dương Văn Kiên', '2025-02-06 17:22:12'),
(10, 10, 'create', 'Dương Văn Kiên', '2025-02-12 19:45:33'),
(11, 11, 'create', 'Dương Văn Kiên', '2025-02-07 12:20:40'),
(12, 12, 'create', 'Dương Văn Kiên', '2025-02-10 15:30:14'),
(13, 13, 'create', 'Dương Văn Kiên', '2025-02-09 17:45:25'),
(14, 14, 'create', 'Dương Văn Kiên', '2025-02-13 20:10:19'),
(15, 15, 'create', 'Dương Văn Kiên', '2025-02-05 14:25:47'),
(16, 16, 'create', 'Dương Văn Kiên', '2025-02-08 16:20:55'),
(17, 17, 'create', 'Dương Văn Kiên', '2025-02-07 13:40:12'),
(18, 18, 'create', 'Dương Văn Kiên', '2025-02-11 19:22:34'),
(19, 19, 'create', 'Dương Văn Kiên', '2025-02-06 15:35:40'),
(20, 20, 'create', 'Dương Văn Kiên', '2025-02-09 18:45:33'),
(21, 21, 'create', 'Dương Văn Kiên', '2025-02-10 14:30:45'),
(22, 22, 'create', 'Dương Văn Kiên', '2025-02-08 19:20:17'),
(23, 23, 'create', 'Dương Văn Kiên', '2025-02-07 20:35:40'),
(24, 24, 'create', 'Dương Văn Kiên', '2025-02-09 18:22:55'),
(25, 25, 'create', 'Dương Văn Kiên', '2025-02-11 19:45:10'),
(26, 26, 'create', 'Dương Văn Kiên', '2025-02-13 20:30:25'),
(27, 27, 'create', 'Dương Văn Kiên', '2025-02-12 14:45:50'),
(28, 28, 'create', 'Dương Văn Kiên', '2025-02-06 15:18:30'),
(29, 29, 'create', 'Dương Văn Kiên', '2025-02-07 17:20:12'),
(30, 30, 'create', 'Dương Văn Kiên', '2025-02-10 19:35:33'),
(31, 31, 'create', 'Dương Văn Kiên', '2025-02-09 16:45:40'),
(32, 32, 'create', 'Dương Văn Kiên', '2025-02-13 15:22:55'),
(33, 33, 'create', 'Dương Văn Kiên', '2025-02-12 14:20:10'),
(34, 34, 'create', 'Dương Văn Kiên', '2025-02-08 18:30:25'),
(35, 35, 'create', 'Dương Văn Kiên', '2025-02-11 17:45:40'),
(36, 36, 'create', 'Dương Văn Kiên', '2025-02-07 19:20:50'),
(37, 37, 'create', 'Dương Văn Kiên', '2025-02-09 18:25:55'),
(38, 38, 'create', 'Dương Văn Kiên', '2025-02-10 20:30:12'),
(39, 39, 'create', 'Dương Văn Kiên', '2025-02-12 19:45:33'),
(40, 40, 'create', 'Dương Văn Kiên', '2025-02-08 17:20:45'),
(41, 41, 'create', 'Dương Văn Kiên', '2025-02-05 16:35:10'),
(42, 42, 'create', 'Dương Văn Kiên', '2025-02-13 18:22:40'),
(43, 43, 'create', 'Dương Văn Kiên', '2025-02-07 15:30:25'),
(44, 44, 'create', 'Dương Văn Kiên', '2025-02-11 19:45:12'),
(45, 45, 'create', 'Dương Văn Kiên', '2025-02-09 18:20:33'),
(46, 46, 'create', 'Dương Văn Kiên', '2025-02-06 17:45:40'),
(47, 47, 'create', 'Dương Văn Kiên', '2025-02-10 19:20:55'),
(48, 48, 'create', 'Dương Văn Kiên', '2025-02-12 20:35:50'),
(49, 49, 'create', 'Dương Văn Kiên', '2025-02-09 17:45:25'),
(50, 50, 'create', 'Dương Văn Kiên', '2025-02-11 19:20:10'),
(51, 51, 'create', 'Dương Văn Kiên', '2025-02-08 16:45:40'),
(52, 52, 'create', 'Dương Văn Kiên', '2025-02-13 18:30:25'),
(53, 53, 'create', 'Dương Văn Kiên', '2025-02-09 20:25:55'),
(54, 54, 'create', 'Dương Văn Kiên', '2025-02-05 17:22:12'),
(55, 55, 'create', 'Dương Văn Kiên', '2025-02-07 19:45:33'),
(56, 56, 'create', 'Dương Văn Kiên', '2025-02-10 14:20:45'),
(57, 57, 'create', 'Dương Văn Kiên', '2025-02-12 15:35:10'),
(58, 58, 'create', 'Dương Văn Kiên', '2025-02-11 17:45:50'),
(59, 59, 'create', 'Dương Văn Kiên', '2025-02-13 19:20:33'),
(60, 60, 'create', 'Dương Văn Kiên', '2025-02-06 18:30:25'),
(61, 61, 'create', 'Dương Văn Kiên', '2025-02-08 20:35:12'),
(62, 62, 'create', 'Dương Văn Kiên', '2025-02-09 17:45:55'),
(63, 63, 'create', 'Dương Văn Kiên', '2025-02-07 19:20:40'),
(64, 64, 'create', 'Dương Văn Kiên', '2025-02-12 18:25:25'),
(65, 65, 'create', 'Dương Văn Kiên', '2025-02-08 20:25:55'),
(66, 66, 'create', 'Dương Văn Kiên', '2025-02-13 15:30:25'),
(67, 67, 'create', 'Dương Văn Kiên', '2025-02-02 16:45:10'),
(68, 68, 'create', 'Dương Văn Kiên', '2025-02-06 17:22:12'),
(69, 69, 'create', 'Dương Văn Kiên', '2025-02-07 19:45:33'),
(70, 70, 'create', 'Dương Văn Kiên', '2025-02-10 14:20:45'),
(71, 71, 'create', 'Dương Văn Kiên', '2025-02-12 15:35:10'),
(72, 72, 'create', 'Dương Văn Kiên', '2025-02-11 17:45:50'),
(73, 73, 'create', 'Dương Văn Kiên', '2025-02-13 19:20:33'),
(74, 74, 'create', 'Dương Văn Kiên', '2025-02-06 18:30:25'),
(75, 75, 'create', 'Dương Văn Kiên', '2025-02-08 20:35:12'),
(76, 76, 'create', 'Dương Văn Kiên', '2025-02-09 17:45:55'),
(77, 77, 'create', 'Dương Văn Kiên', '2025-02-07 19:20:40'),
(78, 78, 'create', 'Dương Văn Kiên', '2025-02-12 18:25:25'),
(79, 79, 'create', 'Dương Văn Kiên', '2025-02-08 20:25:55'),
(80, 80, 'create', 'Dương Văn Kiên', '2025-02-13 15:30:25'),
(81, 81, 'create', 'Dương Văn Kiên', '2025-02-09 20:25:55'),
(82, 82, 'create', 'Dương Văn Kiên', '2025-02-05 17:22:12'),
(83, 83, 'create', 'Dương Văn Kiên', '2025-02-07 19:45:33'),
(84, 84, 'create', 'Dương Văn Kiên', '2025-02-10 14:20:45'),
(85, 85, 'create', 'Dương Văn Kiên', '2025-02-12 15:35:10'),
(86, 86, 'create', 'Dương Văn Kiên', '2025-02-11 17:45:50'),
(87, 87, 'create', 'Dương Văn Kiên', '2025-02-13 19:20:33'),
(88, 88, 'create', 'Dương Văn Kiên', '2025-02-06 18:30:25'),
(89, 89, 'create', 'Dương Văn Kiên', '2025-02-08 20:35:12'),
(90, 90, 'create', 'Dương Văn Kiên', '2025-02-09 17:45:55'),
(91, 91, 'create', 'Dương Văn Kiên', '2025-02-07 19:20:40'),
(92, 92, 'create', 'Dương Văn Kiên', '2025-02-12 18:25:25'),
(93, 93, 'create', 'Dương Văn Kiên', '2025-02-08 20:25:55'),
(94, 94, 'create', 'Dương Văn Kiên', '2025-02-13 15:30:25'),
(95, 95, 'create', 'Dương Văn Kiên', '2025-02-09 20:25:55'),
(96, 96, 'create', 'Dương Văn Kiên', '2025-02-05 17:22:12'),
(97, 97, 'create', 'Dương Văn Kiên', '2025-02-07 19:45:33'),
(98, 98, 'create', 'Dương Văn Kiên', '2025-02-10 14:20:45'),
(99, 99, 'create', 'Dương Văn Kiên', '2025-02-12 15:35:10'),
(100, 100, 'create', 'Dương Văn Kiên', '2025-02-11 17:45:50'),
(101, 101, 'create', 'Dương Văn Kiên', '2025-02-05 14:20:30'),
(102, 102, 'create', 'Dương Văn Kiên', '2025-02-13 19:45:50'),
(103, 103, 'create', 'Dương Văn Kiên', '2025-02-10 18:30:25'),
(104, 104, 'create', 'Dương Văn Kiên', '2025-02-12 16:35:40'),
(105, 105, 'create', 'Dương Văn Kiên', '2025-02-08 15:29:55'),
(106, 106, 'create', 'Dương Văn Kiên', '2025-02-09 16:45:10'),
(107, 107, 'create', 'Dương Văn Kiên', '2025-02-11 18:23:45'),
(108, 108, 'create', 'Dương Văn Kiên', '2025-02-06 17:22:12'),
(109, 109, 'create', 'Dương Văn Kiên', '2025-02-12 19:45:33'),
(110, 110, 'create', 'Dương Văn Kiên', '2025-02-07 12:20:40'),
(111, 111, 'create', 'Dương Văn Kiên', '2025-02-10 15:30:14'),
(112, 112, 'create', 'Dương Văn Kiên', '2025-02-09 17:45:25'),
(113, 113, 'create', 'Dương Văn Kiên', '2025-02-13 20:10:19'),
(114, 114, 'create', 'Dương Văn Kiên', '2025-02-05 14:25:47'),
(115, 115, 'create', 'Dương Văn Kiên', '2025-02-08 16:20:55'),
(116, 116, 'create', 'Dương Văn Kiên', '2025-02-07 13:40:12'),
(117, 117, 'create', 'Dương Văn Kiên', '2025-02-11 19:22:34'),
(118, 118, 'create', 'Dương Văn Kiên', '2025-02-06 15:35:40'),
(119, 119, 'create', 'Dương Văn Kiên', '2025-02-09 18:45:33'),
(120, 120, 'create', 'Dương Văn Kiên', '2025-02-10 14:30:45'),
(121, 121, 'create', 'Dương Văn Kiên', '2025-02-08 19:20:17'),
(122, 122, 'create', 'Dương Văn Kiên', '2025-02-07 20:35:40'),
(123, 123, 'create', 'Dương Văn Kiên', '2025-02-09 18:22:55'),
(124, 124, 'create', 'Dương Văn Kiên', '2025-02-11 19:45:10'),
(125, 125, 'create', 'Dương Văn Kiên', '2025-02-13 20:30:25'),
(126, 126, 'create', 'Dương Văn Kiên', '2025-02-05 17:22:12'),
(127, 127, 'create', 'Dương Văn Kiên', '2025-02-07 19:45:33'),
(128, 128, 'create', 'Dương Văn Kiên', '2025-02-10 14:20:45'),
(129, 129, 'create', 'Dương Văn Kiên', '2025-02-12 15:35:10'),
(130, 130, 'create', 'Dương Văn Kiên', '2025-02-11 17:45:50'),
(131, 131, 'create', 'Dương Văn Kiên', '2025-02-13 19:20:33'),
(132, 132, 'create', 'Dương Văn Kiên', '2025-02-06 18:30:25'),
(133, 133, 'create', 'Dương Văn Kiên', '2025-02-08 20:35:12'),
(134, 134, 'create', 'Dương Văn Kiên', '2025-02-09 17:45:55'),
(135, 135, 'create', 'Dương Văn Kiên', '2025-02-07 19:20:40'),
(136, 136, 'create', 'Dương Văn Kiên', '2025-02-12 18:25:25'),
(137, 137, 'create', 'Dương Văn Kiên', '2025-02-08 20:25:55'),
(138, 138, 'create', 'Dương Văn Kiên', '2025-02-13 15:30:25'),
(139, 139, 'create', 'Dương Văn Kiên', '2025-02-09 20:25:55'),
(140, 140, 'create', 'Dương Văn Kiên', '2025-02-05 17:22:12'),
(141, 141, 'create', 'Dương Văn Kiên', '2025-02-07 19:45:33'),
(142, 142, 'create', 'Dương Văn Kiên', '2025-02-10 14:20:45'),
(143, 143, 'create', 'Dương Văn Kiên', '2025-02-12 15:35:10'),
(144, 144, 'create', 'Dương Văn Kiên', '2025-02-11 17:45:50'),
(145, 145, 'create', 'Dương Văn Kiên', '2025-02-05 14:20:30'),
(146, 146, 'create', 'Dương Văn Kiên', '2025-02-13 19:45:50'),
(147, 147, 'create', 'Dương Văn Kiên', '2025-02-10 18:30:25'),
(148, 148, 'create', 'Dương Văn Kiên', '2025-02-12 16:35:40'),
(149, 149, 'create', 'Dương Văn Kiên', '2025-02-08 15:29:55'),
(150, 150, 'create', 'Dương Văn Kiên', '2025-02-09 16:45:10'),
(151, 151, 'create', 'Dương Văn Kiên', '2025-03-15 22:00:07'),
(152, 151, 'update', 'Dương Văn Kiên', '2025-03-15 22:00:31');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_categories`
--

CREATE TABLE `product_categories` (
  `category_id` int(9) NOT NULL,
  `category_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `product_categories`
--

INSERT INTO `product_categories` (`category_id`, `category_name`) VALUES
(1, 'Thời trang nam'),
(2, 'Thời trang nữ'),
(3, 'Phụ kiện thời trang'),
(4, 'Giày dép nam'),
(5, 'Giày dép nữ'),
(6, 'Đồ dùng gia đình'),
(7, 'Đồ trẻ em'),
(8, 'Balo - túi xách');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_colors`
--

CREATE TABLE `product_colors` (
  `color_id` int(9) NOT NULL,
  `color_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `product_colors`
--

INSERT INTO `product_colors` (`color_id`, `color_name`) VALUES
(1, 'Đen'),
(2, 'Trắng'),
(3, 'Xám'),
(4, 'Be'),
(5, 'Vàng'),
(6, 'Xanh dương'),
(7, 'Xanh lá'),
(8, 'Hồng'),
(9, 'Ghi'),
(10, 'Cà phê'),
(11, 'Kem'),
(12, 'Navy'),
(13, 'Be nhạt'),
(14, 'Xanh navy'),
(15, 'Xanh đen'),
(16, 'Xanh than'),
(17, 'Đỏ'),
(18, 'Nâu'),
(19, 'Xanh rêu'),
(20, 'Xám đậm'),
(21, 'Xám trắng'),
(22, 'Xám chì'),
(23, 'Ghi tàn'),
(24, 'Trắng kem'),
(25, 'Trắng sữa'),
(26, 'Nâu be'),
(27, 'Nâu rêu'),
(28, 'Xanh ngọc'),
(29, 'Tím'),
(30, 'Xám nhạt'),
(31, 'Nude'),
(32, 'Xanh'),
(33, 'Bạc'),
(34, 'Trắng ngà'),
(35, 'Cam'),
(36, 'Riêu'),
(37, 'Khói'),
(38, 'Kaki'),
(39, 'Cafe'),
(40, 'Tím than'),
(41, 'Trắng xanh'),
(42, 'Đen trắng'),
(43, 'Mơ'),
(44, 'Be nâu'),
(45, 'Trắng đen'),
(46, 'Trắng đỏ'),
(47, 'Multicolor');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_details`
--

CREATE TABLE `product_details` (
  `product_detail_id` int(9) NOT NULL,
  `product_id` int(9) NOT NULL,
  `color_id` int(9) NOT NULL,
  `size_id` int(9) NOT NULL,
  `quantity` int(9) NOT NULL,
  `sold_quantity` int(9) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `product_details`
--

INSERT INTO `product_details` (`product_detail_id`, `product_id`, `color_id`, `size_id`, `quantity`, `sold_quantity`) VALUES
(1, 1, 1, 1, 5548, 105),
(2, 1, 1, 2, 6666, 68),
(3, 1, 1, 3, 8888, 83),
(4, 1, 1, 4, 6789, 86),
(5, 1, 4, 1, 8885, 203),
(6, 1, 4, 2, 9999, 350),
(7, 1, 4, 3, 8888, 233),
(8, 1, 4, 4, 3333, 150),
(9, 2, 1, 1, 6665, 124),
(10, 2, 1, 2, 9999, 111),
(11, 2, 1, 3, 8888, 199),
(12, 2, 1, 4, 9999, 200),
(13, 3, 1, 1, 6665, 139),
(14, 3, 1, 2, 6789, 183),
(15, 3, 1, 3, 5699, 186),
(16, 3, 1, 4, 6969, 222),
(17, 3, 9, 1, 5666, 200),
(18, 3, 9, 2, 2345, 100),
(19, 3, 9, 3, 3333, 120),
(20, 3, 9, 4, 8888, 222),
(21, 4, 1, 1, 6666, 220),
(22, 4, 1, 2, 5555, 222),
(23, 4, 1, 3, 3333, 333),
(24, 4, 1, 4, 6666, 123),
(25, 4, 2, 1, 9889, 333),
(26, 4, 2, 2, 6866, 100),
(27, 4, 2, 3, 6789, 234),
(28, 4, 2, 4, 8888, 135),
(29, 4, 7, 1, 9999, 111),
(30, 4, 7, 2, 8888, 123),
(31, 4, 7, 3, 6666, 222),
(32, 4, 7, 4, 5678, 123),
(33, 5, 1, 1, 5555, 98),
(34, 5, 1, 2, 6666, 68),
(35, 5, 1, 3, 8888, 83),
(36, 5, 1, 4, 6789, 86),
(37, 5, 6, 1, 8888, 200),
(38, 5, 6, 2, 9999, 350),
(39, 5, 6, 3, 8888, 233),
(40, 5, 6, 4, 3333, 150),
(41, 5, 8, 1, 6666, 123),
(42, 5, 8, 2, 9999, 111),
(43, 5, 8, 3, 8888, 199),
(44, 5, 8, 4, 9999, 200),
(45, 6, 1, 1, 5552, 101),
(46, 6, 1, 2, 6666, 68),
(47, 6, 1, 3, 8888, 83),
(48, 6, 1, 4, 6789, 86),
(49, 6, 4, 1, 8888, 200),
(50, 6, 4, 2, 9997, 352),
(51, 6, 4, 3, 8888, 233),
(52, 6, 4, 4, 3333, 150),
(53, 6, 10, 1, 6666, 123),
(54, 6, 10, 2, 9999, 111),
(55, 6, 10, 3, 8888, 199),
(56, 6, 10, 4, 9999, 200),
(57, 7, 1, 1, 5554, 112),
(58, 7, 1, 2, 6666, 68),
(59, 7, 1, 3, 8888, 83),
(60, 7, 1, 4, 6789, 86),
(61, 7, 3, 1, 8886, 125),
(62, 7, 3, 2, 9999, 226),
(63, 7, 3, 3, 8888, 233),
(64, 7, 3, 4, 3333, 150),
(65, 8, 1, 1, 5554, 227),
(66, 8, 1, 2, 6666, 88),
(67, 8, 1, 3, 8888, 129),
(68, 8, 1, 4, 6789, 198),
(69, 9, 11, 1, 6787, 102),
(70, 9, 11, 2, 6666, 88),
(71, 9, 11, 3, 8888, 129),
(72, 9, 11, 4, 3333, 120),
(73, 10, 11, 1, 6787, 102),
(74, 10, 11, 2, 6666, 88),
(75, 10, 11, 3, 8888, 129),
(76, 10, 11, 4, 3333, 120),
(77, 10, 12, 1, 6789, 100),
(78, 10, 12, 2, 6666, 88),
(79, 10, 12, 3, 8888, 56),
(80, 10, 12, 4, 3333, 29),
(81, 11, 1, 1, 5555, 100),
(82, 11, 1, 2, 6660, 94),
(83, 11, 1, 3, 8888, 129),
(84, 11, 1, 4, 3333, 111),
(85, 11, 3, 1, 9889, 333),
(86, 11, 3, 2, 3333, 222),
(87, 11, 3, 3, 6789, 12),
(88, 11, 3, 4, 3333, 99),
(89, 11, 13, 1, 3456, 100),
(90, 11, 13, 2, 2345, 123),
(91, 11, 13, 3, 6654, 113),
(92, 11, 13, 4, 4567, 120),
(93, 11, 14, 1, 5555, 66),
(94, 11, 14, 2, 6666, 88),
(95, 11, 14, 3, 8888, 56),
(96, 11, 14, 4, 3333, 900),
(97, 12, 1, 1, 5555, 99),
(98, 12, 1, 2, 6666, 88),
(99, 12, 1, 3, 8888, 111),
(100, 12, 1, 4, 3333, 333),
(101, 12, 3, 1, 9889, 100),
(102, 12, 3, 2, 3333, 234),
(103, 12, 3, 3, 6786, 59),
(104, 12, 3, 4, 3333, 99),
(105, 12, 15, 1, 3456, 100),
(106, 12, 15, 2, 2345, 98),
(107, 12, 15, 3, 6654, 113),
(108, 12, 15, 4, 4567, 120),
(109, 13, 1, 1, 5555, 99),
(110, 13, 1, 2, 6665, 89),
(111, 13, 1, 3, 8888, 111),
(112, 13, 1, 4, 3333, 333),
(113, 13, 3, 1, 9889, 100),
(114, 13, 3, 2, 3333, 234),
(115, 13, 3, 3, 6789, 56),
(116, 13, 3, 4, 3333, 99),
(117, 13, 9, 1, 3456, 100),
(118, 13, 9, 2, 2345, 98),
(119, 13, 9, 3, 6654, 113),
(120, 13, 9, 4, 4567, 120),
(121, 13, 16, 1, 5555, 99),
(122, 13, 16, 2, 6666, 88),
(123, 13, 16, 3, 8888, 111),
(124, 13, 16, 4, 3333, 333),
(125, 13, 17, 1, 9889, 100),
(126, 13, 17, 2, 3333, 234),
(127, 13, 17, 3, 6789, 56),
(128, 13, 17, 4, 3333, 99),
(129, 13, 18, 1, 3456, 100),
(130, 13, 18, 2, 2345, 98),
(131, 13, 18, 3, 6654, 113),
(132, 13, 18, 4, 4567, 120),
(133, 14, 1, 1, 5555, 99),
(134, 14, 1, 2, 6666, 88),
(135, 14, 1, 3, 8888, 111),
(136, 14, 1, 4, 3333, 333),
(137, 14, 2, 1, 9889, 100),
(138, 14, 2, 2, 3333, 234),
(139, 14, 2, 3, 6789, 56),
(140, 14, 2, 4, 3333, 99),
(141, 14, 18, 1, 3456, 100),
(142, 14, 18, 2, 2345, 98),
(143, 14, 18, 3, 6654, 113),
(144, 14, 18, 4, 4567, 120),
(145, 14, 19, 1, 3456, 100),
(146, 14, 19, 2, 2345, 98),
(147, 14, 19, 3, 6654, 113),
(148, 14, 19, 4, 4567, 120),
(149, 15, 1, 1, 5555, 99),
(150, 15, 1, 2, 6666, 88),
(151, 15, 1, 3, 8888, 111),
(152, 15, 1, 4, 3333, 333),
(153, 15, 2, 1, 9889, 100),
(154, 15, 2, 2, 3333, 234),
(155, 15, 2, 3, 6789, 56),
(156, 15, 2, 4, 3333, 99),
(157, 15, 9, 1, 3456, 100),
(158, 15, 9, 2, 2345, 98),
(159, 15, 9, 3, 6654, 113),
(160, 15, 9, 4, 4567, 120),
(161, 16, 1, 1, 5555, 55),
(162, 16, 1, 2, 6666, 88),
(163, 16, 1, 3, 8888, 123),
(164, 16, 1, 4, 3333, 99),
(165, 16, 3, 1, 9889, 100),
(166, 16, 3, 2, 3333, 111),
(167, 16, 3, 3, 6789, 56),
(168, 16, 3, 4, 3333, 99),
(169, 16, 4, 1, 3456, 100),
(170, 16, 4, 2, 2345, 98),
(171, 16, 4, 3, 6654, 158),
(172, 16, 4, 4, 4567, 120),
(173, 17, 1, 1, 5555, 55),
(174, 17, 1, 2, 6666, 88),
(175, 17, 1, 3, 8888, 123),
(176, 17, 1, 4, 3333, 99),
(177, 17, 2, 1, 9889, 100),
(178, 17, 2, 2, 3333, 111),
(179, 17, 2, 3, 6789, 56),
(180, 17, 2, 4, 3333, 99),
(181, 17, 3, 1, 5555, 55),
(182, 17, 3, 2, 6666, 88),
(183, 17, 3, 3, 8888, 123),
(184, 17, 3, 4, 3333, 99),
(185, 17, 4, 1, 3456, 100),
(186, 17, 4, 2, 2345, 98),
(187, 17, 4, 3, 6654, 158),
(188, 17, 4, 4, 4567, 120),
(189, 18, 1, 1, 3456, 100),
(190, 18, 1, 2, 2345, 98),
(191, 18, 1, 3, 6654, 158),
(192, 18, 1, 4, 4567, 120),
(193, 19, 3, 1, 3456, 100),
(194, 19, 3, 2, 2345, 98),
(195, 19, 3, 3, 6654, 158),
(196, 19, 3, 4, 4567, 120),
(197, 19, 19, 1, 3456, 100),
(198, 19, 19, 2, 2345, 98),
(199, 19, 19, 3, 6654, 158),
(200, 19, 19, 4, 4567, 120),
(201, 20, 1, 1, 3456, 111),
(202, 20, 1, 2, 2345, 23),
(203, 20, 1, 3, 6654, 98),
(204, 20, 1, 4, 4567, 66),
(205, 20, 20, 1, 3456, 111),
(206, 20, 20, 2, 2345, 23),
(207, 20, 20, 3, 6654, 98),
(208, 20, 20, 4, 4567, 66),
(209, 20, 21, 1, 3456, 55),
(210, 20, 21, 2, 2345, 98),
(211, 20, 21, 3, 6654, 111),
(212, 20, 21, 4, 4567, 120),
(213, 21, 1, 1, 3456, 55),
(214, 21, 1, 2, 2345, 23),
(215, 21, 1, 3, 6654, 98),
(216, 21, 1, 4, 4567, 66),
(217, 21, 22, 1, 3456, 111),
(218, 21, 22, 2, 2345, 68),
(219, 21, 22, 3, 6654, 98),
(220, 21, 22, 4, 4567, 88),
(221, 21, 23, 1, 3456, 66),
(222, 21, 23, 2, 2345, 98),
(223, 21, 23, 3, 6654, 88),
(224, 21, 23, 4, 4567, 98),
(225, 22, 1, 1, 5555, 55),
(226, 22, 1, 2, 2222, 23),
(227, 22, 1, 3, 1111, 98),
(228, 22, 1, 4, 4567, 66),
(229, 22, 2, 1, 3456, 111),
(230, 22, 2, 2, 6666, 68),
(231, 22, 2, 3, 1111, 98),
(232, 22, 2, 4, 9999, 68),
(233, 22, 4, 1, 3456, 66),
(234, 22, 4, 2, 2345, 33),
(235, 22, 4, 3, 1234, 22),
(236, 22, 4, 4, 5555, 98),
(237, 23, 1, 1, 5555, 585),
(238, 23, 1, 2, 2210, 35),
(239, 23, 1, 3, 1110, 99),
(240, 23, 1, 4, 4567, 66),
(241, 23, 2, 1, 3456, 333),
(242, 23, 2, 2, 6666, 68),
(243, 23, 2, 3, 1111, 222),
(244, 23, 2, 4, 6666, 68),
(245, 23, 9, 1, 3456, 66),
(246, 23, 9, 2, 2345, 33),
(247, 23, 9, 3, 1234, 111),
(248, 23, 9, 4, 5555, 98),
(249, 24, 1, 1, 5555, 585),
(250, 24, 1, 2, 2222, 23),
(251, 24, 1, 3, 1111, 98),
(252, 24, 1, 4, 4567, 66),
(253, 24, 2, 1, 3456, 66),
(254, 24, 2, 2, 2345, 33),
(255, 24, 2, 3, 1234, 111),
(256, 24, 2, 4, 5555, 98),
(257, 25, 1, 1, 3333, 585),
(258, 25, 1, 2, 2222, 23),
(259, 25, 1, 3, 1111, 98),
(260, 25, 1, 4, 4567, 66),
(261, 25, 2, 1, 5555, 585),
(262, 25, 2, 2, 2222, 23),
(263, 25, 2, 3, 1111, 98),
(264, 25, 2, 4, 4567, 66),
(265, 25, 3, 1, 3456, 66),
(266, 25, 3, 2, 2345, 33),
(267, 25, 3, 3, 1234, 111),
(268, 25, 3, 4, 5555, 98),
(269, 26, 1, 1, 3333, 585),
(270, 26, 1, 2, 2222, 23),
(271, 26, 1, 3, 1111, 98),
(272, 26, 1, 4, 4567, 66),
(273, 26, 2, 1, 3456, 66),
(274, 26, 2, 2, 2345, 33),
(275, 26, 2, 3, 1234, 111),
(276, 26, 2, 4, 5555, 98),
(277, 27, 1, 1, 3333, 585),
(278, 27, 1, 2, 2222, 23),
(279, 27, 1, 3, 1111, 98),
(280, 27, 1, 4, 4567, 66),
(281, 27, 4, 1, 3456, 66),
(282, 27, 4, 2, 2345, 33),
(283, 27, 4, 3, 1234, 111),
(284, 27, 4, 4, 5555, 98),
(285, 27, 9, 1, 2222, 66),
(286, 27, 9, 2, 1111, 55),
(287, 27, 9, 3, 1234, 222),
(288, 27, 9, 4, 3333, 98),
(289, 28, 1, 1, 6662, 514),
(290, 28, 1, 2, 3332, 112),
(291, 28, 1, 3, 9998, 98),
(292, 28, 1, 4, 8888, 353),
(293, 28, 2, 1, 3456, 66),
(294, 28, 2, 2, 1111, 33),
(295, 28, 2, 3, 2222, 111),
(296, 28, 2, 4, 5555, 534),
(297, 28, 19, 1, 5653, 66),
(298, 28, 19, 2, 3534, 112),
(299, 28, 19, 3, 1234, 222),
(300, 28, 19, 4, 3333, 314),
(301, 29, 1, 1, 6662, 514),
(302, 29, 1, 2, 3332, 112),
(303, 29, 1, 3, 9998, 98),
(304, 29, 1, 4, 8888, 353),
(305, 29, 2, 1, 5653, 66),
(306, 29, 2, 2, 3534, 112),
(307, 29, 2, 3, 1234, 222),
(308, 29, 2, 4, 3333, 314),
(309, 30, 1, 1, 5656, 654),
(310, 30, 1, 2, 6546, 64),
(311, 30, 1, 3, 6557, 53),
(312, 30, 1, 4, 6757, 33),
(313, 30, 2, 1, 5435, 456),
(314, 30, 2, 2, 5436, 545),
(315, 30, 2, 3, 6562, 223),
(316, 30, 2, 4, 5326, 314),
(317, 31, 1, 1, 5623, 120),
(318, 31, 1, 2, 8474, 87),
(319, 31, 1, 3, 9319, 162),
(320, 31, 1, 4, 7845, 95),
(321, 31, 2, 1, 6941, 213),
(322, 31, 2, 2, 2555, 140),
(323, 31, 2, 3, 8622, 180),
(324, 31, 2, 4, 4890, 75),
(325, 32, 1, 1, 7234, 135),
(326, 32, 1, 2, 8421, 87),
(327, 32, 1, 3, 9150, 192),
(328, 32, 1, 4, 2768, 68),
(329, 32, 4, 1, 3567, 220),
(330, 32, 4, 2, 6783, 140),
(331, 32, 4, 3, 8990, 175),
(332, 32, 4, 4, 4875, 95),
(333, 33, 1, 1, 7234, 135),
(334, 33, 1, 2, 8421, 87),
(335, 33, 1, 3, 9150, 192),
(336, 33, 1, 4, 2768, 68),
(337, 33, 24, 1, 3567, 220),
(338, 33, 24, 2, 6783, 140),
(339, 33, 24, 3, 8990, 175),
(340, 33, 24, 4, 4875, 95),
(341, 34, 1, 1, 7234, 135),
(342, 34, 1, 2, 8421, 87),
(343, 34, 1, 3, 9150, 192),
(344, 34, 1, 4, 2768, 68),
(345, 34, 25, 1, 3567, 220),
(346, 34, 25, 2, 6783, 140),
(347, 34, 25, 3, 8990, 175),
(348, 34, 25, 4, 4875, 95),
(349, 34, 26, 1, 7234, 135),
(350, 34, 26, 2, 8421, 87),
(351, 34, 26, 3, 9150, 192),
(352, 34, 26, 4, 2768, 68),
(353, 34, 27, 1, 3567, 220),
(354, 34, 27, 2, 6783, 140),
(355, 34, 27, 3, 8990, 175),
(356, 34, 27, 4, 4875, 95),
(357, 34, 28, 1, 7234, 135),
(358, 34, 28, 2, 8421, 87),
(359, 34, 28, 3, 9150, 192),
(360, 34, 28, 4, 2768, 68),
(361, 35, 1, 1, 7234, 135),
(362, 35, 1, 2, 8421, 87),
(363, 35, 1, 3, 9150, 192),
(364, 35, 1, 4, 2768, 68),
(365, 35, 11, 1, 3567, 220),
(366, 35, 11, 2, 6783, 140),
(367, 35, 11, 3, 8990, 175),
(368, 35, 11, 4, 4875, 95),
(369, 36, 1, 1, 7234, 135),
(370, 36, 1, 2, 8421, 87),
(371, 36, 1, 3, 9150, 192),
(372, 36, 1, 4, 2768, 68),
(373, 36, 25, 1, 3567, 220),
(374, 36, 25, 2, 6783, 140),
(375, 36, 25, 3, 8990, 175),
(376, 36, 25, 4, 4875, 95),
(377, 37, 1, 1, 7234, 135),
(378, 37, 1, 2, 8421, 87),
(379, 37, 1, 3, 9150, 192),
(380, 37, 1, 4, 2768, 68),
(381, 37, 2, 1, 3567, 220),
(382, 37, 2, 2, 6783, 140),
(383, 37, 2, 3, 8990, 175),
(384, 37, 2, 4, 4875, 95),
(385, 37, 4, 1, 7234, 135),
(386, 37, 4, 2, 8421, 87),
(387, 37, 4, 3, 9150, 192),
(388, 37, 4, 4, 2768, 68),
(389, 38, 1, 1, 7234, 135),
(390, 38, 1, 2, 8421, 87),
(391, 38, 1, 3, 9150, 192),
(392, 38, 1, 4, 2768, 68),
(393, 38, 2, 1, 3567, 220),
(394, 38, 2, 2, 6780, 143),
(395, 38, 2, 3, 8990, 175),
(396, 38, 2, 4, 4875, 95),
(397, 39, 14, 1, 7234, 135),
(398, 39, 14, 2, 8421, 87),
(399, 39, 14, 3, 9150, 192),
(400, 39, 14, 4, 2768, 68),
(401, 40, 1, 1, 7230, 139),
(402, 40, 1, 2, 8419, 89),
(403, 40, 1, 3, 9150, 192),
(404, 40, 1, 4, 2768, 68),
(405, 41, 1, 1, 7234, 135),
(406, 41, 1, 2, 8421, 87),
(407, 41, 1, 3, 9150, 192),
(408, 41, 1, 4, 2768, 68),
(409, 41, 2, 1, 3567, 220),
(410, 41, 2, 2, 6783, 140),
(411, 41, 2, 3, 8990, 175),
(412, 41, 2, 4, 4875, 95),
(413, 41, 3, 1, 7234, 135),
(414, 41, 3, 2, 8421, 87),
(415, 41, 3, 3, 9150, 192),
(416, 41, 3, 4, 2768, 68),
(417, 42, 2, 1, 7234, 135),
(418, 42, 2, 2, 8421, 87),
(419, 42, 2, 3, 9150, 192),
(420, 42, 2, 4, 2768, 68),
(421, 42, 8, 1, 3567, 220),
(422, 42, 8, 2, 6783, 140),
(423, 42, 8, 3, 8990, 175),
(424, 42, 8, 4, 4875, 95),
(425, 42, 29, 1, 7234, 135),
(426, 42, 29, 2, 8421, 87),
(427, 42, 29, 3, 9150, 192),
(428, 42, 29, 4, 2768, 68),
(429, 43, 1, 1, 7234, 135),
(430, 43, 1, 2, 8421, 87),
(431, 43, 1, 3, 9150, 192),
(432, 43, 1, 4, 2768, 68),
(433, 43, 3, 1, 3567, 220),
(434, 43, 3, 2, 6783, 140),
(435, 43, 3, 3, 8990, 175),
(436, 43, 3, 4, 4875, 95),
(437, 43, 4, 1, 7234, 135),
(438, 43, 4, 2, 8421, 87),
(439, 43, 4, 3, 9150, 192),
(440, 43, 4, 4, 2768, 68),
(441, 43, 9, 1, 3567, 220),
(442, 43, 9, 2, 6783, 140),
(443, 43, 9, 3, 8990, 175),
(444, 43, 9, 4, 4875, 95),
(445, 43, 11, 1, 7234, 135),
(446, 43, 11, 2, 8421, 87),
(447, 43, 11, 3, 9150, 192),
(448, 43, 11, 4, 2768, 68),
(449, 43, 18, 1, 3567, 220),
(450, 43, 18, 2, 6783, 140),
(451, 43, 18, 3, 8990, 175),
(452, 43, 18, 4, 4875, 95),
(453, 44, 1, 1, 7234, 135),
(454, 44, 1, 2, 8421, 87),
(455, 44, 1, 3, 9150, 192),
(456, 44, 1, 4, 2768, 68),
(457, 44, 20, 1, 3567, 220),
(458, 44, 20, 2, 6783, 140),
(459, 44, 20, 3, 8990, 175),
(460, 44, 20, 4, 4875, 95),
(461, 44, 22, 1, 7234, 135),
(462, 44, 22, 2, 8421, 87),
(463, 44, 22, 3, 9150, 192),
(464, 44, 22, 4, 2768, 68),
(465, 44, 30, 1, 3567, 220),
(466, 44, 30, 2, 6783, 140),
(467, 44, 30, 3, 8990, 175),
(468, 44, 30, 4, 4875, 95),
(469, 45, 1, 1, 7234, 135),
(470, 45, 1, 2, 8421, 87),
(471, 45, 1, 3, 9150, 192),
(472, 45, 1, 4, 2768, 68),
(473, 45, 2, 1, 3567, 220),
(474, 45, 2, 2, 6783, 140),
(475, 45, 2, 3, 8990, 175),
(476, 45, 2, 4, 4875, 95),
(477, 45, 4, 1, 7234, 135),
(478, 45, 4, 2, 8421, 87),
(479, 45, 4, 3, 9150, 192),
(480, 45, 4, 4, 2768, 68),
(481, 45, 8, 1, 3567, 220),
(482, 45, 8, 2, 6783, 140),
(483, 45, 8, 3, 8990, 175),
(484, 45, 8, 4, 4875, 95),
(485, 45, 18, 1, 7234, 135),
(486, 45, 18, 2, 8421, 87),
(487, 45, 18, 3, 9150, 192),
(488, 45, 18, 4, 2768, 68),
(489, 46, 1, 1, 7231, 138),
(490, 46, 1, 2, 8421, 87),
(491, 46, 1, 3, 9150, 192),
(492, 46, 1, 4, 2768, 68),
(493, 46, 9, 1, 3567, 220),
(494, 46, 9, 2, 6783, 140),
(495, 46, 9, 3, 8990, 175),
(496, 46, 9, 4, 4875, 95),
(497, 46, 18, 1, 7234, 135),
(498, 46, 18, 2, 8421, 87),
(499, 46, 18, 3, 9150, 192),
(500, 46, 18, 4, 2768, 68),
(501, 47, 1, 1, 7234, 135),
(502, 47, 1, 2, 8421, 87),
(503, 47, 1, 3, 9150, 192),
(504, 47, 1, 4, 2768, 68),
(505, 48, 1, 1, 7234, 135),
(506, 48, 1, 2, 8421, 87),
(507, 48, 1, 3, 9150, 192),
(508, 48, 1, 4, 2768, 68),
(509, 48, 3, 1, 3567, 220),
(510, 48, 3, 2, 6783, 140),
(511, 48, 3, 3, 8990, 175),
(512, 48, 3, 4, 4875, 95),
(513, 49, 1, 1, 7234, 135),
(514, 49, 1, 2, 8421, 87),
(515, 49, 1, 3, 9150, 192),
(516, 49, 1, 4, 2768, 68),
(517, 49, 3, 1, 3567, 220),
(518, 49, 3, 2, 6783, 140),
(519, 49, 3, 3, 8990, 175),
(520, 49, 3, 4, 4875, 95),
(521, 50, 1, 1, 7234, 135),
(522, 50, 1, 2, 8421, 87),
(523, 50, 1, 3, 9150, 192),
(524, 50, 1, 4, 2768, 68),
(525, 50, 2, 1, 3567, 220),
(526, 50, 2, 2, 6783, 140),
(527, 50, 2, 3, 8990, 175),
(528, 50, 2, 4, 4875, 95),
(529, 50, 8, 1, 7234, 135),
(530, 50, 8, 2, 8421, 87),
(531, 50, 8, 3, 9150, 192),
(532, 50, 8, 4, 2768, 68),
(533, 50, 17, 1, 3567, 220),
(534, 50, 17, 2, 6783, 140),
(535, 50, 17, 3, 8990, 175),
(536, 50, 17, 4, 4875, 95),
(537, 51, 1, 1, 7234, 135),
(538, 51, 1, 2, 8421, 87),
(539, 51, 1, 3, 9150, 192),
(540, 51, 1, 4, 2768, 68),
(541, 52, 18, 1, 4821, 106),
(542, 52, 18, 2, 7491, 81),
(543, 52, 18, 3, 6124, 140),
(544, 52, 18, 4, 3257, 95),
(545, 52, 28, 1, 4582, 60),
(546, 52, 28, 2, 8174, 128),
(547, 52, 28, 3, 6943, 72),
(548, 52, 28, 4, 7593, 132),
(549, 53, 16, 1, 8953, 128),
(550, 53, 16, 2, 7624, 114),
(551, 53, 16, 3, 5218, 61),
(552, 53, 16, 4, 6842, 105),
(553, 53, 18, 1, 4310, 83),
(554, 53, 18, 2, 9071, 145),
(555, 53, 18, 3, 7883, 92),
(556, 53, 18, 4, 5934, 59),
(557, 53, 28, 1, 5631, 120),
(558, 53, 28, 2, 6703, 69),
(559, 53, 28, 3, 8534, 138),
(560, 53, 28, 4, 4992, 80),
(561, 53, 29, 1, 4532, 116),
(562, 53, 29, 2, 8129, 63),
(563, 53, 29, 3, 7321, 91),
(564, 53, 29, 4, 6002, 74),
(565, 54, 1, 1, 7234, 89),
(566, 54, 1, 2, 8456, 110),
(567, 54, 1, 3, 9142, 65),
(568, 54, 1, 4, 6532, 93),
(569, 54, 31, 1, 7845, 141),
(570, 54, 31, 2, 6523, 119),
(571, 54, 31, 3, 8121, 75),
(572, 54, 31, 4, 5967, 98),
(573, 55, 1, 1, 7123, 132),
(574, 55, 1, 2, 8543, 91),
(575, 55, 1, 3, 6387, 64),
(576, 55, 1, 4, 9124, 123),
(577, 55, 4, 1, 7514, 115),
(578, 55, 4, 2, 8932, 72),
(579, 55, 4, 3, 5231, 68),
(580, 55, 4, 4, 6118, 86),
(581, 55, 8, 1, 7823, 141),
(582, 55, 8, 2, 6954, 107),
(583, 55, 8, 3, 8432, 75),
(584, 55, 8, 4, 9131, 89),
(585, 55, 9, 1, 6234, 103),
(586, 55, 9, 2, 7453, 129),
(587, 55, 9, 3, 8321, 83),
(588, 55, 9, 4, 5123, 64),
(589, 56, 2, 1, 8412, 125),
(590, 56, 2, 2, 7324, 91),
(591, 56, 2, 3, 9123, 134),
(592, 56, 2, 4, 6543, 76),
(593, 57, 2, 1, 8123, 142),
(594, 57, 2, 2, 6542, 96),
(595, 57, 2, 3, 7431, 68),
(596, 57, 2, 4, 9214, 115),
(597, 58, 1, 1, 8932, 134),
(598, 58, 1, 2, 7543, 115),
(599, 58, 1, 3, 8214, 98),
(600, 58, 1, 4, 6123, 85),
(601, 58, 16, 1, 7432, 120),
(602, 58, 16, 2, 8345, 76),
(603, 58, 16, 3, 9124, 104),
(604, 58, 16, 4, 6243, 97),
(605, 58, 17, 1, 8123, 143),
(606, 58, 17, 2, 7453, 89),
(607, 58, 17, 3, 8932, 111),
(608, 58, 17, 4, 6721, 74),
(609, 58, 18, 1, 9412, 128),
(610, 58, 18, 2, 6123, 132),
(611, 58, 18, 3, 7542, 91),
(612, 58, 18, 4, 8134, 69),
(613, 59, 18, 1, 8423, 134),
(614, 59, 18, 2, 7312, 102),
(615, 59, 18, 3, 9143, 85),
(616, 59, 18, 4, 6821, 76),
(617, 59, 32, 1, 7234, 141),
(618, 59, 32, 2, 8531, 94),
(619, 59, 32, 3, 6542, 113),
(620, 59, 32, 4, 8123, 88),
(621, 60, 1, 1, 8432, 128),
(622, 60, 1, 2, 7214, 97),
(623, 60, 1, 3, 9123, 109),
(624, 60, 1, 4, 6543, 83),
(625, 60, 3, 1, 7321, 115),
(626, 60, 3, 2, 8132, 102),
(627, 60, 3, 3, 8914, 89),
(628, 60, 3, 4, 6254, 75),
(629, 60, 18, 1, 9412, 132),
(630, 60, 18, 2, 7341, 91),
(631, 60, 18, 3, 8123, 105),
(632, 60, 18, 4, 6723, 68),
(633, 61, 1, 26, 7423, 123),
(634, 61, 2, 26, 8931, 102),
(635, 62, 1, 26, 5872, 114),
(636, 62, 2, 26, 7365, 95),
(637, 63, 1, 26, 9432, 102),
(638, 63, 5, 26, 8125, 121),
(639, 63, 33, 26, 6429, 78),
(640, 64, 1, 26, 8327, 94),
(641, 64, 5, 26, 7645, 110),
(642, 64, 33, 26, 9214, 67),
(643, 65, 1, 26, 7341, 137),
(644, 65, 2, 26, 8924, 98),
(645, 65, 8, 26, 6421, 125),
(646, 66, 1, 26, 8239, 123),
(647, 66, 5, 26, 7524, 85),
(648, 67, 1, 26, 7341, 98),
(649, 67, 2, 26, 8213, 112),
(650, 67, 5, 26, 9632, 77),
(651, 68, 1, 26, 7426, 120),
(652, 68, 2, 26, 8328, 92),
(653, 69, 1, 26, 8245, 116),
(654, 69, 33, 26, 9132, 81),
(655, 70, 2, 26, 7530, 105),
(656, 70, 8, 26, 8412, 89),
(657, 71, 1, 26, 6541, 129),
(658, 72, 1, 26, 8437, 97),
(659, 72, 2, 26, 9134, 103),
(660, 73, 1, 26, 7924, 111),
(661, 73, 2, 26, 8537, 99),
(662, 73, 18, 26, 6245, 120),
(663, 74, 1, 26, 7452, 107),
(664, 75, 1, 26, 8542, 114),
(665, 75, 34, 26, 9137, 88),
(666, 76, 1, 26, 7654, 92),
(667, 77, 29, 26, 7624, 119),
(668, 77, 35, 26, 8319, 103),
(669, 77, 36, 26, 9237, 85),
(670, 78, 1, 26, 7236, 112),
(671, 78, 29, 26, 8124, 97),
(672, 78, 30, 26, 9317, 80),
(673, 79, 1, 26, 8135, 108),
(674, 79, 5, 26, 9246, 95),
(675, 79, 8, 26, 7425, 127),
(676, 79, 37, 26, 8430, 83),
(677, 80, 1, 26, 8342, 116),
(678, 80, 3, 26, 7913, 102),
(679, 81, 1, 26, 7912, 123),
(680, 81, 2, 26, 8734, 98),
(681, 82, 1, 26, 8357, 112),
(682, 82, 2, 26, 9241, 103),
(683, 83, 1, 26, 7524, 118),
(684, 83, 4, 26, 8316, 103),
(685, 83, 16, 26, 9125, 87),
(686, 84, 1, 26, 8231, 105),
(687, 84, 3, 26, 9126, 92),
(688, 84, 32, 26, 7438, 113),
(689, 85, 1, 26, 7325, 110),
(690, 85, 2, 26, 8213, 97),
(691, 86, 1, 26, 7435, 104),
(692, 86, 4, 26, 8312, 95),
(693, 86, 38, 26, 9124, 87),
(694, 87, 1, 26, 8316, 113),
(695, 87, 18, 26, 9135, 99),
(696, 87, 25, 26, 7421, 104),
(697, 88, 1, 26, 7436, 108),
(698, 88, 2, 26, 8312, 95),
(699, 88, 4, 26, 9125, 113),
(700, 88, 39, 26, 8234, 101),
(701, 88, 40, 26, 7437, 88),
(702, 89, 1, 26, 8324, 117),
(703, 89, 2, 26, 9136, 101),
(704, 89, 18, 26, 7432, 92),
(705, 90, 1, 26, 8213, 105),
(706, 90, 4, 26, 9124, 98),
(707, 90, 18, 26, 7436, 111),
(708, 91, 1, 18, 4321, 127),
(709, 91, 1, 19, 6723, 93),
(710, 91, 1, 20, 8124, 108),
(711, 91, 1, 21, 9762, 63),
(712, 91, 1, 22, 5987, 72),
(713, 91, 1, 23, 7311, 59),
(714, 91, 1, 24, 8902, 85),
(715, 91, 1, 25, 9634, 50),
(716, 91, 18, 18, 4321, 127),
(717, 91, 18, 19, 6723, 93),
(718, 91, 18, 20, 8124, 108),
(719, 91, 18, 21, 9762, 63),
(720, 91, 18, 22, 5987, 72),
(721, 91, 18, 23, 7311, 59),
(722, 91, 18, 24, 8902, 85),
(723, 91, 18, 25, 9634, 50),
(724, 92, 1, 18, 5231, 113),
(725, 92, 1, 19, 6718, 87),
(726, 92, 1, 20, 8123, 120),
(727, 92, 1, 21, 9683, 69),
(728, 92, 1, 22, 5892, 79),
(729, 92, 1, 23, 7354, 92),
(730, 92, 1, 24, 8231, 65),
(731, 92, 1, 25, 9376, 55),
(732, 92, 2, 18, 5231, 113),
(733, 92, 2, 19, 6718, 87),
(734, 92, 2, 20, 8123, 120),
(735, 92, 2, 21, 9683, 69),
(736, 92, 2, 22, 5892, 79),
(737, 92, 2, 23, 7354, 92),
(738, 92, 2, 24, 8231, 65),
(739, 92, 2, 25, 9376, 55),
(740, 93, 1, 18, 5231, 113),
(741, 93, 1, 19, 6718, 87),
(742, 93, 1, 20, 8119, 124),
(743, 93, 1, 21, 9683, 69),
(744, 93, 1, 22, 5892, 79),
(745, 93, 1, 23, 7354, 92),
(746, 93, 1, 24, 8231, 65),
(747, 93, 1, 25, 9376, 55),
(748, 94, 1, 18, 6123, 124),
(749, 94, 1, 19, 4723, 85),
(750, 94, 1, 20, 7321, 110),
(751, 94, 1, 21, 8543, 73),
(752, 94, 1, 22, 6298, 97),
(753, 94, 1, 23, 7182, 89),
(754, 94, 1, 24, 8912, 76),
(755, 94, 1, 25, 9831, 59),
(756, 94, 18, 18, 6213, 112),
(757, 94, 18, 19, 4832, 92),
(758, 94, 18, 20, 7931, 107),
(759, 94, 18, 21, 8742, 68),
(760, 94, 18, 22, 6543, 103),
(761, 94, 18, 23, 7359, 81),
(762, 94, 18, 24, 8217, 95),
(763, 94, 18, 25, 9128, 74),
(764, 95, 41, 18, 5123, 135),
(765, 95, 41, 19, 7231, 89),
(766, 95, 41, 20, 8412, 101),
(767, 95, 41, 21, 6937, 76),
(768, 95, 41, 22, 5876, 92),
(769, 95, 41, 23, 7648, 84),
(770, 95, 41, 24, 8237, 111),
(771, 95, 41, 25, 9318, 63),
(772, 96, 3, 18, 5432, 124),
(773, 96, 3, 19, 6879, 91),
(774, 96, 3, 20, 7943, 115),
(775, 96, 3, 21, 8124, 67),
(776, 96, 3, 22, 6598, 102),
(777, 96, 3, 23, 7345, 89),
(778, 96, 3, 24, 8231, 76),
(779, 96, 3, 25, 9142, 58),
(780, 97, 1, 18, 5213, 134),
(781, 97, 1, 19, 6724, 87),
(782, 97, 1, 20, 7931, 120),
(783, 97, 1, 21, 8421, 72),
(784, 97, 1, 22, 6543, 98),
(785, 97, 1, 23, 7187, 84),
(786, 97, 1, 24, 8356, 113),
(787, 97, 1, 25, 9234, 67),
(788, 97, 18, 18, 4931, 120),
(789, 97, 18, 19, 7235, 95),
(790, 97, 18, 20, 8126, 108),
(791, 97, 18, 21, 6348, 61),
(792, 97, 18, 22, 5983, 104),
(793, 97, 18, 23, 7432, 77),
(794, 97, 18, 24, 8923, 99),
(795, 97, 18, 25, 9612, 65),
(796, 98, 1, 18, 5321, 118),
(797, 98, 1, 19, 6742, 93),
(798, 98, 1, 20, 7823, 107),
(799, 98, 1, 21, 8435, 75),
(800, 98, 1, 22, 6952, 89),
(801, 98, 1, 23, 7598, 124),
(802, 98, 1, 24, 8234, 63),
(803, 98, 1, 25, 9146, 97),
(804, 98, 11, 18, 4823, 132),
(805, 98, 11, 19, 7315, 86),
(806, 98, 11, 20, 8042, 110),
(807, 98, 11, 21, 6184, 70),
(808, 98, 11, 22, 5913, 102),
(809, 98, 11, 23, 7328, 78),
(810, 98, 11, 24, 8491, 92),
(811, 98, 11, 25, 9057, 56),
(812, 99, 2, 18, 5124, 110),
(813, 99, 2, 19, 6741, 92),
(814, 99, 2, 20, 7523, 105),
(815, 99, 2, 21, 8231, 77),
(816, 99, 2, 22, 6954, 98),
(817, 99, 2, 23, 7498, 84),
(818, 99, 2, 24, 8612, 116),
(819, 99, 2, 25, 9275, 63),
(820, 100, 42, 18, 6342, 115),
(821, 100, 42, 19, 7432, 97),
(822, 100, 42, 20, 8123, 108),
(823, 100, 42, 21, 9031, 74),
(824, 100, 42, 22, 7124, 92),
(825, 100, 42, 23, 8145, 85),
(826, 100, 42, 24, 9032, 111),
(827, 100, 42, 25, 9826, 63),
(828, 101, 1, 15, 6453, 102),
(829, 101, 1, 16, 7532, 95),
(830, 101, 1, 17, 8431, 108),
(831, 101, 1, 18, 9312, 76),
(832, 101, 1, 19, 7123, 100),
(833, 101, 1, 20, 8245, 89),
(834, 101, 2, 15, 5312, 110),
(835, 101, 2, 16, 6843, 92),
(836, 101, 2, 17, 7924, 106),
(837, 101, 2, 18, 8527, 85),
(838, 101, 2, 19, 6245, 108),
(839, 101, 2, 20, 7371, 63),
(840, 102, 33, 15, 6431, 125),
(841, 102, 33, 16, 7243, 109),
(842, 102, 33, 17, 8312, 97),
(843, 102, 33, 18, 9204, 88),
(844, 102, 33, 19, 7345, 111),
(845, 102, 33, 20, 8061, 77),
(846, 103, 1, 15, 6574, 108),
(847, 103, 1, 16, 7321, 92),
(848, 103, 1, 17, 8032, 116),
(849, 103, 1, 18, 9134, 79),
(850, 103, 1, 19, 7341, 103),
(851, 103, 1, 20, 8146, 67),
(852, 103, 2, 15, 5126, 95),
(853, 103, 2, 16, 6437, 109),
(854, 103, 2, 17, 7835, 98),
(855, 103, 2, 18, 8542, 112),
(856, 103, 2, 19, 6911, 100),
(857, 103, 2, 20, 7325, 85),
(858, 104, 17, 15, 6342, 112),
(859, 104, 17, 16, 7451, 97),
(860, 104, 17, 17, 8036, 108),
(861, 104, 17, 18, 9163, 75),
(862, 104, 17, 19, 7328, 101),
(863, 104, 17, 20, 8065, 86),
(864, 105, 43, 15, 6423, 109),
(865, 105, 43, 16, 7231, 95),
(866, 105, 43, 17, 8112, 106),
(867, 105, 43, 18, 9003, 79),
(868, 105, 43, 19, 7327, 102),
(869, 105, 43, 20, 8041, 87),
(870, 106, 1, 15, 7321, 105),
(871, 106, 1, 16, 8045, 91),
(872, 106, 1, 17, 9213, 109),
(873, 106, 1, 18, 6378, 98),
(874, 106, 1, 19, 7385, 113),
(875, 106, 1, 20, 8267, 85),
(876, 106, 18, 15, 6542, 97),
(877, 106, 18, 16, 7328, 108),
(878, 106, 18, 17, 8034, 93),
(879, 106, 18, 18, 9124, 101),
(880, 106, 18, 19, 7472, 105),
(881, 106, 18, 20, 8392, 80),
(882, 106, 44, 15, 6125, 112),
(883, 106, 44, 16, 7154, 95),
(884, 106, 44, 17, 8237, 107),
(885, 106, 44, 18, 9114, 92),
(886, 106, 44, 19, 7634, 103),
(887, 106, 44, 20, 8342, 90),
(888, 107, 45, 15, 6215, 103),
(889, 107, 45, 16, 7248, 95),
(890, 107, 45, 17, 8152, 107),
(891, 107, 45, 18, 9125, 82),
(892, 107, 45, 19, 7361, 110),
(893, 107, 45, 20, 8033, 76),
(894, 107, 46, 15, 6342, 108),
(895, 107, 46, 16, 7421, 101),
(896, 107, 46, 17, 8267, 93),
(897, 107, 46, 18, 9133, 99),
(898, 107, 46, 19, 7254, 112),
(899, 107, 46, 20, 8038, 85),
(900, 108, 18, 15, 6125, 118),
(901, 108, 18, 16, 7348, 102),
(902, 108, 18, 17, 8245, 95),
(903, 108, 18, 18, 9133, 108),
(904, 108, 18, 19, 7352, 111),
(905, 108, 18, 20, 8034, 90),
(906, 109, 1, 15, 6342, 105),
(907, 109, 1, 16, 7349, 92),
(908, 109, 1, 17, 8112, 108),
(909, 109, 1, 18, 9010, 99),
(910, 109, 1, 19, 7364, 113),
(911, 109, 1, 20, 8043, 80),
(912, 110, 2, 15, 6128, 102),
(913, 110, 2, 16, 7369, 107),
(914, 110, 2, 17, 8234, 91),
(915, 110, 2, 18, 9117, 114),
(916, 110, 2, 19, 7373, 105),
(917, 110, 2, 20, 8045, 88),
(918, 111, 3, 27, 1944, 73),
(919, 111, 3, 28, 6840, 105),
(920, 111, 3, 29, 2891, 122),
(921, 112, 42, 27, 7368, 122),
(922, 112, 42, 28, 8295, 117),
(923, 112, 42, 29, 5627, 94),
(924, 113, 33, 27, 5162, 142),
(925, 113, 33, 28, 3733, 127),
(926, 113, 33, 29, 9574, 111),
(927, 114, 4, 27, 2357, 109),
(928, 114, 4, 28, 6811, 119),
(929, 114, 4, 29, 8316, 124),
(930, 114, 9, 27, 7512, 138),
(931, 114, 9, 28, 4145, 93),
(932, 114, 9, 29, 6660, 55),
(933, 114, 18, 27, 5289, 121),
(934, 114, 18, 28, 8540, 99),
(935, 114, 18, 29, 1392, 106),
(936, 115, 3, 27, 4692, 88),
(937, 115, 3, 28, 7614, 117),
(938, 115, 3, 29, 2768, 113),
(939, 115, 5, 27, 8521, 106),
(940, 115, 5, 28, 5838, 120),
(941, 115, 5, 29, 4976, 67),
(942, 115, 9, 27, 1962, 98),
(943, 115, 9, 28, 7420, 110),
(944, 115, 9, 29, 8933, 88),
(945, 116, 9, 27, 6243, 112),
(946, 116, 9, 28, 4731, 99),
(947, 116, 9, 29, 5368, 120),
(948, 116, 20, 27, 7526, 125),
(949, 116, 20, 28, 8924, 109),
(950, 116, 20, 29, 6139, 118),
(951, 117, 18, 30, 6473, 132),
(952, 117, 18, 31, 8121, 3057),
(953, 118, 18, 30, 4823, 117),
(954, 118, 18, 31, 7349, 108),
(955, 119, 2, 30, 9272, 129),
(956, 119, 2, 31, 5782, 94),
(957, 120, 2, 30, 6325, 105),
(958, 120, 2, 31, 4763, 112),
(959, 121, 2, 26, 5910, 120),
(960, 121, 17, 26, 4837, 101),
(961, 122, 2, 26, 6842, 113),
(962, 122, 5, 26, 5713, 106),
(963, 123, 1, 26, 8192, 122),
(964, 123, 2, 26, 6425, 108),
(965, 124, 47, 26, 7541, 112),
(966, 125, 47, 26, 6812, 118),
(967, 126, 47, 26, 5832, 106),
(968, 127, 47, 26, 4937, 98),
(969, 128, 47, 26, 7421, 110),
(970, 129, 7, 26, 5631, 116),
(971, 130, 47, 26, 6849, 120),
(972, 131, 1, 26, 5926, 109),
(973, 132, 2, 26, 7421, 123),
(974, 132, 3, 26, 5184, 109),
(975, 133, 18, 26, 6387, 114),
(976, 134, 1, 26, 7214, 125),
(977, 135, 1, 26, 5492, 118),
(978, 136, 1, 26, 6345, 105),
(979, 137, 18, 26, 7123, 120),
(980, 138, 1, 26, 5893, 112),
(981, 139, 1, 26, 6432, 118),
(982, 139, 18, 26, 7218, 114),
(983, 140, 18, 26, 6940, 123),
(984, 141, 1, 26, 7821, 125),
(985, 141, 2, 26, 6794, 118),
(986, 142, 1, 26, 5310, 112),
(987, 142, 2, 26, 6478, 119),
(988, 143, 1, 26, 6724, 118),
(989, 143, 2, 26, 5937, 110),
(990, 144, 1, 26, 7622, 121),
(991, 144, 2, 26, 6841, 115),
(992, 145, 1, 26, 6342, 112),
(993, 145, 4, 26, 7419, 117),
(994, 145, 18, 26, 5619, 110),
(995, 145, 38, 26, 4832, 108),
(996, 146, 1, 26, 6543, 120),
(997, 146, 2, 26, 5784, 115),
(998, 147, 1, 26, 7182, 124),
(999, 147, 11, 26, 6349, 117),
(1000, 148, 1, 26, 6425, 119),
(1001, 148, 44, 26, 377, 5113),
(1002, 148, 45, 26, 7214, 125),
(1003, 149, 1, 26, 5871, 115),
(1004, 149, 45, 26, 6712, 120),
(1005, 150, 1, 26, 7483, 122),
(1006, 150, 45, 26, 6157, 118),
(1007, 151, 1, 26, 10, 0),
(1008, 151, 2, 26, 15, 0);

--
-- Bẫy `product_details`
--
DELIMITER $$
CREATE TRIGGER `update_sold_quantity_sum_after_delete` AFTER DELETE ON `product_details` FOR EACH ROW BEGIN
    UPDATE products 
    SET sold_quantity_sum = (
        SELECT SUM(sold_quantity)
        FROM product_details
        WHERE product_id = OLD.product_id
    )
    WHERE product_id = OLD.product_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_sold_quantity_sum_after_insert` AFTER INSERT ON `product_details` FOR EACH ROW BEGIN
    UPDATE products 
    SET sold_quantity_sum = (
        SELECT SUM(sold_quantity)
        FROM product_details
        WHERE product_id = NEW.product_id
    )
    WHERE product_id = NEW.product_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_sold_quantity_sum_after_update` AFTER UPDATE ON `product_details` FOR EACH ROW BEGIN
    UPDATE products 
    SET sold_quantity_sum = (
        SELECT SUM(sold_quantity)
        FROM product_details
        WHERE product_id = NEW.product_id
    )
    WHERE product_id = NEW.product_id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_images`
--

CREATE TABLE `product_images` (
  `image_id` int(9) NOT NULL,
  `product_id` int(9) NOT NULL,
  `image` varchar(255) NOT NULL,
  `is_default` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `product_images`
--

INSERT INTO `product_images` (`image_id`, `product_id`, `image`, `is_default`) VALUES
(1, 1, '/uploads/product_images/67d444116b3cf_den.webp', b'1'),
(2, 1, '/uploads/product_images/67d44417ac620_be.webp', b'0'),
(3, 2, '/uploads/product_images/67d44444b6130_den.webp', b'1'),
(4, 3, '/uploads/product_images/67d444541e2af_den.jpg', b'1'),
(5, 3, '/uploads/product_images/67d44459c303e_ghi.jpg', b'0'),
(6, 4, '/uploads/product_images/67d444699dd6a_den.webp', b'1'),
(7, 4, '/uploads/product_images/67d4446f26100_trang.webp', b'0'),
(8, 4, '/uploads/product_images/67d444744b2a3_xanh-la.webp', b'0'),
(9, 5, '/uploads/product_images/67d444837eb44_den.webp', b'1'),
(10, 5, '/uploads/product_images/67d4448a226eb_xanh-duong.webp', b'0'),
(11, 5, '/uploads/product_images/67d444912040c_hong.webp', b'0'),
(12, 6, '/uploads/product_images/67d444dc24b7b_be.webp', b'1'),
(13, 6, '/uploads/product_images/67d444e17bf98_ca-phe.webp', b'0'),
(14, 6, '/uploads/product_images/67d444e57db42_den.webp', b'0'),
(15, 7, '/uploads/product_images/67d444f49da84_den.webp', b'1'),
(16, 7, '/uploads/product_images/67d444fa985af_xam.webp', b'0'),
(17, 8, '/uploads/product_images/67d44508b66f5_den.jpg', b'1'),
(18, 9, '/uploads/product_images/67d4452e9fa70_kem-1.webp', b'1'),
(19, 9, '/uploads/product_images/67d445337f3de_kem-2.webp', b'0'),
(20, 9, '/uploads/product_images/67d44539236d5_kem-3.webp', b'0'),
(21, 10, '/uploads/product_images/67d445470cdb4_kem.jpg', b'1'),
(22, 10, '/uploads/product_images/67d4454b281a6_navy.jpg', b'0'),
(23, 11, '/uploads/product_images/67d4455df1b3f_xam.webp', b'1'),
(24, 11, '/uploads/product_images/67d445657b86b_den.webp', b'0'),
(25, 11, '/uploads/product_images/67d4456a86f68_xanh-navy.webp', b'0'),
(26, 11, '/uploads/product_images/67d4456ec4b34_be-nhat.webp', b'0'),
(27, 12, '/uploads/product_images/67d44588b0564_xam.webp', b'1'),
(28, 12, '/uploads/product_images/67d445903fc8c_xanh-den.webp', b'0'),
(29, 12, '/uploads/product_images/67d445959323a_den.webp', b'0'),
(30, 13, '/uploads/product_images/67d445a43303c_den.webp', b'1'),
(31, 13, '/uploads/product_images/67d445a80a5a7_do.webp', b'0'),
(32, 13, '/uploads/product_images/67d445ac3e6ba_ghi.webp', b'0'),
(33, 13, '/uploads/product_images/67d445b29a00f_nau.webp', b'0'),
(34, 13, '/uploads/product_images/67d445b7dc513_xam.webp', b'0'),
(35, 13, '/uploads/product_images/67d445bd99933_xanh-than.webp', b'0'),
(36, 14, '/uploads/product_images/67d445da08380_den.webp', b'1'),
(37, 14, '/uploads/product_images/67d445de23467_nau.webp', b'0'),
(38, 14, '/uploads/product_images/67d445e2533d9_trang.webp', b'0'),
(39, 14, '/uploads/product_images/67d445e74b0ad_xanh-reu.webp', b'0'),
(40, 15, '/uploads/product_images/67d4462312076_den.webp', b'1'),
(41, 15, '/uploads/product_images/67d4462753cce_ghi.webp', b'0'),
(42, 15, '/uploads/product_images/67d4462bc4f7c_trang.webp', b'0'),
(43, 16, '/uploads/product_images/67d4467c7337a_be.webp', b'1'),
(44, 16, '/uploads/product_images/67d4468098b13_den.webp', b'0'),
(45, 16, '/uploads/product_images/67d4468504c40_xam.webp', b'0'),
(46, 17, '/uploads/product_images/67d4469a1e150_be.webp', b'1'),
(47, 17, '/uploads/product_images/67d4469eb86f6_den.webp', b'0'),
(48, 17, '/uploads/product_images/67d446a4cdfdd_trang.webp', b'0'),
(49, 17, '/uploads/product_images/67d446aa210ec_xam.webp', b'0'),
(50, 18, '/uploads/product_images/67d446c7c38bf_den.jpg', b'1'),
(51, 19, '/uploads/product_images/67d446e00f0d2_xanh-reu.webp', b'1'),
(52, 19, '/uploads/product_images/67d446e49f36a_xam.webp', b'0'),
(53, 20, '/uploads/product_images/67d446f11d414_den.webp', b'1'),
(54, 20, '/uploads/product_images/67d446f5cb764_xam-dam.webp', b'0'),
(55, 20, '/uploads/product_images/67d446f977180_xam-trang.webp', b'0'),
(56, 21, '/uploads/product_images/67d44705d7393_den.webp', b'1'),
(57, 21, '/uploads/product_images/67d4470a343b7_ghi-tan.webp', b'0'),
(58, 21, '/uploads/product_images/67d4470ebf69a_xam-chi.webp', b'0'),
(59, 22, '/uploads/product_images/67d4472342244_be.jpg', b'1'),
(60, 22, '/uploads/product_images/67d447276ca59_den.jpg', b'0'),
(61, 22, '/uploads/product_images/67d44730dd547_trang.jpg', b'0'),
(62, 23, '/uploads/product_images/67d447475a13a_den.webp', b'1'),
(63, 23, '/uploads/product_images/67d4474bcac60_ghi.webp', b'0'),
(64, 23, '/uploads/product_images/67d4475098fe3_trang.webp', b'0'),
(65, 24, '/uploads/product_images/67d44763d83b6_den.webp', b'1'),
(66, 24, '/uploads/product_images/67d44767d4ba5_trang.webp', b'0'),
(67, 25, '/uploads/product_images/67d447735ed61_den.webp', b'1'),
(68, 25, '/uploads/product_images/67d447772b06c_trang.webp', b'0'),
(69, 25, '/uploads/product_images/67d4477aecee3_xam.webp', b'0'),
(70, 26, '/uploads/product_images/67d44786d1823_den.webp', b'1'),
(71, 26, '/uploads/product_images/67d4478ae38b7_trang.webp', b'0'),
(72, 27, '/uploads/product_images/67d4479720ccd_be.webp', b'1'),
(73, 27, '/uploads/product_images/67d4479b68ce4_den.webp', b'0'),
(74, 27, '/uploads/product_images/67d4479f43f49_ghi.webp', b'0'),
(75, 28, '/uploads/product_images/67d447b0c2ffe_den.webp', b'1'),
(76, 28, '/uploads/product_images/67d447b47595c_trang.webp', b'0'),
(77, 28, '/uploads/product_images/67d447b8ab6f5_xanh-reu.webp', b'0'),
(78, 29, '/uploads/product_images/67d447c89a20a_den.webp', b'1'),
(79, 29, '/uploads/product_images/67d447cc5067f_trang.webp', b'0'),
(80, 30, '/uploads/product_images/67d447dc4263d_trang.webp', b'1'),
(81, 30, '/uploads/product_images/67d447dfc479e_den.webp', b'0'),
(82, 31, '/uploads/product_images/67d447f719ba2_den.webp', b'1'),
(83, 31, '/uploads/product_images/67d447fb2f0ac_trang.webp', b'0'),
(84, 32, '/uploads/product_images/67d4480be6ee4_den.webp', b'1'),
(85, 32, '/uploads/product_images/67d44810ec583_be.webp', b'0'),
(86, 33, '/uploads/product_images/67d4481e6912b_den.webp', b'1'),
(87, 33, '/uploads/product_images/67d448223c22d_trang-kem.webp', b'0'),
(88, 34, '/uploads/product_images/67d4482c3e085_den.webp', b'1'),
(89, 34, '/uploads/product_images/67d4483046a16_nau-be.webp', b'0'),
(90, 34, '/uploads/product_images/67d448345607e_nau-reu.webp', b'0'),
(91, 34, '/uploads/product_images/67d44839cadab_trang-sua.webp', b'0'),
(92, 34, '/uploads/product_images/67d4483fbbcac_xanh-ngoc.webp', b'0'),
(93, 35, '/uploads/product_images/67d4484b9253e_den.webp', b'1'),
(94, 35, '/uploads/product_images/67d4484f82da8_kem.webp', b'0'),
(95, 36, '/uploads/product_images/67d4485f5ffee_den.webp', b'1'),
(96, 36, '/uploads/product_images/67d44863bc285_trang-sua.webp', b'0'),
(97, 37, '/uploads/product_images/67d4487560978_be.webp', b'1'),
(98, 37, '/uploads/product_images/67d44879992da_den.webp', b'0'),
(99, 37, '/uploads/product_images/67d4487e10535_trang.webp', b'0'),
(100, 38, '/uploads/product_images/67d4488f97e10_den.webp', b'1'),
(101, 38, '/uploads/product_images/67d4489380d39_trang.webp', b'0'),
(102, 39, '/uploads/product_images/67d4489eb65e7_xanh-navy.jpg', b'1'),
(103, 40, '/uploads/product_images/67d448ad72a79_den-1.webp', b'1'),
(104, 40, '/uploads/product_images/67d448b167c5a_den-2.webp', b'0'),
(105, 40, '/uploads/product_images/67d448b59dd12_den-3.webp', b'0'),
(106, 40, '/uploads/product_images/67d448ba063a2_den-4.webp', b'0'),
(107, 41, '/uploads/product_images/67d4491d8cdce_trang.webp', b'1'),
(108, 41, '/uploads/product_images/67d449220a38d_den.webp', b'0'),
(109, 41, '/uploads/product_images/67d44926a064e_xam.webp', b'0'),
(110, 42, '/uploads/product_images/67d4493527021_trang.webp', b'1'),
(111, 42, '/uploads/product_images/67d44939656cf_tim.webp', b'0'),
(112, 42, '/uploads/product_images/67d4494036096_hong.webp', b'0'),
(113, 43, '/uploads/product_images/67d4494d64a80_be.webp', b'1'),
(114, 43, '/uploads/product_images/67d449526292e_den.webp', b'0'),
(115, 43, '/uploads/product_images/67d44956cd6bb_ghi.webp', b'0'),
(116, 43, '/uploads/product_images/67d4495b4059b_kem.webp', b'0'),
(117, 43, '/uploads/product_images/67d4495f9c23b_nau.webp', b'0'),
(118, 43, '/uploads/product_images/67d44963656dd_xam.webp', b'0'),
(119, 44, '/uploads/product_images/67d449780bdb7_den.webp', b'1'),
(120, 44, '/uploads/product_images/67d4497c37a45_xam-chi.webp', b'0'),
(121, 44, '/uploads/product_images/67d4498080950_xam-dam.webp', b'0'),
(122, 44, '/uploads/product_images/67d4498439a0d_xam-nhat.webp', b'0'),
(123, 45, '/uploads/product_images/67d4499cee0ce_be.webp', b'1'),
(124, 45, '/uploads/product_images/67d449a1117bc_den.webp', b'0'),
(125, 45, '/uploads/product_images/67d449a5f2acc_hong.webp', b'0'),
(126, 45, '/uploads/product_images/67d449abdfb2b_nau.webp', b'0'),
(127, 45, '/uploads/product_images/67d449afe645b_trang.webp', b'0'),
(128, 46, '/uploads/product_images/67d449c2672b0_den.webp', b'1'),
(129, 46, '/uploads/product_images/67d449c65e2c4_ghi.webp', b'0'),
(130, 46, '/uploads/product_images/67d449ca5f0cf_nau.webp', b'0'),
(131, 47, '/uploads/product_images/67d449dbdf305_den-1.webp', b'1'),
(132, 47, '/uploads/product_images/67d449df65ac5_den-2.webp', b'0'),
(133, 47, '/uploads/product_images/67d449e2f2357_den-3.webp', b'0'),
(134, 48, '/uploads/product_images/67d449f39b28b_den.webp', b'1'),
(135, 48, '/uploads/product_images/67d449f75b7bd_xam.webp', b'0'),
(136, 49, '/uploads/product_images/67d44a0ba1f31_den.webp', b'1'),
(137, 49, '/uploads/product_images/67d44a0fb246a_xam.webp', b'0'),
(138, 50, '/uploads/product_images/67d44a1e6005a_den.webp', b'1'),
(139, 50, '/uploads/product_images/67d44a21e6995_do.webp', b'0'),
(140, 50, '/uploads/product_images/67d44a2538a1b_hong.webp', b'0'),
(141, 50, '/uploads/product_images/67d44a2913d5d_trang.webp', b'0'),
(142, 51, '/uploads/product_images/67d44a39268c9_den-1.webp', b'1'),
(143, 51, '/uploads/product_images/67d44a3d5495a_den-2.webp', b'0'),
(144, 52, '/uploads/product_images/67d44a4a079cf_nau.webp', b'1'),
(145, 52, '/uploads/product_images/67d44a4ea2994_xanh-la.webp', b'0'),
(146, 53, '/uploads/product_images/67d44a5c98eff_nau.webp', b'1'),
(147, 53, '/uploads/product_images/67d44a6071a0b_tim.webp', b'0'),
(148, 53, '/uploads/product_images/67d44a66523f4_xanh-ngoc.webp', b'0'),
(149, 53, '/uploads/product_images/67d44a6d20d47_xanh-than.webp', b'0'),
(150, 54, '/uploads/product_images/67d44a7b0d4d7_den.webp', b'1'),
(151, 54, '/uploads/product_images/67d44a7f6b75f_nude.webp', b'0'),
(152, 55, '/uploads/product_images/67d44a8fc8196_be.webp', b'1'),
(153, 55, '/uploads/product_images/67d44a94068a3_den.webp', b'0'),
(154, 55, '/uploads/product_images/67d44a97dc282_ghi.webp', b'0'),
(155, 55, '/uploads/product_images/67d44a9c4bc74_hong.webp', b'0'),
(156, 56, '/uploads/product_images/67d44aab798b3_trang-1.webp', b'1'),
(157, 56, '/uploads/product_images/67d44ab1e35ec_trang-2.webp', b'0'),
(158, 56, '/uploads/product_images/67d44ab5797ab_trang-3.webp', b'0'),
(159, 57, '/uploads/product_images/67d44ac688785_trang-1.webp', b'1'),
(160, 57, '/uploads/product_images/67d44aca6f7e2_trang-2.webp', b'0'),
(161, 58, '/uploads/product_images/67d44ad9128b0_den.webp', b'1'),
(162, 58, '/uploads/product_images/67d44adccb4fb_do.webp', b'0'),
(163, 58, '/uploads/product_images/67d44ae05077d_nau.webp', b'0'),
(164, 58, '/uploads/product_images/67d44ae4bdd86_xanh-than.webp', b'0'),
(165, 59, '/uploads/product_images/67d44af8ee51b_nau.webp', b'1'),
(166, 59, '/uploads/product_images/67d44afd25cfb_xanh.webp', b'0'),
(167, 60, '/uploads/product_images/67d44b0c042b4_den.webp', b'1'),
(168, 60, '/uploads/product_images/67d44b0fd4ac6_nau.webp', b'0'),
(169, 60, '/uploads/product_images/67d44b1377e13_xam.webp', b'0'),
(170, 61, '/uploads/product_images/67d44b2c5835d_den.webp', b'1'),
(171, 61, '/uploads/product_images/67d44b3011bc7_trang.webp', b'0'),
(172, 62, '/uploads/product_images/67d44b3b23787_den.webp', b'1'),
(173, 62, '/uploads/product_images/67d44b3ecb384_trang.webp', b'0'),
(174, 63, '/uploads/product_images/67d44b4bbd3e9_bac.webp', b'1'),
(175, 63, '/uploads/product_images/67d44b4f598e5_den.webp', b'0'),
(176, 63, '/uploads/product_images/67d44b535f1fe_vang.webp', b'0'),
(177, 64, '/uploads/product_images/67d44b6380dc0_bac.webp', b'1'),
(178, 64, '/uploads/product_images/67d44b67bb20c_den.webp', b'0'),
(179, 64, '/uploads/product_images/67d44b6b85ce3_vang.webp', b'0'),
(180, 65, '/uploads/product_images/67d44b7c9a7f0_den.webp', b'1'),
(181, 65, '/uploads/product_images/67d44b81a90cb_hong.webp', b'0'),
(182, 65, '/uploads/product_images/67d44b85d7cb4_trang.webp', b'0'),
(183, 66, '/uploads/product_images/67d44b94b8826_den.webp', b'1'),
(184, 66, '/uploads/product_images/67d44b9957900_vang.webp', b'0'),
(185, 67, '/uploads/product_images/67d44ba58d282_den.webp', b'1'),
(186, 67, '/uploads/product_images/67d44ba9d0cc7_trang.webp', b'0'),
(187, 67, '/uploads/product_images/67d44bae17e48_vang.webp', b'0'),
(188, 68, '/uploads/product_images/67d44bb916d94_den.webp', b'1'),
(189, 68, '/uploads/product_images/67d44bbcbedad_trang.webp', b'0'),
(190, 69, '/uploads/product_images/67d44bc897b55_bac.webp', b'1'),
(191, 69, '/uploads/product_images/67d44bcc433ca_den.webp', b'0'),
(192, 70, '/uploads/product_images/67d44bda07473_hong.webp', b'1'),
(193, 70, '/uploads/product_images/67d44bde28f8f_trang.webp', b'0'),
(194, 71, '/uploads/product_images/67d44be94f37b_den.webp', b'1'),
(195, 72, '/uploads/product_images/67d44bf543da9_den.webp', b'1'),
(196, 72, '/uploads/product_images/67d44bf8ef809_trang.webp', b'0'),
(197, 73, '/uploads/product_images/67d44c042c733_den.webp', b'1'),
(198, 73, '/uploads/product_images/67d44c078a8ee_nau.webp', b'0'),
(199, 73, '/uploads/product_images/67d44c0b0b181_trang.webp', b'0'),
(200, 74, '/uploads/product_images/67d44c16dc205_den.webp', b'1'),
(201, 75, '/uploads/product_images/67d44c21d5d1d_den.webp', b'1'),
(202, 75, '/uploads/product_images/67d44c268d982_trang-nga.webp', b'0'),
(203, 76, '/uploads/product_images/67d44c3e128eb_den-1.webp', b'0'),
(204, 76, '/uploads/product_images/67d44c42b35e0_den-2.webp', b'1'),
(205, 77, '/uploads/product_images/67d44c55e4180_cam.webp', b'1'),
(206, 77, '/uploads/product_images/67d44c59aa712_rieu.webp', b'0'),
(207, 77, '/uploads/product_images/67d44c5d7eae8_tim.webp', b'0'),
(208, 78, '/uploads/product_images/67d44c681e1ea_den.webp', b'1'),
(209, 78, '/uploads/product_images/67d44c6b64a6a_tim.webp', b'0'),
(210, 78, '/uploads/product_images/67d44c6ed8028_xam-nhat.webp', b'0'),
(211, 79, '/uploads/product_images/67d44c7b4789d_den.webp', b'1'),
(212, 79, '/uploads/product_images/67d44c7f26cc0_hong.webp', b'0'),
(213, 79, '/uploads/product_images/67d44c8350f05_khoi.webp', b'0'),
(214, 79, '/uploads/product_images/67d44c8720448_vang.webp', b'0'),
(215, 80, '/uploads/product_images/67d44c94546f0_den.webp', b'1'),
(216, 80, '/uploads/product_images/67d44c97cea75_xam.webp', b'0'),
(217, 81, '/uploads/product_images/67d44ca1b7c71_den.webp', b'1'),
(218, 81, '/uploads/product_images/67d44ca509297_trang.webp', b'0'),
(219, 82, '/uploads/product_images/67d44caf84061_den.webp', b'1'),
(220, 82, '/uploads/product_images/67d44cb358fa4_trang.webp', b'0'),
(221, 83, '/uploads/product_images/67d44cbd24c6c_be.webp', b'1'),
(222, 83, '/uploads/product_images/67d44cc09388f_den.webp', b'0'),
(223, 83, '/uploads/product_images/67d44cc45c879_xanh-than.webp', b'0'),
(224, 84, '/uploads/product_images/67d44cd09c9fb_den.webp', b'1'),
(225, 84, '/uploads/product_images/67d44cd452446_xam.webp', b'0'),
(226, 84, '/uploads/product_images/67d44cd806ecd_xanh.webp', b'0'),
(227, 85, '/uploads/product_images/67d44ce29429d_den.webp', b'1'),
(228, 85, '/uploads/product_images/67d44ce66a240_trang.webp', b'0'),
(229, 86, '/uploads/product_images/67d44cf186cd0_be.webp', b'1'),
(230, 86, '/uploads/product_images/67d44cf4e6175_den.webp', b'0'),
(231, 86, '/uploads/product_images/67d44cf8699b7_kaki.webp', b'0'),
(232, 87, '/uploads/product_images/67d44d042737f_den.webp', b'1'),
(233, 87, '/uploads/product_images/67d44d077d77b_nau.webp', b'0'),
(234, 87, '/uploads/product_images/67d44d0ac6116_trang-sua.webp', b'0'),
(235, 88, '/uploads/product_images/67d44d1633885_be.webp', b'1'),
(236, 88, '/uploads/product_images/67d44d19b5a27_cafe.webp', b'0'),
(237, 88, '/uploads/product_images/67d44d1d74338_den.webp', b'0'),
(238, 88, '/uploads/product_images/67d44d2191491_tim-than.webp', b'0'),
(239, 88, '/uploads/product_images/67d44d2798251_trang.webp', b'0'),
(240, 89, '/uploads/product_images/67d44d34eb7ab_den.webp', b'1'),
(241, 89, '/uploads/product_images/67d44d38b8f30_nau.webp', b'0'),
(242, 89, '/uploads/product_images/67d44d3c1f6c2_trang.webp', b'0'),
(243, 90, '/uploads/product_images/67d44d499a4f7_be.webp', b'1'),
(244, 90, '/uploads/product_images/67d44d4d1772c_den.webp', b'0'),
(245, 90, '/uploads/product_images/67d44d5094023_nau.webp', b'0'),
(246, 91, '/uploads/product_images/67d44d6b75f62_den.webp', b'1'),
(247, 91, '/uploads/product_images/67d44d6ed4bc6_nau.webp', b'0'),
(248, 92, '/uploads/product_images/67d44d78b4ba9_den.webp', b'1'),
(249, 92, '/uploads/product_images/67d44d7c62636_trang.webp', b'0'),
(250, 93, '/uploads/product_images/67d44d8a6b133_den-1.webp', b'1'),
(251, 93, '/uploads/product_images/67d44d8ecc2a0_den-2.webp', b'0'),
(252, 93, '/uploads/product_images/67d44d92adc32_den-3.webp', b'0'),
(253, 94, '/uploads/product_images/67d44da42042e_den.webp', b'1'),
(254, 94, '/uploads/product_images/67d44da7de9c8_nau.webp', b'0'),
(255, 95, '/uploads/product_images/67d44dbc250e1_trang-xanh-1.webp', b'1'),
(256, 95, '/uploads/product_images/67d44dc03f761_trang-xanh-2.webp', b'0'),
(257, 96, '/uploads/product_images/67d44dca45ae5_xam-1.webp', b'1'),
(258, 96, '/uploads/product_images/67d44dcd922d0_xam-2.webp', b'0'),
(259, 97, '/uploads/product_images/67d44dda25ac5_den.png', b'1'),
(260, 97, '/uploads/product_images/67d44ddf1986d_nau.png', b'0'),
(261, 98, '/uploads/product_images/67d44de9478c6_den.webp', b'1'),
(262, 98, '/uploads/product_images/67d44decb0221_kem.webp', b'0'),
(263, 99, '/uploads/product_images/67d44df72b5f9_trang-1.webp', b'1'),
(264, 99, '/uploads/product_images/67d44dfb53a9f_trang-2.webp', b'0'),
(265, 100, '/uploads/product_images/67d44e05052e9_den-trang-1.webp', b'1'),
(266, 100, '/uploads/product_images/67d44e085dccd_den-trang-2.webp', b'0'),
(267, 101, '/uploads/product_images/67d44e1f7f6b5_den.webp', b'1'),
(268, 101, '/uploads/product_images/67d44e23aad9e_trang.webp', b'0'),
(269, 102, '/uploads/product_images/67d44e2e47a5d_bac-1.webp', b'1'),
(270, 102, '/uploads/product_images/67d44e3199cf5_bac-2.webp', b'0'),
(271, 102, '/uploads/product_images/67d44e34bc957_bac-3.webp', b'0'),
(272, 103, '/uploads/product_images/67d44e41a2b1c_den.webp', b'1'),
(273, 103, '/uploads/product_images/67d44e45295c3_trang.webp', b'0'),
(274, 104, '/uploads/product_images/67d44e5747a5f_do-1.webp', b'1'),
(275, 104, '/uploads/product_images/67d44e5b3c5c7_do-2.webp', b'0'),
(276, 105, '/uploads/product_images/67d44e654738d_mo-1.webp', b'1'),
(277, 105, '/uploads/product_images/67d44e68ed3b1_mo-2.webp', b'0'),
(278, 105, '/uploads/product_images/67d44e6ccbf4a_mo-3.webp', b'0'),
(279, 106, '/uploads/product_images/67d44e78bb785_be-nau.webp', b'1'),
(280, 106, '/uploads/product_images/67d44e7c5f5c6_den.webp', b'0'),
(281, 106, '/uploads/product_images/67d44e80269c0_nau.webp', b'0'),
(282, 106, '/uploads/product_images/67d44e841a4ff_try-on-photo.webp', b'0'),
(283, 107, '/uploads/product_images/67d44e93a3312_trang-den.webp', b'1'),
(284, 107, '/uploads/product_images/67d44e97bc1b1_trang-do.webp', b'0'),
(285, 108, '/uploads/product_images/67d44ea36798e_nau-1.webp', b'1'),
(286, 108, '/uploads/product_images/67d44ea7544fb_nau-2.webp', b'0'),
(287, 108, '/uploads/product_images/67d44eaaea5d5_nau-3.webp', b'0'),
(288, 109, '/uploads/product_images/67d44eb7ea75a_den-1.webp', b'1'),
(289, 109, '/uploads/product_images/67d44ebba81f3_den-2.webp', b'0'),
(290, 109, '/uploads/product_images/67d44ebf28870_den-3.webp', b'0'),
(291, 110, '/uploads/product_images/67d44ecb0506f_trang-1.webp', b'1'),
(292, 110, '/uploads/product_images/67d44ed14337b_trang-2.webp', b'0'),
(293, 110, '/uploads/product_images/67d44ed4b8101_trang-3.webp', b'0'),
(294, 111, '/uploads/product_images/67d44ef559f76_img-1.webp', b'1'),
(295, 111, '/uploads/product_images/67d44ef884dbd_img-2.webp', b'0'),
(296, 111, '/uploads/product_images/67d44efbbec29_img-3.webp', b'0'),
(297, 112, '/uploads/product_images/67d44f05560a8_img-1.png', b'1'),
(298, 112, '/uploads/product_images/67d44f08cdf98_img-2.png', b'0'),
(299, 113, '/uploads/product_images/67d44f1297f31_img-1.webp', b'1'),
(300, 113, '/uploads/product_images/67d44f16a42a4_img-2.webp', b'0'),
(301, 113, '/uploads/product_images/67d44f1a6ed77_img-3.webp', b'0'),
(302, 114, '/uploads/product_images/67d44f24897de_be.webp', b'1'),
(303, 114, '/uploads/product_images/67d44f27d08ab_ghi.webp', b'0'),
(304, 114, '/uploads/product_images/67d44f2b26349_nau.webp', b'0'),
(305, 115, '/uploads/product_images/67d44f3541462_ghi.webp', b'1'),
(306, 115, '/uploads/product_images/67d44f3a975e7_vang.webp', b'0'),
(307, 115, '/uploads/product_images/67d44f3f0b9af_xam.webp', b'0'),
(308, 116, '/uploads/product_images/67d44f570afcc_ghi.webp', b'1'),
(309, 116, '/uploads/product_images/67d44f5ba5c0d_xam-dam.webp', b'0'),
(310, 117, '/uploads/product_images/67d44f67267d9_img-1.webp', b'1'),
(311, 118, '/uploads/product_images/67d44f7148243_img-1.webp', b'1'),
(312, 119, '/uploads/product_images/67d44f7b295f2_img-1.webp', b'1'),
(313, 119, '/uploads/product_images/67d44f7eaf4cb_img-2.webp', b'0'),
(314, 120, '/uploads/product_images/67d44f8ac6d09_img-1.webp', b'1'),
(315, 121, '/uploads/product_images/67d44f9f0de80_do.webp', b'0'),
(316, 121, '/uploads/product_images/67d44fa2d25fe_trang.webp', b'1'),
(317, 122, '/uploads/product_images/67d44fb271165_trang.webp', b'1'),
(318, 122, '/uploads/product_images/67d44fb729916_vang.webp', b'0'),
(319, 123, '/uploads/product_images/67d44fc85ffb9_den.jpg', b'1'),
(320, 123, '/uploads/product_images/67d44fcd0f490_trang.jpg', b'0'),
(321, 124, '/uploads/product_images/67d44fda17447_img-1.webp', b'1'),
(322, 124, '/uploads/product_images/67d44fde352a9_img-2.webp', b'0'),
(323, 124, '/uploads/product_images/67d44fe24a9f5_img-3.webp', b'0'),
(324, 124, '/uploads/product_images/67d44fe5e0ddf_img-4.webp', b'0'),
(325, 124, '/uploads/product_images/67d44fea2eac9_img-5.webp', b'0'),
(326, 125, '/uploads/product_images/67d44ff71123c_img-1.webp', b'1'),
(327, 125, '/uploads/product_images/67d44ffa61179_img-2.webp', b'0'),
(328, 125, '/uploads/product_images/67d44ffd9fd39_img-3.webp', b'0'),
(329, 126, '/uploads/product_images/67d45011f06b6_img-1.png', b'1'),
(330, 126, '/uploads/product_images/67d45015dfc6c_img-2.png', b'0'),
(331, 126, '/uploads/product_images/67d4501950f3e_img-3.webp', b'0'),
(332, 127, '/uploads/product_images/67d450254f016_img-1.png', b'1'),
(333, 127, '/uploads/product_images/67d45028a4e66_img-2.png', b'0'),
(334, 128, '/uploads/product_images/67d45033b9ec0_img-1.webp', b'1'),
(335, 128, '/uploads/product_images/67d45037a2b42_img-2.webp', b'0'),
(336, 128, '/uploads/product_images/67d4503b38d0b_img-3.webp', b'0'),
(337, 129, '/uploads/product_images/67d45048003e0_img-1.webp', b'1'),
(338, 129, '/uploads/product_images/67d4504b6abf6_img-2.webp', b'0'),
(339, 130, '/uploads/product_images/67d4505d5390b_img-1.webp', b'1'),
(340, 130, '/uploads/product_images/67d45060d578e_img-2.webp', b'0'),
(341, 130, '/uploads/product_images/67d450648c180_img-3.webp', b'0'),
(342, 131, '/uploads/product_images/67d450774d25d_den-1.webp', b'1'),
(343, 131, '/uploads/product_images/67d4507adc202_den-2.webp', b'0'),
(344, 131, '/uploads/product_images/67d4507e332d0_den-3.webp', b'0'),
(345, 132, '/uploads/product_images/67d4508c2b74a_trang.webp', b'1'),
(346, 132, '/uploads/product_images/67d4508fb5884_xam.webp', b'0'),
(347, 133, '/uploads/product_images/67d4509a2a85c_nau-1.webp', b'1'),
(348, 133, '/uploads/product_images/67d4509d75449_nau-2.webp', b'0'),
(349, 133, '/uploads/product_images/67d450a0ef08b_nau-3.webp', b'0'),
(350, 134, '/uploads/product_images/67d450ab92cee_den-1.webp', b'1'),
(351, 134, '/uploads/product_images/67d450af14949_den-2.webp', b'0'),
(352, 134, '/uploads/product_images/67d450b2bded3_den-3.webp', b'0'),
(353, 135, '/uploads/product_images/67d450bd31c3f_den-1.webp', b'1'),
(354, 135, '/uploads/product_images/67d450c16bf47_den-2.webp', b'0'),
(355, 135, '/uploads/product_images/67d450c4d5827_den-3.webp', b'0'),
(356, 136, '/uploads/product_images/67d450d02965f_den-1.webp', b'1'),
(357, 136, '/uploads/product_images/67d450d3a8878_den-2.webp', b'0'),
(358, 136, '/uploads/product_images/67d450d6cba36_den-3.webp', b'0'),
(359, 137, '/uploads/product_images/67d450e0328f6_nau-1.png', b'1'),
(360, 137, '/uploads/product_images/67d450e3a3220_nau-2.png', b'0'),
(361, 138, '/uploads/product_images/67d450ed892cf_den-1.png', b'1'),
(362, 138, '/uploads/product_images/67d450f193792_den-2.png', b'0'),
(363, 139, '/uploads/product_images/67d4510186380_den-1.webp', b'1'),
(364, 139, '/uploads/product_images/67d45105dde85_den-2.webp', b'0'),
(365, 139, '/uploads/product_images/67d451094d589_nau-1.webp', b'0'),
(366, 139, '/uploads/product_images/67d4510dbfd83_nau-2.webp', b'0'),
(367, 140, '/uploads/product_images/67d45118ece39_nau-1.png', b'1'),
(368, 140, '/uploads/product_images/67d4511c54d4c_nau-2.png', b'0'),
(369, 141, '/uploads/product_images/67d4512e6cabc_den.webp', b'1'),
(370, 141, '/uploads/product_images/67d4513198d6c_trang.webp', b'0'),
(371, 142, '/uploads/product_images/67d4513d1baf5_den.webp', b'1'),
(372, 142, '/uploads/product_images/67d45140712d9_trang.webp', b'0'),
(373, 143, '/uploads/product_images/67d4514b95bc7_den.webp', b'1'),
(374, 143, '/uploads/product_images/67d4514f76e12_trang.webp', b'0'),
(375, 144, '/uploads/product_images/67d45162566c9_den.webp', b'1'),
(376, 144, '/uploads/product_images/67d451663f338_trang.webp', b'0'),
(377, 145, '/uploads/product_images/67d451712bccf_be.webp', b'1'),
(378, 145, '/uploads/product_images/67d4517466096_den.webp', b'0'),
(379, 145, '/uploads/product_images/67d451781fb86_kaki.webp', b'0'),
(380, 145, '/uploads/product_images/67d4517bc0bc6_nau.webp', b'0'),
(381, 146, '/uploads/product_images/67d451863bab3_den.webp', b'1'),
(382, 146, '/uploads/product_images/67d4518a1c12c_trang.webp', b'0'),
(383, 147, '/uploads/product_images/67d4519565045_den.webp', b'1'),
(384, 147, '/uploads/product_images/67d45199ad6a0_kem.webp', b'0'),
(385, 148, '/uploads/product_images/67d451a78acc7_be-nau.png', b'1'),
(386, 148, '/uploads/product_images/67d451ab0582e_den.png', b'0'),
(387, 148, '/uploads/product_images/67d451ae3e9a4_trang-den.png', b'0'),
(388, 149, '/uploads/product_images/67d451b9c3a19_den.png', b'1'),
(389, 149, '/uploads/product_images/67d451bd17556_trang-den.png', b'0'),
(390, 150, '/uploads/product_images/67d451c7df0f6_den.webp', b'1'),
(391, 150, '/uploads/product_images/67d451cbe952a_trang-den.webp', b'0'),
(392, 151, 'https://thebalooa.com/wp-content/uploads/2024/03/97.png', b'1'),
(393, 151, 'https://thebalooa.com/wp-content/uploads/2024/03/30-2.png', b'0');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_ratings`
--

CREATE TABLE `product_ratings` (
  `rating_id` int(9) NOT NULL,
  `account_id` int(9) NOT NULL,
  `product_id` int(9) NOT NULL,
  `rating` tinyint(1) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `product_ratings`
--

INSERT INTO `product_ratings` (`rating_id`, `account_id`, `product_id`, `rating`, `created_at`) VALUES
(1, 1, 1, 5, '2025-02-16 05:44:42'),
(2, 1, 1, 5, '2025-02-16 05:44:42'),
(3, 1, 1, 5, '2025-02-16 05:44:42'),
(4, 1, 1, 5, '2025-02-16 05:44:42'),
(5, 1, 1, 4, '2025-02-16 05:44:42'),
(6, 1, 2, 5, '2025-02-16 05:44:42'),
(7, 1, 2, 5, '2025-02-16 05:44:42'),
(8, 1, 2, 5, '2025-02-16 05:44:42'),
(9, 1, 2, 5, '2025-02-16 05:44:42'),
(10, 1, 2, 4, '2025-02-16 05:44:42'),
(11, 1, 3, 5, '2025-02-16 05:44:42'),
(12, 1, 3, 5, '2025-02-16 05:44:42'),
(13, 1, 3, 5, '2025-02-16 05:44:42'),
(14, 1, 3, 5, '2025-02-16 05:44:42'),
(15, 1, 3, 5, '2025-02-16 05:44:42'),
(16, 1, 4, 5, '2025-02-16 05:44:42'),
(17, 1, 4, 5, '2025-02-16 05:44:42'),
(18, 1, 4, 5, '2025-02-16 05:44:42'),
(19, 1, 4, 5, '2025-02-16 05:44:42'),
(20, 1, 4, 4, '2025-02-16 05:44:42'),
(21, 1, 5, 5, '2025-02-16 05:44:42'),
(22, 1, 5, 5, '2025-02-16 05:44:42'),
(23, 1, 5, 5, '2025-02-16 05:44:42'),
(24, 1, 5, 5, '2025-02-16 05:44:42'),
(25, 1, 5, 4, '2025-02-16 05:44:42'),
(26, 1, 6, 5, '2025-02-16 05:44:42'),
(27, 1, 6, 5, '2025-02-16 05:44:42'),
(28, 1, 6, 5, '2025-02-16 05:44:42'),
(29, 1, 6, 5, '2025-02-16 05:44:42'),
(30, 1, 6, 4, '2025-02-16 05:44:42'),
(31, 1, 7, 5, '2025-02-16 05:44:42'),
(32, 1, 7, 5, '2025-02-16 05:44:42'),
(33, 1, 7, 5, '2025-02-16 05:44:42'),
(34, 1, 7, 5, '2025-02-16 05:44:42'),
(35, 1, 7, 4, '2025-02-16 05:44:42'),
(36, 1, 8, 5, '2025-02-16 05:44:42'),
(37, 1, 8, 5, '2025-02-16 05:44:42'),
(38, 1, 8, 5, '2025-02-16 05:44:42'),
(39, 1, 8, 5, '2025-02-16 05:44:42'),
(40, 1, 8, 4, '2025-02-16 05:44:42'),
(41, 1, 9, 5, '2025-02-16 05:44:42'),
(42, 1, 9, 5, '2025-02-16 05:44:42'),
(43, 1, 9, 5, '2025-02-16 05:44:42'),
(44, 1, 9, 5, '2025-02-16 05:44:42'),
(45, 1, 9, 5, '2025-02-16 05:44:42'),
(46, 1, 10, 5, '2025-02-16 05:44:42'),
(47, 1, 10, 5, '2025-02-16 05:44:42'),
(48, 1, 10, 5, '2025-02-16 05:44:42'),
(49, 1, 10, 5, '2025-02-16 05:44:42'),
(50, 1, 10, 4, '2025-02-16 05:44:42'),
(51, 1, 11, 5, '2025-02-16 05:46:13'),
(52, 1, 11, 5, '2025-02-16 05:46:13'),
(53, 1, 11, 5, '2025-02-16 05:46:13'),
(54, 1, 11, 5, '2025-02-16 05:46:13'),
(55, 1, 11, 4, '2025-02-16 05:46:13'),
(56, 1, 12, 5, '2025-02-16 05:46:13'),
(57, 1, 12, 5, '2025-02-16 05:46:13'),
(58, 1, 12, 5, '2025-02-16 05:46:13'),
(59, 1, 12, 5, '2025-02-16 05:46:13'),
(60, 1, 12, 5, '2025-02-16 05:46:13'),
(61, 1, 13, 5, '2025-02-16 05:46:13'),
(62, 1, 13, 5, '2025-02-16 05:46:13'),
(63, 1, 13, 5, '2025-02-16 05:46:13'),
(64, 1, 13, 5, '2025-02-16 05:46:13'),
(65, 1, 13, 5, '2025-02-16 05:46:13'),
(66, 1, 14, 5, '2025-02-16 05:46:13'),
(67, 1, 14, 5, '2025-02-16 05:46:13'),
(68, 1, 14, 5, '2025-02-16 05:46:13'),
(69, 1, 14, 5, '2025-02-16 05:46:13'),
(70, 1, 14, 4, '2025-02-16 05:46:13'),
(71, 1, 15, 5, '2025-02-16 05:46:13'),
(72, 1, 15, 5, '2025-02-16 05:46:13'),
(73, 1, 15, 5, '2025-02-16 05:46:13'),
(74, 1, 15, 5, '2025-02-16 05:46:13'),
(75, 1, 15, 4, '2025-02-16 05:46:13'),
(76, 1, 16, 5, '2025-02-16 05:46:13'),
(77, 1, 16, 5, '2025-02-16 05:46:13'),
(78, 1, 16, 5, '2025-02-16 05:46:13'),
(79, 1, 16, 5, '2025-02-16 05:46:13'),
(80, 1, 16, 5, '2025-02-16 05:46:13'),
(81, 1, 17, 5, '2025-02-16 05:46:13'),
(82, 1, 17, 5, '2025-02-16 05:46:13'),
(83, 1, 17, 5, '2025-02-16 05:46:13'),
(84, 1, 17, 5, '2025-02-16 05:46:13'),
(85, 1, 17, 4, '2025-02-16 05:46:13'),
(86, 1, 18, 5, '2025-02-16 05:46:13'),
(87, 1, 18, 5, '2025-02-16 05:46:13'),
(88, 1, 18, 5, '2025-02-16 05:46:13'),
(89, 1, 18, 5, '2025-02-16 05:46:13'),
(90, 1, 18, 5, '2025-02-16 05:46:13'),
(91, 1, 19, 5, '2025-02-16 05:46:13'),
(92, 1, 19, 5, '2025-02-16 05:46:13'),
(93, 1, 19, 5, '2025-02-16 05:46:13'),
(94, 1, 19, 5, '2025-02-16 05:46:13'),
(95, 1, 19, 5, '2025-02-16 05:46:13'),
(96, 1, 20, 5, '2025-02-16 05:46:13'),
(97, 1, 20, 5, '2025-02-16 05:46:13'),
(98, 1, 20, 5, '2025-02-16 05:46:13'),
(99, 1, 20, 5, '2025-02-16 05:46:13'),
(100, 1, 20, 4, '2025-02-16 05:46:13'),
(101, 1, 21, 5, '2025-02-16 05:46:36'),
(102, 1, 21, 5, '2025-02-16 05:46:36'),
(103, 1, 21, 5, '2025-02-16 05:46:36'),
(104, 1, 21, 5, '2025-02-16 05:46:36'),
(105, 1, 21, 4, '2025-02-16 05:46:36'),
(106, 1, 22, 5, '2025-02-16 05:46:36'),
(107, 1, 22, 5, '2025-02-16 05:46:36'),
(108, 1, 22, 5, '2025-02-16 05:46:36'),
(109, 1, 22, 5, '2025-02-16 05:46:36'),
(110, 1, 22, 4, '2025-02-16 05:46:36'),
(111, 1, 23, 5, '2025-02-16 05:46:36'),
(112, 1, 23, 5, '2025-02-16 05:46:36'),
(113, 1, 23, 5, '2025-02-16 05:46:36'),
(114, 1, 23, 5, '2025-02-16 05:46:36'),
(115, 1, 23, 5, '2025-02-16 05:46:36'),
(116, 1, 24, 5, '2025-02-16 05:46:36'),
(117, 1, 24, 5, '2025-02-16 05:46:36'),
(118, 1, 24, 5, '2025-02-16 05:46:36'),
(119, 1, 24, 5, '2025-02-16 05:46:36'),
(120, 1, 24, 4, '2025-02-16 05:46:36'),
(121, 1, 25, 5, '2025-02-16 05:46:36'),
(122, 1, 25, 5, '2025-02-16 05:46:36'),
(123, 1, 25, 5, '2025-02-16 05:46:36'),
(124, 1, 25, 5, '2025-02-16 05:46:36'),
(125, 1, 25, 4, '2025-02-16 05:46:36'),
(126, 1, 26, 5, '2025-02-16 05:46:36'),
(127, 1, 26, 5, '2025-02-16 05:46:36'),
(128, 1, 26, 5, '2025-02-16 05:46:36'),
(129, 1, 26, 5, '2025-02-16 05:46:36'),
(130, 1, 26, 4, '2025-02-16 05:46:36'),
(131, 1, 27, 5, '2025-02-16 05:46:36'),
(132, 1, 27, 5, '2025-02-16 05:46:36'),
(133, 1, 27, 5, '2025-02-16 05:46:36'),
(134, 1, 27, 5, '2025-02-16 05:46:36'),
(135, 1, 27, 4, '2025-02-16 05:46:36'),
(136, 1, 28, 5, '2025-02-16 05:46:36'),
(137, 1, 28, 5, '2025-02-16 05:46:36'),
(138, 1, 28, 5, '2025-02-16 05:46:36'),
(139, 1, 28, 5, '2025-02-16 05:46:36'),
(140, 1, 28, 4, '2025-02-16 05:46:36'),
(141, 1, 29, 5, '2025-02-16 05:46:36'),
(142, 1, 29, 5, '2025-02-16 05:46:36'),
(143, 1, 29, 5, '2025-02-16 05:46:36'),
(144, 1, 29, 5, '2025-02-16 05:46:36'),
(145, 1, 29, 4, '2025-02-16 05:46:36'),
(146, 1, 30, 5, '2025-02-16 05:46:36'),
(147, 1, 30, 5, '2025-02-16 05:46:36'),
(148, 1, 30, 5, '2025-02-16 05:46:36'),
(149, 1, 30, 5, '2025-02-16 05:46:36'),
(150, 1, 30, 4, '2025-02-16 05:46:36'),
(151, 1, 31, 5, '2025-02-16 05:47:06'),
(152, 1, 31, 5, '2025-02-16 05:47:06'),
(153, 1, 31, 5, '2025-02-16 05:47:06'),
(154, 1, 31, 5, '2025-02-16 05:47:06'),
(155, 1, 31, 4, '2025-02-16 05:47:06'),
(156, 1, 32, 5, '2025-02-16 05:47:06'),
(157, 1, 32, 5, '2025-02-16 05:47:06'),
(158, 1, 32, 5, '2025-02-16 05:47:06'),
(159, 1, 32, 5, '2025-02-16 05:47:06'),
(160, 1, 32, 4, '2025-02-16 05:47:06'),
(161, 1, 33, 5, '2025-02-16 05:47:06'),
(162, 1, 33, 5, '2025-02-16 05:47:06'),
(163, 1, 33, 5, '2025-02-16 05:47:06'),
(164, 1, 33, 5, '2025-02-16 05:47:06'),
(165, 1, 33, 5, '2025-02-16 05:47:06'),
(166, 1, 34, 5, '2025-02-16 05:47:06'),
(167, 1, 34, 5, '2025-02-16 05:47:06'),
(168, 1, 34, 5, '2025-02-16 05:47:06'),
(169, 1, 34, 5, '2025-02-16 05:47:06'),
(170, 1, 34, 4, '2025-02-16 05:47:06'),
(171, 1, 35, 5, '2025-02-16 05:47:06'),
(172, 1, 35, 5, '2025-02-16 05:47:06'),
(173, 1, 35, 5, '2025-02-16 05:47:06'),
(174, 1, 35, 5, '2025-02-16 05:47:06'),
(175, 1, 35, 5, '2025-02-16 05:47:06'),
(176, 1, 36, 5, '2025-02-16 05:47:06'),
(177, 1, 36, 5, '2025-02-16 05:47:06'),
(178, 1, 36, 5, '2025-02-16 05:47:06'),
(179, 1, 36, 5, '2025-02-16 05:47:06'),
(180, 1, 36, 4, '2025-02-16 05:47:06'),
(181, 1, 37, 5, '2025-02-16 05:47:06'),
(182, 1, 37, 5, '2025-02-16 05:47:06'),
(183, 1, 37, 5, '2025-02-16 05:47:06'),
(184, 1, 37, 5, '2025-02-16 05:47:06'),
(185, 1, 37, 4, '2025-02-16 05:47:06'),
(186, 1, 38, 5, '2025-02-16 05:47:06'),
(187, 1, 38, 5, '2025-02-16 05:47:06'),
(188, 1, 38, 5, '2025-02-16 05:47:06'),
(189, 1, 38, 5, '2025-02-16 05:47:06'),
(190, 1, 38, 5, '2025-02-16 05:47:06'),
(191, 1, 39, 5, '2025-02-16 05:47:06'),
(192, 1, 39, 5, '2025-02-16 05:47:06'),
(193, 1, 39, 5, '2025-02-16 05:47:06'),
(194, 1, 39, 5, '2025-02-16 05:47:06'),
(195, 1, 39, 5, '2025-02-16 05:47:06'),
(196, 1, 40, 5, '2025-02-16 05:47:06'),
(197, 1, 40, 5, '2025-02-16 05:47:06'),
(198, 1, 40, 5, '2025-02-16 05:47:06'),
(199, 1, 40, 5, '2025-02-16 05:47:06'),
(200, 1, 40, 4, '2025-02-16 05:47:06'),
(201, 1, 41, 5, '2025-02-16 05:47:35'),
(202, 1, 41, 5, '2025-02-16 05:47:35'),
(203, 1, 41, 5, '2025-02-16 05:47:35'),
(204, 1, 41, 5, '2025-02-16 05:47:35'),
(205, 1, 41, 4, '2025-02-16 05:47:35'),
(206, 1, 42, 5, '2025-02-16 05:47:35'),
(207, 1, 42, 5, '2025-02-16 05:47:35'),
(208, 1, 42, 5, '2025-02-16 05:47:35'),
(209, 1, 42, 5, '2025-02-16 05:47:35'),
(210, 1, 42, 4, '2025-02-16 05:47:35'),
(211, 1, 43, 5, '2025-02-16 05:47:35'),
(212, 1, 43, 5, '2025-02-16 05:47:35'),
(213, 1, 43, 5, '2025-02-16 05:47:35'),
(214, 1, 43, 5, '2025-02-16 05:47:35'),
(215, 1, 43, 4, '2025-02-16 05:47:35'),
(216, 1, 44, 5, '2025-02-16 05:47:35'),
(217, 1, 44, 5, '2025-02-16 05:47:35'),
(218, 1, 44, 5, '2025-02-16 05:47:35'),
(219, 1, 44, 5, '2025-02-16 05:47:35'),
(220, 1, 44, 4, '2025-02-16 05:47:35'),
(221, 1, 45, 5, '2025-02-16 05:47:35'),
(222, 1, 45, 5, '2025-02-16 05:47:35'),
(223, 1, 45, 5, '2025-02-16 05:47:35'),
(224, 1, 45, 5, '2025-02-16 05:47:35'),
(225, 1, 45, 4, '2025-02-16 05:47:35'),
(226, 1, 46, 5, '2025-02-16 05:47:35'),
(227, 1, 46, 5, '2025-02-16 05:47:35'),
(228, 1, 46, 5, '2025-02-16 05:47:35'),
(229, 1, 46, 5, '2025-02-16 05:47:35'),
(230, 1, 46, 5, '2025-02-16 05:47:35'),
(231, 1, 47, 5, '2025-02-16 05:47:35'),
(232, 1, 47, 5, '2025-02-16 05:47:35'),
(233, 1, 47, 5, '2025-02-16 05:47:35'),
(234, 1, 47, 5, '2025-02-16 05:47:35'),
(235, 1, 47, 4, '2025-02-16 05:47:35'),
(236, 1, 48, 5, '2025-02-16 05:47:35'),
(237, 1, 48, 5, '2025-02-16 05:47:35'),
(238, 1, 48, 5, '2025-02-16 05:47:35'),
(239, 1, 48, 5, '2025-02-16 05:47:35'),
(240, 1, 48, 4, '2025-02-16 05:47:35'),
(241, 1, 49, 5, '2025-02-16 05:47:35'),
(242, 1, 49, 5, '2025-02-16 05:47:35'),
(243, 1, 49, 5, '2025-02-16 05:47:35'),
(244, 1, 49, 5, '2025-02-16 05:47:35'),
(245, 1, 49, 4, '2025-02-16 05:47:35'),
(246, 1, 50, 5, '2025-02-16 05:47:35'),
(247, 1, 50, 5, '2025-02-16 05:47:35'),
(248, 1, 50, 5, '2025-02-16 05:47:35'),
(249, 1, 50, 5, '2025-02-16 05:47:35'),
(250, 1, 50, 4, '2025-02-16 05:47:35'),
(251, 1, 51, 5, '2025-02-16 05:47:35'),
(252, 1, 51, 5, '2025-02-16 05:47:35'),
(253, 1, 51, 5, '2025-02-16 05:47:35'),
(254, 1, 51, 5, '2025-02-16 05:47:35'),
(255, 1, 51, 5, '2025-02-16 05:47:35'),
(256, 1, 52, 5, '2025-02-16 05:47:35'),
(257, 1, 52, 5, '2025-02-16 05:47:35'),
(258, 1, 52, 5, '2025-02-16 05:47:35'),
(259, 1, 52, 5, '2025-02-16 05:47:35'),
(260, 1, 52, 4, '2025-02-16 05:47:35'),
(261, 1, 53, 5, '2025-02-16 05:47:35'),
(262, 1, 53, 5, '2025-02-16 05:47:35'),
(263, 1, 53, 5, '2025-02-16 05:47:35'),
(264, 1, 53, 5, '2025-02-16 05:47:35'),
(265, 1, 53, 4, '2025-02-16 05:47:35'),
(266, 1, 54, 5, '2025-02-16 05:47:35'),
(267, 1, 54, 5, '2025-02-16 05:47:35'),
(268, 1, 54, 5, '2025-02-16 05:47:35'),
(269, 1, 54, 5, '2025-02-16 05:47:35'),
(270, 1, 54, 4, '2025-02-16 05:47:35'),
(271, 1, 55, 5, '2025-02-16 05:47:35'),
(272, 1, 55, 5, '2025-02-16 05:47:35'),
(273, 1, 55, 5, '2025-02-16 05:47:35'),
(274, 1, 55, 5, '2025-02-16 05:47:35'),
(275, 1, 55, 5, '2025-02-16 05:47:35'),
(276, 1, 56, 5, '2025-02-16 05:47:35'),
(277, 1, 56, 5, '2025-02-16 05:47:35'),
(278, 1, 56, 5, '2025-02-16 05:47:35'),
(279, 1, 56, 5, '2025-02-16 05:47:35'),
(280, 1, 56, 5, '2025-02-16 05:47:35'),
(281, 1, 57, 5, '2025-02-16 05:47:35'),
(282, 1, 57, 5, '2025-02-16 05:47:35'),
(283, 1, 57, 5, '2025-02-16 05:47:35'),
(284, 1, 57, 5, '2025-02-16 05:47:35'),
(285, 1, 57, 4, '2025-02-16 05:47:35'),
(286, 1, 58, 5, '2025-02-16 05:47:35'),
(287, 1, 58, 5, '2025-02-16 05:47:35'),
(288, 1, 58, 5, '2025-02-16 05:47:35'),
(289, 1, 58, 5, '2025-02-16 05:47:35'),
(290, 1, 58, 5, '2025-02-16 05:47:35'),
(291, 1, 59, 5, '2025-02-16 05:47:35'),
(292, 1, 59, 5, '2025-02-16 05:47:35'),
(293, 1, 59, 5, '2025-02-16 05:47:35'),
(294, 1, 59, 5, '2025-02-16 05:47:35'),
(295, 1, 59, 5, '2025-02-16 05:47:35'),
(296, 1, 60, 5, '2025-02-16 05:47:35'),
(297, 1, 60, 5, '2025-02-16 05:47:35'),
(298, 1, 60, 5, '2025-02-16 05:47:35'),
(299, 1, 60, 5, '2025-02-16 05:47:35'),
(300, 1, 60, 4, '2025-02-16 05:47:35'),
(301, 1, 61, 5, '2025-02-16 05:49:02'),
(302, 1, 61, 5, '2025-02-16 05:49:02'),
(303, 1, 61, 5, '2025-02-16 05:49:02'),
(304, 1, 61, 5, '2025-02-16 05:49:02'),
(305, 1, 61, 5, '2025-02-16 05:49:02'),
(306, 1, 62, 5, '2025-02-16 05:49:02'),
(307, 1, 62, 5, '2025-02-16 05:49:02'),
(308, 1, 62, 5, '2025-02-16 05:49:02'),
(309, 1, 62, 5, '2025-02-16 05:49:02'),
(310, 1, 62, 4, '2025-02-16 05:49:02'),
(311, 1, 63, 5, '2025-02-16 05:49:02'),
(312, 1, 63, 5, '2025-02-16 05:49:02'),
(313, 1, 63, 5, '2025-02-16 05:49:02'),
(314, 1, 63, 5, '2025-02-16 05:49:02'),
(315, 1, 63, 5, '2025-02-16 05:49:02'),
(316, 1, 64, 5, '2025-02-16 05:49:02'),
(317, 1, 64, 5, '2025-02-16 05:49:02'),
(318, 1, 64, 5, '2025-02-16 05:49:02'),
(319, 1, 64, 5, '2025-02-16 05:49:02'),
(320, 1, 64, 4, '2025-02-16 05:49:02'),
(321, 1, 65, 5, '2025-02-16 05:49:02'),
(322, 1, 65, 5, '2025-02-16 05:49:02'),
(323, 1, 65, 5, '2025-02-16 05:49:02'),
(324, 1, 65, 5, '2025-02-16 05:49:02'),
(325, 1, 65, 4, '2025-02-16 05:49:02'),
(326, 1, 66, 5, '2025-02-16 05:49:02'),
(327, 1, 66, 5, '2025-02-16 05:49:02'),
(328, 1, 66, 5, '2025-02-16 05:49:02'),
(329, 1, 66, 5, '2025-02-16 05:49:02'),
(330, 1, 66, 5, '2025-02-16 05:49:02'),
(331, 1, 67, 5, '2025-02-16 05:49:02'),
(332, 1, 67, 5, '2025-02-16 05:49:02'),
(333, 1, 67, 5, '2025-02-16 05:49:02'),
(334, 1, 67, 5, '2025-02-16 05:49:02'),
(335, 1, 67, 4, '2025-02-16 05:49:02'),
(336, 1, 68, 5, '2025-02-16 05:49:02'),
(337, 1, 68, 5, '2025-02-16 05:49:02'),
(338, 1, 68, 5, '2025-02-16 05:49:02'),
(339, 1, 68, 5, '2025-02-16 05:49:02'),
(340, 1, 68, 5, '2025-02-16 05:49:02'),
(341, 1, 69, 5, '2025-02-16 05:49:02'),
(342, 1, 69, 5, '2025-02-16 05:49:02'),
(343, 1, 69, 5, '2025-02-16 05:49:02'),
(344, 1, 69, 5, '2025-02-16 05:49:02'),
(345, 1, 69, 5, '2025-02-16 05:49:02'),
(346, 1, 70, 5, '2025-02-16 05:49:02'),
(347, 1, 70, 5, '2025-02-16 05:49:02'),
(348, 1, 70, 5, '2025-02-16 05:49:02'),
(349, 1, 70, 5, '2025-02-16 05:49:02'),
(350, 1, 70, 4, '2025-02-16 05:49:02'),
(351, 1, 71, 5, '2025-02-16 05:49:02'),
(352, 1, 71, 5, '2025-02-16 05:49:02'),
(353, 1, 71, 5, '2025-02-16 05:49:02'),
(354, 1, 71, 5, '2025-02-16 05:49:02'),
(355, 1, 71, 4, '2025-02-16 05:49:02'),
(356, 1, 72, 5, '2025-02-16 05:49:02'),
(357, 1, 72, 5, '2025-02-16 05:49:02'),
(358, 1, 72, 5, '2025-02-16 05:49:02'),
(359, 1, 72, 5, '2025-02-16 05:49:02'),
(360, 1, 72, 4, '2025-02-16 05:49:02'),
(361, 1, 73, 5, '2025-02-16 05:49:02'),
(362, 1, 73, 5, '2025-02-16 05:49:02'),
(363, 1, 73, 5, '2025-02-16 05:49:02'),
(364, 1, 73, 5, '2025-02-16 05:49:02'),
(365, 1, 73, 4, '2025-02-16 05:49:02'),
(366, 1, 74, 5, '2025-02-16 05:49:02'),
(367, 1, 74, 5, '2025-02-16 05:49:02'),
(368, 1, 74, 5, '2025-02-16 05:49:02'),
(369, 1, 74, 5, '2025-02-16 05:49:02'),
(370, 1, 74, 4, '2025-02-16 05:49:02'),
(371, 1, 75, 5, '2025-02-16 05:49:02'),
(372, 1, 75, 5, '2025-02-16 05:49:02'),
(373, 1, 75, 5, '2025-02-16 05:49:02'),
(374, 1, 75, 5, '2025-02-16 05:49:02'),
(375, 1, 75, 4, '2025-02-16 05:49:02'),
(376, 1, 76, 5, '2025-02-16 05:49:02'),
(377, 1, 76, 5, '2025-02-16 05:49:02'),
(378, 1, 76, 5, '2025-02-16 05:49:02'),
(379, 1, 76, 5, '2025-02-16 05:49:02'),
(380, 1, 76, 4, '2025-02-16 05:49:02'),
(381, 1, 77, 5, '2025-02-16 05:49:02'),
(382, 1, 77, 5, '2025-02-16 05:49:02'),
(383, 1, 77, 5, '2025-02-16 05:49:02'),
(384, 1, 77, 5, '2025-02-16 05:49:02'),
(385, 1, 77, 4, '2025-02-16 05:49:02'),
(386, 1, 78, 5, '2025-02-16 05:49:02'),
(387, 1, 78, 5, '2025-02-16 05:49:02'),
(388, 1, 78, 5, '2025-02-16 05:49:02'),
(389, 1, 78, 5, '2025-02-16 05:49:02'),
(390, 1, 78, 4, '2025-02-16 05:49:02'),
(391, 1, 79, 5, '2025-02-16 05:49:02'),
(392, 1, 79, 5, '2025-02-16 05:49:02'),
(393, 1, 79, 5, '2025-02-16 05:49:02'),
(394, 1, 79, 5, '2025-02-16 05:49:02'),
(395, 1, 79, 5, '2025-02-16 05:49:02'),
(396, 1, 80, 5, '2025-02-16 05:49:02'),
(397, 1, 80, 5, '2025-02-16 05:49:02'),
(398, 1, 80, 5, '2025-02-16 05:49:02'),
(399, 1, 80, 5, '2025-02-16 05:49:02'),
(400, 1, 80, 4, '2025-02-16 05:49:02'),
(401, 1, 81, 5, '2025-02-16 05:49:38'),
(402, 1, 81, 5, '2025-02-16 05:49:38'),
(403, 1, 81, 5, '2025-02-16 05:49:38'),
(404, 1, 81, 5, '2025-02-16 05:49:38'),
(405, 1, 81, 4, '2025-02-16 05:49:38'),
(406, 1, 82, 5, '2025-02-16 05:49:38'),
(407, 1, 82, 5, '2025-02-16 05:49:38'),
(408, 1, 82, 5, '2025-02-16 05:49:38'),
(409, 1, 82, 5, '2025-02-16 05:49:38'),
(410, 1, 82, 4, '2025-02-16 05:49:38'),
(411, 1, 83, 5, '2025-02-16 05:49:38'),
(412, 1, 83, 5, '2025-02-16 05:49:38'),
(413, 1, 83, 5, '2025-02-16 05:49:38'),
(414, 1, 83, 5, '2025-02-16 05:49:38'),
(415, 1, 83, 5, '2025-02-16 05:49:38'),
(416, 1, 84, 5, '2025-02-16 05:49:38'),
(417, 1, 84, 5, '2025-02-16 05:49:38'),
(418, 1, 84, 5, '2025-02-16 05:49:38'),
(419, 1, 84, 5, '2025-02-16 05:49:38'),
(420, 1, 84, 4, '2025-02-16 05:49:38'),
(421, 1, 85, 5, '2025-02-16 05:49:38'),
(422, 1, 85, 5, '2025-02-16 05:49:38'),
(423, 1, 85, 5, '2025-02-16 05:49:38'),
(424, 1, 85, 5, '2025-02-16 05:49:38'),
(425, 1, 85, 4, '2025-02-16 05:49:38'),
(426, 1, 86, 5, '2025-02-16 05:49:38'),
(427, 1, 86, 5, '2025-02-16 05:49:38'),
(428, 1, 86, 5, '2025-02-16 05:49:38'),
(429, 1, 86, 5, '2025-02-16 05:49:38'),
(430, 1, 86, 5, '2025-02-16 05:49:38'),
(431, 1, 87, 5, '2025-02-16 05:49:38'),
(432, 1, 87, 5, '2025-02-16 05:49:38'),
(433, 1, 87, 5, '2025-02-16 05:49:38'),
(434, 1, 87, 5, '2025-02-16 05:49:38'),
(435, 1, 87, 4, '2025-02-16 05:49:38'),
(436, 1, 88, 5, '2025-02-16 05:49:38'),
(437, 1, 88, 5, '2025-02-16 05:49:38'),
(438, 1, 88, 5, '2025-02-16 05:49:38'),
(439, 1, 88, 5, '2025-02-16 05:49:38'),
(440, 1, 88, 4, '2025-02-16 05:49:38'),
(441, 1, 89, 5, '2025-02-16 05:49:38'),
(442, 1, 89, 5, '2025-02-16 05:49:38'),
(443, 1, 89, 5, '2025-02-16 05:49:38'),
(444, 1, 89, 5, '2025-02-16 05:49:38'),
(445, 1, 89, 5, '2025-02-16 05:49:38'),
(446, 1, 90, 5, '2025-02-16 05:49:38'),
(447, 1, 90, 5, '2025-02-16 05:49:38'),
(448, 1, 90, 5, '2025-02-16 05:49:38'),
(449, 1, 90, 5, '2025-02-16 05:49:38'),
(450, 1, 90, 4, '2025-02-16 05:49:38'),
(451, 1, 91, 5, '2025-02-16 05:49:38'),
(452, 1, 91, 5, '2025-02-16 05:49:38'),
(453, 1, 91, 5, '2025-02-16 05:49:38'),
(454, 1, 91, 5, '2025-02-16 05:49:38'),
(455, 1, 91, 4, '2025-02-16 05:49:38'),
(456, 1, 92, 5, '2025-02-16 05:49:38'),
(457, 1, 92, 5, '2025-02-16 05:49:38'),
(458, 1, 92, 5, '2025-02-16 05:49:38'),
(459, 1, 92, 5, '2025-02-16 05:49:38'),
(460, 1, 92, 4, '2025-02-16 05:49:38'),
(461, 1, 93, 5, '2025-02-16 05:49:38'),
(462, 1, 93, 5, '2025-02-16 05:49:38'),
(463, 1, 93, 5, '2025-02-16 05:49:38'),
(464, 1, 93, 5, '2025-02-16 05:49:38'),
(465, 1, 93, 5, '2025-02-16 05:49:38'),
(466, 1, 94, 5, '2025-02-16 05:49:38'),
(467, 1, 94, 5, '2025-02-16 05:49:38'),
(468, 1, 94, 5, '2025-02-16 05:49:38'),
(469, 1, 94, 5, '2025-02-16 05:49:38'),
(470, 1, 94, 4, '2025-02-16 05:49:38'),
(471, 1, 95, 5, '2025-02-16 05:49:38'),
(472, 1, 95, 5, '2025-02-16 05:49:38'),
(473, 1, 95, 5, '2025-02-16 05:49:38'),
(474, 1, 95, 5, '2025-02-16 05:49:38'),
(475, 1, 95, 4, '2025-02-16 05:49:38'),
(476, 1, 96, 5, '2025-02-16 05:49:38'),
(477, 1, 96, 5, '2025-02-16 05:49:38'),
(478, 1, 96, 5, '2025-02-16 05:49:38'),
(479, 1, 96, 5, '2025-02-16 05:49:38'),
(480, 1, 96, 5, '2025-02-16 05:49:38'),
(481, 1, 97, 5, '2025-02-16 05:49:38'),
(482, 1, 97, 5, '2025-02-16 05:49:38'),
(483, 1, 97, 5, '2025-02-16 05:49:38'),
(484, 1, 97, 5, '2025-02-16 05:49:38'),
(485, 1, 97, 4, '2025-02-16 05:49:38'),
(486, 1, 98, 5, '2025-02-16 05:49:38'),
(487, 1, 98, 5, '2025-02-16 05:49:38'),
(488, 1, 98, 5, '2025-02-16 05:49:38'),
(489, 1, 98, 5, '2025-02-16 05:49:38'),
(490, 1, 98, 5, '2025-02-16 05:49:38'),
(491, 1, 99, 5, '2025-02-16 05:49:38'),
(492, 1, 99, 5, '2025-02-16 05:49:38'),
(493, 1, 99, 5, '2025-02-16 05:49:38'),
(494, 1, 99, 5, '2025-02-16 05:49:38'),
(495, 1, 99, 4, '2025-02-16 05:49:38'),
(496, 1, 100, 5, '2025-02-16 05:49:38'),
(497, 1, 100, 5, '2025-02-16 05:49:38'),
(498, 1, 100, 5, '2025-02-16 05:49:38'),
(499, 1, 100, 5, '2025-02-16 05:49:38'),
(500, 1, 100, 4, '2025-02-16 05:49:38'),
(501, 1, 101, 5, '2025-02-16 05:52:14'),
(502, 1, 101, 5, '2025-02-16 05:52:14'),
(503, 1, 101, 5, '2025-02-16 05:52:14'),
(504, 1, 101, 5, '2025-02-16 05:52:14'),
(505, 1, 101, 4, '2025-02-16 05:52:14'),
(506, 1, 102, 5, '2025-02-16 05:52:14'),
(507, 1, 102, 5, '2025-02-16 05:52:14'),
(508, 1, 102, 5, '2025-02-16 05:52:14'),
(509, 1, 102, 5, '2025-02-16 05:52:14'),
(510, 1, 102, 5, '2025-02-16 05:52:14'),
(511, 1, 103, 5, '2025-02-16 05:52:14'),
(512, 1, 103, 5, '2025-02-16 05:52:14'),
(513, 1, 103, 5, '2025-02-16 05:52:14'),
(514, 1, 103, 5, '2025-02-16 05:52:14'),
(515, 1, 103, 4, '2025-02-16 05:52:14'),
(516, 1, 104, 5, '2025-02-16 05:52:14'),
(517, 1, 104, 5, '2025-02-16 05:52:14'),
(518, 1, 104, 5, '2025-02-16 05:52:14'),
(519, 1, 104, 5, '2025-02-16 05:52:14'),
(520, 1, 104, 4, '2025-02-16 05:52:14'),
(521, 1, 105, 5, '2025-02-16 05:52:14'),
(522, 1, 105, 5, '2025-02-16 05:52:14'),
(523, 1, 105, 5, '2025-02-16 05:52:14'),
(524, 1, 105, 5, '2025-02-16 05:52:14'),
(525, 1, 105, 4, '2025-02-16 05:52:14'),
(526, 1, 106, 5, '2025-02-16 05:52:14'),
(527, 1, 106, 5, '2025-02-16 05:52:14'),
(528, 1, 106, 5, '2025-02-16 05:52:14'),
(529, 1, 106, 5, '2025-02-16 05:52:14'),
(530, 1, 106, 4, '2025-02-16 05:52:14'),
(531, 1, 107, 5, '2025-02-16 05:52:14'),
(532, 1, 107, 5, '2025-02-16 05:52:14'),
(533, 1, 107, 5, '2025-02-16 05:52:14'),
(534, 1, 107, 5, '2025-02-16 05:52:14'),
(535, 1, 107, 4, '2025-02-16 05:52:14'),
(536, 1, 108, 5, '2025-02-16 05:52:14'),
(537, 1, 108, 5, '2025-02-16 05:52:14'),
(538, 1, 108, 5, '2025-02-16 05:52:14'),
(539, 1, 108, 5, '2025-02-16 05:52:14'),
(540, 1, 108, 5, '2025-02-16 05:52:14'),
(541, 1, 109, 5, '2025-02-16 05:52:14'),
(542, 1, 109, 5, '2025-02-16 05:52:14'),
(543, 1, 109, 5, '2025-02-16 05:52:14'),
(544, 1, 109, 5, '2025-02-16 05:52:14'),
(545, 1, 109, 5, '2025-02-16 05:52:14'),
(546, 1, 110, 5, '2025-02-16 05:52:14'),
(547, 1, 110, 5, '2025-02-16 05:52:14'),
(548, 1, 110, 5, '2025-02-16 05:52:14'),
(549, 1, 110, 5, '2025-02-16 05:52:14'),
(550, 1, 110, 4, '2025-02-16 05:52:14'),
(551, 1, 111, 5, '2025-02-16 05:52:14'),
(552, 1, 111, 5, '2025-02-16 05:52:14'),
(553, 1, 111, 5, '2025-02-16 05:52:14'),
(554, 1, 111, 5, '2025-02-16 05:52:14'),
(555, 1, 111, 5, '2025-02-16 05:52:14'),
(556, 1, 112, 5, '2025-02-16 05:52:14'),
(557, 1, 112, 5, '2025-02-16 05:52:14'),
(558, 1, 112, 5, '2025-02-16 05:52:14'),
(559, 1, 112, 5, '2025-02-16 05:52:14'),
(560, 1, 112, 5, '2025-02-16 05:52:14'),
(561, 1, 113, 5, '2025-02-16 05:52:14'),
(562, 1, 113, 5, '2025-02-16 05:52:14'),
(563, 1, 113, 5, '2025-02-16 05:52:14'),
(564, 1, 113, 5, '2025-02-16 05:52:14'),
(565, 1, 113, 5, '2025-02-16 05:52:14'),
(566, 1, 114, 5, '2025-02-16 05:52:14'),
(567, 1, 114, 5, '2025-02-16 05:52:14'),
(568, 1, 114, 5, '2025-02-16 05:52:14'),
(569, 1, 114, 5, '2025-02-16 05:52:14'),
(570, 1, 114, 4, '2025-02-16 05:52:14'),
(571, 1, 115, 5, '2025-02-16 05:52:14'),
(572, 1, 115, 5, '2025-02-16 05:52:14'),
(573, 1, 115, 5, '2025-02-16 05:52:14'),
(574, 1, 115, 5, '2025-02-16 05:52:14'),
(575, 1, 115, 4, '2025-02-16 05:52:14'),
(576, 1, 116, 5, '2025-02-16 05:52:14'),
(577, 1, 116, 5, '2025-02-16 05:52:14'),
(578, 1, 116, 5, '2025-02-16 05:52:14'),
(579, 1, 116, 5, '2025-02-16 05:52:14'),
(580, 1, 116, 4, '2025-02-16 05:52:14'),
(581, 1, 117, 5, '2025-02-16 05:52:14'),
(582, 1, 117, 5, '2025-02-16 05:52:14'),
(583, 1, 117, 5, '2025-02-16 05:52:14'),
(584, 1, 117, 5, '2025-02-16 05:52:14'),
(585, 1, 117, 4, '2025-02-16 05:52:14'),
(586, 1, 118, 5, '2025-02-16 05:52:14'),
(587, 1, 118, 5, '2025-02-16 05:52:14'),
(588, 1, 118, 5, '2025-02-16 05:52:14'),
(589, 1, 118, 5, '2025-02-16 05:52:14'),
(590, 1, 118, 5, '2025-02-16 05:52:14'),
(591, 1, 119, 5, '2025-02-16 05:52:14'),
(592, 1, 119, 5, '2025-02-16 05:52:14'),
(593, 1, 119, 5, '2025-02-16 05:52:14'),
(594, 1, 119, 5, '2025-02-16 05:52:14'),
(595, 1, 119, 4, '2025-02-16 05:52:14'),
(596, 1, 120, 5, '2025-02-16 05:52:14'),
(597, 1, 120, 5, '2025-02-16 05:52:14'),
(598, 1, 120, 5, '2025-02-16 05:52:14'),
(599, 1, 120, 5, '2025-02-16 05:52:14'),
(600, 1, 120, 4, '2025-02-16 05:52:14'),
(601, 1, 121, 5, '2025-02-16 05:54:07'),
(602, 1, 121, 5, '2025-02-16 05:54:07'),
(603, 1, 121, 5, '2025-02-16 05:54:07'),
(604, 1, 121, 5, '2025-02-16 05:54:07'),
(605, 1, 121, 4, '2025-02-16 05:54:07'),
(606, 1, 122, 5, '2025-02-16 05:54:07'),
(607, 1, 122, 5, '2025-02-16 05:54:07'),
(608, 1, 122, 5, '2025-02-16 05:54:07'),
(609, 1, 122, 5, '2025-02-16 05:54:07'),
(610, 1, 122, 4, '2025-02-16 05:54:07'),
(611, 1, 123, 5, '2025-02-16 05:54:07'),
(612, 1, 123, 5, '2025-02-16 05:54:07'),
(613, 1, 123, 5, '2025-02-16 05:54:07'),
(614, 1, 123, 5, '2025-02-16 05:54:07'),
(615, 1, 123, 5, '2025-02-16 05:54:07'),
(616, 1, 124, 5, '2025-02-16 05:54:07'),
(617, 1, 124, 5, '2025-02-16 05:54:07'),
(618, 1, 124, 5, '2025-02-16 05:54:07'),
(619, 1, 124, 5, '2025-02-16 05:54:07'),
(620, 1, 124, 4, '2025-02-16 05:54:07'),
(621, 1, 125, 5, '2025-02-16 05:54:07'),
(622, 1, 125, 5, '2025-02-16 05:54:07'),
(623, 1, 125, 5, '2025-02-16 05:54:07'),
(624, 1, 125, 5, '2025-02-16 05:54:07'),
(625, 1, 125, 4, '2025-02-16 05:54:07'),
(626, 1, 126, 5, '2025-02-16 05:54:07'),
(627, 1, 126, 5, '2025-02-16 05:54:07'),
(628, 1, 126, 5, '2025-02-16 05:54:07'),
(629, 1, 126, 5, '2025-02-16 05:54:07'),
(630, 1, 126, 4, '2025-02-16 05:54:07'),
(631, 1, 127, 5, '2025-02-16 05:54:07'),
(632, 1, 127, 5, '2025-02-16 05:54:07'),
(633, 1, 127, 5, '2025-02-16 05:54:07'),
(634, 1, 127, 5, '2025-02-16 05:54:07'),
(635, 1, 127, 4, '2025-02-16 05:54:07'),
(636, 1, 128, 5, '2025-02-16 05:54:07'),
(637, 1, 128, 5, '2025-02-16 05:54:07'),
(638, 1, 128, 5, '2025-02-16 05:54:07'),
(639, 1, 128, 5, '2025-02-16 05:54:07'),
(640, 1, 128, 5, '2025-02-16 05:54:07'),
(641, 1, 129, 5, '2025-02-16 05:54:07'),
(642, 1, 129, 5, '2025-02-16 05:54:07'),
(643, 1, 129, 5, '2025-02-16 05:54:07'),
(644, 1, 129, 5, '2025-02-16 05:54:07'),
(645, 1, 129, 5, '2025-02-16 05:54:07'),
(646, 1, 130, 5, '2025-02-16 05:54:07'),
(647, 1, 130, 5, '2025-02-16 05:54:07'),
(648, 1, 130, 5, '2025-02-16 05:54:07'),
(649, 1, 130, 5, '2025-02-16 05:54:07'),
(650, 1, 130, 4, '2025-02-16 05:54:07'),
(651, 1, 131, 5, '2025-02-16 05:54:07'),
(652, 1, 131, 5, '2025-02-16 05:54:07'),
(653, 1, 131, 5, '2025-02-16 05:54:07'),
(654, 1, 131, 5, '2025-02-16 05:54:07'),
(655, 1, 131, 4, '2025-02-16 05:54:07'),
(656, 1, 132, 5, '2025-02-16 05:54:07'),
(657, 1, 132, 5, '2025-02-16 05:54:07'),
(658, 1, 132, 5, '2025-02-16 05:54:07'),
(659, 1, 132, 5, '2025-02-16 05:54:07'),
(660, 1, 132, 4, '2025-02-16 05:54:07'),
(661, 1, 133, 5, '2025-02-16 05:54:07'),
(662, 1, 133, 5, '2025-02-16 05:54:07'),
(663, 1, 133, 5, '2025-02-16 05:54:07'),
(664, 1, 133, 5, '2025-02-16 05:54:07'),
(665, 1, 133, 5, '2025-02-16 05:54:07'),
(666, 1, 134, 5, '2025-02-16 05:54:07'),
(667, 1, 134, 5, '2025-02-16 05:54:07'),
(668, 1, 134, 5, '2025-02-16 05:54:07'),
(669, 1, 134, 5, '2025-02-16 05:54:07'),
(670, 1, 134, 4, '2025-02-16 05:54:07'),
(671, 1, 135, 5, '2025-02-16 05:54:07'),
(672, 1, 135, 5, '2025-02-16 05:54:07'),
(673, 1, 135, 5, '2025-02-16 05:54:07'),
(674, 1, 135, 5, '2025-02-16 05:54:07'),
(675, 1, 135, 5, '2025-02-16 05:54:07'),
(676, 1, 136, 5, '2025-02-16 05:54:07'),
(677, 1, 136, 5, '2025-02-16 05:54:07'),
(678, 1, 136, 5, '2025-02-16 05:54:07'),
(679, 1, 136, 5, '2025-02-16 05:54:07'),
(680, 1, 136, 4, '2025-02-16 05:54:07'),
(681, 1, 137, 5, '2025-02-16 05:54:07'),
(682, 1, 137, 5, '2025-02-16 05:54:07'),
(683, 1, 137, 5, '2025-02-16 05:54:07'),
(684, 1, 137, 5, '2025-02-16 05:54:07'),
(685, 1, 137, 4, '2025-02-16 05:54:07'),
(686, 1, 138, 5, '2025-02-16 05:54:07'),
(687, 1, 138, 5, '2025-02-16 05:54:07'),
(688, 1, 138, 5, '2025-02-16 05:54:07'),
(689, 1, 138, 5, '2025-02-16 05:54:07'),
(690, 1, 138, 5, '2025-02-16 05:54:07'),
(691, 1, 139, 5, '2025-02-16 05:54:07'),
(692, 1, 139, 5, '2025-02-16 05:54:07'),
(693, 1, 139, 5, '2025-02-16 05:54:07'),
(694, 1, 139, 5, '2025-02-16 05:54:07'),
(695, 1, 139, 4, '2025-02-16 05:54:07'),
(696, 1, 140, 5, '2025-02-16 05:54:07'),
(697, 1, 140, 5, '2025-02-16 05:54:07'),
(698, 1, 140, 5, '2025-02-16 05:54:07'),
(699, 1, 140, 5, '2025-02-16 05:54:07'),
(700, 1, 140, 4, '2025-02-16 05:54:07'),
(701, 1, 141, 5, '2025-02-16 05:54:07'),
(702, 1, 141, 5, '2025-02-16 05:54:07'),
(703, 1, 141, 5, '2025-02-16 05:54:07'),
(704, 1, 141, 5, '2025-02-16 05:54:07'),
(705, 1, 141, 4, '2025-02-16 05:54:07'),
(706, 1, 142, 5, '2025-02-16 05:54:07'),
(707, 1, 142, 5, '2025-02-16 05:54:07'),
(708, 1, 142, 5, '2025-02-16 05:54:07'),
(709, 1, 142, 5, '2025-02-16 05:54:07'),
(710, 1, 142, 4, '2025-02-16 05:54:07'),
(711, 1, 143, 5, '2025-02-16 05:54:07'),
(712, 1, 143, 5, '2025-02-16 05:54:07'),
(713, 1, 143, 5, '2025-02-16 05:54:07'),
(714, 1, 143, 5, '2025-02-16 05:54:07'),
(715, 1, 143, 4, '2025-02-16 05:54:07'),
(716, 1, 144, 5, '2025-02-16 05:54:07'),
(717, 1, 144, 5, '2025-02-16 05:54:07'),
(718, 1, 144, 5, '2025-02-16 05:54:07'),
(719, 1, 144, 5, '2025-02-16 05:54:07'),
(720, 1, 144, 4, '2025-02-16 05:54:07'),
(721, 1, 145, 5, '2025-02-16 05:54:07'),
(722, 1, 145, 5, '2025-02-16 05:54:07'),
(723, 1, 145, 5, '2025-02-16 05:54:07'),
(724, 1, 145, 5, '2025-02-16 05:54:07'),
(725, 1, 145, 5, '2025-02-16 05:54:07'),
(726, 1, 146, 5, '2025-02-16 05:54:07'),
(727, 1, 146, 5, '2025-02-16 05:54:07'),
(728, 1, 146, 5, '2025-02-16 05:54:07'),
(729, 1, 146, 5, '2025-02-16 05:54:07'),
(730, 1, 146, 5, '2025-02-16 05:54:07'),
(731, 1, 147, 5, '2025-02-16 05:54:07'),
(732, 1, 147, 5, '2025-02-16 05:54:07'),
(733, 1, 147, 5, '2025-02-16 05:54:07'),
(734, 1, 147, 5, '2025-02-16 05:54:07'),
(735, 1, 147, 4, '2025-02-16 05:54:07'),
(736, 1, 148, 5, '2025-02-16 05:54:07'),
(737, 1, 148, 5, '2025-02-16 05:54:07'),
(738, 1, 148, 5, '2025-02-16 05:54:07'),
(739, 1, 148, 5, '2025-02-16 05:54:07'),
(740, 1, 148, 4, '2025-02-16 05:54:07'),
(741, 1, 149, 5, '2025-02-16 05:54:07'),
(742, 1, 149, 5, '2025-02-16 05:54:07'),
(743, 1, 149, 5, '2025-02-16 05:54:07'),
(744, 1, 149, 5, '2025-02-16 05:54:07'),
(745, 1, 149, 4, '2025-02-16 05:54:07'),
(746, 1, 150, 5, '2025-02-16 05:54:07'),
(747, 1, 150, 5, '2025-02-16 05:54:07'),
(748, 1, 150, 5, '2025-02-16 05:54:07'),
(749, 1, 150, 5, '2025-02-16 05:54:07'),
(750, 1, 150, 5, '2025-02-16 05:54:07');

--
-- Bẫy `product_ratings`
--
DELIMITER $$
CREATE TRIGGER `before_delete_product_ratings` AFTER DELETE ON `product_ratings` FOR EACH ROW BEGIN
    DECLARE avg_rating FLOAT;
    SELECT AVG(rating) INTO avg_rating FROM product_ratings WHERE product_id = OLD.product_id;
    UPDATE products SET average_rating = avg_rating WHERE product_id = OLD.product_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `before_insert_product_ratings` AFTER INSERT ON `product_ratings` FOR EACH ROW BEGIN
    DECLARE avg_rating FLOAT;
    SELECT AVG(rating) INTO avg_rating FROM product_ratings WHERE product_id = NEW.product_id;
    UPDATE products SET average_rating = avg_rating WHERE product_id = NEW.product_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `before_update_product_ratings` AFTER UPDATE ON `product_ratings` FOR EACH ROW BEGIN
    DECLARE avg_rating FLOAT;
    SELECT AVG(rating) INTO avg_rating FROM product_ratings WHERE product_id = NEW.product_id;
    UPDATE products SET average_rating = avg_rating WHERE product_id = NEW.product_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_rating_count_delete` AFTER DELETE ON `product_ratings` FOR EACH ROW BEGIN
  UPDATE products
  SET rating_count = (
    SELECT COUNT(*)
    FROM product_ratings
    WHERE product_id = OLD.product_id
  )
  WHERE product_id = OLD.product_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_rating_count_insert` AFTER INSERT ON `product_ratings` FOR EACH ROW BEGIN
  UPDATE products
  SET rating_count = (
    SELECT COUNT(*)
    FROM product_ratings
    WHERE product_id = NEW.product_id
  )
  WHERE product_id = NEW.product_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_rating_count_update` AFTER UPDATE ON `product_ratings` FOR EACH ROW BEGIN
  UPDATE products
  SET rating_count = (
    SELECT COUNT(*)
    FROM product_ratings
    WHERE product_id = NEW.product_id
  )
  WHERE product_id = NEW.product_id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_sizes`
--

CREATE TABLE `product_sizes` (
  `size_id` int(9) NOT NULL,
  `size_name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `product_sizes`
--

INSERT INTO `product_sizes` (`size_id`, `size_name`) VALUES
(1, 'S'),
(2, 'M'),
(3, 'L'),
(4, 'XL'),
(5, '25'),
(6, '26'),
(7, '27'),
(8, '28'),
(9, '29'),
(10, '30'),
(11, '31'),
(12, '32'),
(13, '33'),
(14, '34'),
(15, '35'),
(16, '36'),
(17, '37'),
(18, '38'),
(19, '39'),
(20, '40'),
(21, '41'),
(22, '42'),
(23, '43'),
(24, '44'),
(25, '45'),
(26, 'Free Size'),
(27, '160x200x28 cm'),
(28, '180x200x28 cm'),
(29, '200x220x28 cm'),
(30, '1M8 x 2M4 x 0.6M'),
(31, '2M x 2M4 x 0.6M');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_subcategories`
--

CREATE TABLE `product_subcategories` (
  `subcategory_id` int(9) NOT NULL,
  `category_id` int(9) NOT NULL,
  `subcategory_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `product_subcategories`
--

INSERT INTO `product_subcategories` (`subcategory_id`, `category_id`, `subcategory_name`) VALUES
(1, 1, 'Áo'),
(2, 1, 'Quần'),
(3, 2, 'Áo'),
(4, 2, 'Chân váy'),
(5, 2, 'Đầm'),
(6, 2, 'Quần'),
(7, 2, 'Váy'),
(8, 3, 'Đồng hồ'),
(9, 3, 'Kính'),
(10, 3, 'Mũ'),
(11, 4, 'Dép'),
(12, 4, 'Giày'),
(13, 5, 'Dép'),
(14, 5, 'Giày'),
(15, 5, 'Guốc'),
(16, 6, 'Chăn'),
(17, 6, 'Đệm'),
(18, 6, 'Giường'),
(19, 6, 'Tủ'),
(20, 7, 'Đa dạng'),
(21, 7, 'Lắp ghép'),
(22, 7, 'Mô hình'),
(23, 7, 'Xe oto'),
(24, 8, 'Balo'),
(25, 8, 'Túi xách');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `roles`
--

CREATE TABLE `roles` (
  `role_id` int(9) NOT NULL,
  `role_name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `roles`
--

INSERT INTO `roles` (`role_id`, `role_name`) VALUES
(1, 'admin'),
(2, 'user'),
(3, 'manager');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shipping_addresses`
--

CREATE TABLE `shipping_addresses` (
  `address_id` int(9) NOT NULL,
  `account_id` int(9) NOT NULL,
  `contact_name` varchar(50) NOT NULL,
  `contact_phone` varchar(15) NOT NULL,
  `address` varchar(255) NOT NULL,
  `address_details` varchar(255) NOT NULL,
  `address_default` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `shipping_addresses`
--

INSERT INTO `shipping_addresses` (`address_id`, `account_id`, `contact_name`, `contact_phone`, `address`, `address_details`, `address_default`) VALUES
(1, 2, 'Dương Văn Kiên', '0888888888', 'Xã Toàn Thắng, Huyện Hiệp Hòa, Tỉnh Bắc Giang', 'Hoàng Giang', 0),
(2, 2, 'Hồ Anh Minh', '0999999999', 'Phường Võ Cường, Thành phố Bắc Ninh, Tỉnh Bắc Ninh', 'Vũ Diệu', 1),
(3, 2, 'Nguyễn Trần Huy', '0666666666', 'Xã Hương Trạch, Huyện Hương Khê, Tỉnh Hà Tĩnh', 'Tân Phúc', 0),
(4, 6, 'Vũ Thanh Hùng', '0333333333', 'Phường Lĩnh Nam, Quận Hoàng Mai, Thành phố Hà Nội', '218 Đường Lĩnh Nam', 1),
(5, 5, 'Trần Thu Hương', '0938112233', 'Phường Lĩnh Nam, Quận Hoàng Mai, Thành phố Hà Nội', '218 Đường Lĩnh Nam', 1),
(6, 4, 'Nguyễn Hoàng Anh', '0985385223', 'Phường Lĩnh Nam, Quận Hoàng Mai, Thành phố Hà Nội', '218 Đường Lĩnh Nam', 1);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`account_id`),
  ADD UNIQUE KEY `unique_username` (`username`),
  ADD UNIQUE KEY `unique_email` (`email`),
  ADD UNIQUE KEY `unique_phone` (`phone_number`),
  ADD KEY `fk_accounts_to_roles` (`role_id`);

--
-- Chỉ mục cho bảng `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`cart_id`),
  ADD KEY `fk_cart_to_accounts` (`account_id`),
  ADD KEY `fk_cart_to_product_details` (`product_detail_id`);

--
-- Chỉ mục cho bảng `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`contact_id`),
  ADD KEY `fk_contacts_to_accounts` (`account_id`);

--
-- Chỉ mục cho bảng `discount_codes`
--
ALTER TABLE `discount_codes`
  ADD PRIMARY KEY (`discount_id`);

--
-- Chỉ mục cho bảng `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`invoice_id`),
  ADD KEY `fk_invoices_to_accounts` (`account_id`);

--
-- Chỉ mục cho bảng `invoice_details`
--
ALTER TABLE `invoice_details`
  ADD PRIMARY KEY (`invoice_detail_id`),
  ADD KEY `fk_invoice_details_to_invoices` (`invoice_id`),
  ADD KEY `fk_invoice_details_to_products` (`product_id`),
  ADD KEY `fk_invoice_details_to_product_details` (`product_detail_id`);

--
-- Chỉ mục cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`);

--
-- Chỉ mục cho bảng `pending_ratings`
--
ALTER TABLE `pending_ratings`
  ADD PRIMARY KEY (`pending_rating_id`),
  ADD KEY `fk_pending_ratings_to_accounts` (`account_id`),
  ADD KEY `fk_pending_ratings_to_products` (`product_id`),
  ADD KEY `fk_pending_ratings_to_invoices` (`invoice_id`);

--
-- Chỉ mục cho bảng `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `fk_products_to_product_categories` (`category_id`) USING BTREE,
  ADD KEY `fk_products_to_product_subcategories` (`subcategory_id`);

--
-- Chỉ mục cho bảng `product_activity_history`
--
ALTER TABLE `product_activity_history`
  ADD PRIMARY KEY (`activity_history_id`),
  ADD KEY `fk_products_details_history_to_products` (`product_id`);

--
-- Chỉ mục cho bảng `product_categories`
--
ALTER TABLE `product_categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Chỉ mục cho bảng `product_colors`
--
ALTER TABLE `product_colors`
  ADD PRIMARY KEY (`color_id`);

--
-- Chỉ mục cho bảng `product_details`
--
ALTER TABLE `product_details`
  ADD PRIMARY KEY (`product_detail_id`),
  ADD KEY `fk_product_details_to_products` (`product_id`),
  ADD KEY `fk_product_details_to_product_colors` (`color_id`),
  ADD KEY `fk_product_details_to_product_sizes` (`size_id`);

--
-- Chỉ mục cho bảng `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`image_id`),
  ADD KEY `fk_products_images_to_products` (`product_id`);

--
-- Chỉ mục cho bảng `product_ratings`
--
ALTER TABLE `product_ratings`
  ADD PRIMARY KEY (`rating_id`),
  ADD KEY `fk_products_ratings_to_accounts` (`account_id`),
  ADD KEY `fk_products_ratings_to_products` (`product_id`);

--
-- Chỉ mục cho bảng `product_sizes`
--
ALTER TABLE `product_sizes`
  ADD PRIMARY KEY (`size_id`);

--
-- Chỉ mục cho bảng `product_subcategories`
--
ALTER TABLE `product_subcategories`
  ADD PRIMARY KEY (`subcategory_id`),
  ADD KEY `fk_subcategory_to_category` (`category_id`);

--
-- Chỉ mục cho bảng `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`);

--
-- Chỉ mục cho bảng `shipping_addresses`
--
ALTER TABLE `shipping_addresses`
  ADD PRIMARY KEY (`address_id`),
  ADD KEY `fk_addresses_to_accounts` (`account_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `accounts`
--
ALTER TABLE `accounts`
  MODIFY `account_id` int(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `cart`
--
ALTER TABLE `cart`
  MODIFY `cart_id` int(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT cho bảng `contacts`
--
ALTER TABLE `contacts`
  MODIFY `contact_id` int(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `discount_codes`
--
ALTER TABLE `discount_codes`
  MODIFY `discount_id` int(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `invoices`
--
ALTER TABLE `invoices`
  MODIFY `invoice_id` int(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1091782770;

--
-- AUTO_INCREMENT cho bảng `invoice_details`
--
ALTER TABLE `invoice_details`
  MODIFY `invoice_detail_id` int(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT cho bảng `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `pending_ratings`
--
ALTER TABLE `pending_ratings`
  MODIFY `pending_rating_id` int(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=152;

--
-- AUTO_INCREMENT cho bảng `product_activity_history`
--
ALTER TABLE `product_activity_history`
  MODIFY `activity_history_id` int(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=153;

--
-- AUTO_INCREMENT cho bảng `product_categories`
--
ALTER TABLE `product_categories`
  MODIFY `category_id` int(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `product_colors`
--
ALTER TABLE `product_colors`
  MODIFY `color_id` int(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT cho bảng `product_details`
--
ALTER TABLE `product_details`
  MODIFY `product_detail_id` int(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1009;

--
-- AUTO_INCREMENT cho bảng `product_images`
--
ALTER TABLE `product_images`
  MODIFY `image_id` int(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=394;

--
-- AUTO_INCREMENT cho bảng `product_ratings`
--
ALTER TABLE `product_ratings`
  MODIFY `rating_id` int(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=751;

--
-- AUTO_INCREMENT cho bảng `product_sizes`
--
ALTER TABLE `product_sizes`
  MODIFY `size_id` int(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT cho bảng `product_subcategories`
--
ALTER TABLE `product_subcategories`
  MODIFY `subcategory_id` int(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT cho bảng `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `shipping_addresses`
--
ALTER TABLE `shipping_addresses`
  MODIFY `address_id` int(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `accounts`
--
ALTER TABLE `accounts`
  ADD CONSTRAINT `fk_accounts_to_roles` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `fk_cart_to_accounts` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_cart_to_product_details` FOREIGN KEY (`product_detail_id`) REFERENCES `product_details` (`product_detail_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `contacts`
--
ALTER TABLE `contacts`
  ADD CONSTRAINT `fk_contacts_to_accounts` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `fk_invoices_to_accounts` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `invoice_details`
--
ALTER TABLE `invoice_details`
  ADD CONSTRAINT `fk_invoice_details_to_invoices` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`invoice_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_invoice_details_to_product_details` FOREIGN KEY (`product_detail_id`) REFERENCES `product_details` (`product_detail_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_invoice_details_to_products` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `pending_ratings`
--
ALTER TABLE `pending_ratings`
  ADD CONSTRAINT `fk_pending_ratings_to_accounts` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_pending_ratings_to_invoices` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`invoice_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_pending_ratings_to_products` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_products_to_product_categories` FOREIGN KEY (`category_id`) REFERENCES `product_categories` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_products_to_product_subcategories` FOREIGN KEY (`subcategory_id`) REFERENCES `product_subcategories` (`subcategory_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `product_activity_history`
--
ALTER TABLE `product_activity_history`
  ADD CONSTRAINT `fk_products_details_history_to_products` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `product_details`
--
ALTER TABLE `product_details`
  ADD CONSTRAINT `fk_product_details_to_product_colors` FOREIGN KEY (`color_id`) REFERENCES `product_colors` (`color_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_product_details_to_product_sizes` FOREIGN KEY (`size_id`) REFERENCES `product_sizes` (`size_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_product_details_to_products` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `fk_products_images_to_products` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `product_ratings`
--
ALTER TABLE `product_ratings`
  ADD CONSTRAINT `fk_products_ratings_to_accounts` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_products_ratings_to_products` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `product_subcategories`
--
ALTER TABLE `product_subcategories`
  ADD CONSTRAINT `fk_subcategory_to_category` FOREIGN KEY (`category_id`) REFERENCES `product_categories` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `shipping_addresses`
--
ALTER TABLE `shipping_addresses`
  ADD CONSTRAINT `fk_addresses_to_accounts` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE ON UPDATE CASCADE;

DELIMITER $$
--
-- Sự kiện
--
CREATE DEFINER=`root`@`localhost` EVENT `update_discount_status_daily` ON SCHEDULE EVERY 1 DAY STARTS '2025-02-24 21:54:43' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
    UPDATE discount_codes
    SET status = CASE
        WHEN quantity > 0 AND CURDATE() >= start_date AND CURDATE() <= end_date THEN 'active'
        WHEN CURDATE() < start_date THEN 'not_yet_active'
        ELSE 'expired'
    END;
END$$

CREATE DEFINER=`root`@`localhost` EVENT `update_status_expired_event` ON SCHEDULE EVERY 1 DAY STARTS '2025-03-03 15:44:46' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
    UPDATE discount_codes
    SET status = 'expired'
    WHERE end_date < CURDATE() AND status <> 'expired';
END$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
