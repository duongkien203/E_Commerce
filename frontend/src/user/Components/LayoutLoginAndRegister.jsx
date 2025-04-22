import React from "react";
import Header from "./Header";
import ToastProvider from "./ToastProvider"; // Import the ToastProvider
import FloatingSidebar from "./FloatingSidebar";
import ChatSupport from "./Chatbot";
import Footer from "./Footer";
import BackToTop from "./BackToTop";
import styles from "../CSS/LayoutLoginAndRegister.module.css"; // Thêm file CSS nếu cần

function LayoutLoginAndRegister({ children }) {
  return (
    <div className={styles.appContainer}>
      <header>
        <Header />
      </header>
      <main className={styles.contentContainer}>{children}</main>
      <ToastProvider />
      <FloatingSidebar />
      <BackToTop />
      <ChatSupport />
      <footer className={styles.footer}>
        <Footer />
      </footer>
    </div>
  );
}

export default LayoutLoginAndRegister;
