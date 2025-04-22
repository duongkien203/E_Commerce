import React, { useState } from "react";
import { FaFacebook, FaChevronRight, FaChevronLeft } from "react-icons/fa"; // Import icon
import { SiZalo } from "react-icons/si";
import "../CSS/FloatingSidebar.css";

const FloatingSidebar = () => {
  const [isOpen, setIsOpen] = useState(true); // Kiểm soát trạng thái mở/đóng sidebar

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`floating-sidebar ${isOpen ? "open" : "closed"}`}>
      {/* Nút bấm đóng/mở sidebar */}
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        {isOpen ? <FaChevronRight /> : <FaChevronLeft />}
      </div>

      {/* Các icon mạng xã hội */}
      <div className={`icons ${isOpen ? "open" : "closed"}`}>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="icon facebook"
        >
          <FaFacebook />
        </a>
        <a
          href="https://zalo.me"
          target="_blank"
          rel="noopener noreferrer"
          className="icon zalo"
        >
          <SiZalo />
        </a>
      </div>
    </div>
  );
};

export default FloatingSidebar;
