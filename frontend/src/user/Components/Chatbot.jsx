import React, { useState } from "react";
import Chatbot, { createChatBotMessage } from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import { FaTimes, FaExpand, FaCompress } from "react-icons/fa";
import { BsChatDots } from "react-icons/bs";
import styles from "../CSS/ChatSupport.module.css";
import axios from "axios";

// Component tùy chỉnh cho header
const CustomHeader = ({ toggleChat, toggleExpand, isExpanded }) => (
  <div
    style={{
      background: "#007bff",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: "auto",
      padding: "10px",
      fontSize: "16px",
    }}
  >
    <span>Trợ lý thân thiện của bạn</span>
    <div style={{ display: "flex", gap: "10px" }}>
      <button className={styles.expandBtn} onClick={toggleExpand}>
        {isExpanded ? <FaCompress /> : <FaExpand />}
      </button>
      <button className={styles.closeBtn} onClick={toggleChat}>
        <FaTimes />
      </button>
    </div>
  </div>
);

// Component nút tùy chọn (chỉ hiển thị, không tương tác)
const OptionsButtons = () => (
  <div
    style={{
      display: "flex",
      gap: "10px",
      marginTop: "10px",
      flexWrap: "wrap",
    }}
  >
    <span
      style={{
        padding: "8px 12px",
        backgroundColor: "#007bff", // Nền xanh
        color: "white", // Chữ trắng
        borderRadius: "5px",
        cursor: "default",
        fontSize: "14px",
      }}
    >
      Gợi ý sản phẩm
    </span>
    <span
      style={{
        padding: "8px 12px",
        backgroundColor: "#007bff", // Nền xanh
        color: "white", // Chữ trắng
        borderRadius: "5px",
        cursor: "default",
        fontSize: "14px",
      }}
    >
      Hỗ trợ thanh toán
    </span>
  </div>
);

// Cấu hình chatbot
const config = {
  initialMessages: [
    createChatBotMessage("Xin chào! Tôi có thể hỗ trợ vấn đề gì cho bạn?", {
      withAvatar: true,
    }),
    createChatBotMessage("Dưới đây là các gợi ý bạn có thể tham khảo:", {
      withAvatar: true,
      widget: "optionsButtons",
    }),
  ],
  botName: "Trợ lý thân thiện của bạn",
  customStyles: {
    botMessageBox: {
      backgroundColor: "#007bff",
    },
    chatButton: {
      backgroundColor: "#007bff",
    },
  },
  customComponents: {
    header: (props) => <CustomHeader {...props} />,
  },
  widgets: [
    {
      widgetName: "optionsButtons",
      widgetFunc: (props) => <OptionsButtons {...props} />,
    },
  ],
};

// Hàm xử lý tin nhắn người dùng
const MessageParser = ({ children, actions }) => {
  const parse = (message) => {
    console.log("MessageParser parse:", message);
    if (actions && actions.handleUserMessage) {
      actions.handleUserMessage(message);
    } else {
      console.error("actions.handleUserMessage is undefined");
    }
  };

  return React.cloneElement(children, { parse });
};

// Hàm xử lý phản hồi của bot
const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const getSimilarityScore = (queryWords, productName) => {
    const productWords = productName.toLowerCase().split(" ");
    const matchedWords = queryWords.filter((word) =>
      productWords.includes(word)
    );
    return (
      matchedWords.length / Math.max(queryWords.length, productWords.length)
    );
  };

  const handleUserMessage = async (message) => {
    console.log("handleUserMessage:", message);
    const lowerMessage = message.toLowerCase();

    if (lowerMessage === "gợi ý sản phẩm") {
      const botMessage = createChatBotMessage(
        "Bạn vui lòng nhập tên sản phẩm để tôi tìm các sản phẩm tương tự có trong cửa hàng.",
        { withAvatar: true }
      );
      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, botMessage],
      }));
    } else if (lowerMessage === "hỗ trợ thanh toán") {
      const botMessage = createChatBotMessage(
        "Bạn vui lòng liên hệ với quản trị viên để được hỗ trợ thanh toán.",
        { withAvatar: true }
      );
      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, botMessage],
      }));
    } else {
      try {
        const response = await axios.get(
          "http://localhost/E_Commerce/backend/admin/api/GetProducts.php"
        );
        const { status, data } = response.data;

        if (status === "success" && data.length > 0) {
          const queryWords = lowerMessage
            .split(" ")
            .filter((word) => word.length > 0);

          const filteredProducts = data
            .map((product) => ({
              ...product,
              similarity: getSimilarityScore(queryWords, product.product_name),
            }))
            .filter((product) => product.similarity > 0.3)
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 3);

          if (filteredProducts.length > 0) {
            const productList = filteredProducts
              .map(
                (p) =>
                  `${p.product_name} - Giá: ${p.sale_price} VND (Giảm ${p.sale}%). <a href="http://localhost:3000/products/${p.product_id}" target="_blank">Xem chi tiết</a>`
              )
              .join(", ");
            const botMessage = createChatBotMessage(
              `Tôi tìm thấy các sản phẩm gần đúng: ${productList}. Bạn muốn biết thêm về sản phẩm nào?`,
              { withAvatar: true }
            );
            setState((prev) => ({
              ...prev,
              messages: [...prev.messages, botMessage],
            }));
          } else {
            const botMessage = createChatBotMessage(
              `Không tìm thấy sản phẩm nào gần giống với "${message}". Hãy thử từ khóa khác nhé!`,
              { withAvatar: true }
            );
            setState((prev) => ({
              ...prev,
              messages: [...prev.messages, botMessage],
            }));
          }
        } else {
          const botMessage = createChatBotMessage(
            "Hiện tại không có sản phẩm nào trong danh sách. Vui lòng thử lại sau!",
            { withAvatar: true }
          );
          setState((prev) => ({
            ...prev,
            messages: [...prev.messages, botMessage],
          }));
        }
      } catch (error) {
        const botMessage = createChatBotMessage(
          "Có lỗi xảy ra khi lấy danh sách sản phẩm. Vui lòng thử lại!",
          { withAvatar: true }
        );
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, botMessage],
        }));
      }
    }
  };

  const actions = { handleUserMessage };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions,
        });
      })}
    </div>
  );
};

function ChatSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isExpanded) setIsExpanded(false);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={styles.chatSupportContainer}>
      {isOpen ? (
        <div
          className={`${styles.chatbotWrapper} ${
            isExpanded ? styles.expanded : ""
          }`}
        >
          <Chatbot
            config={{
              ...config,
              customComponents: {
                header: () => (
                  <CustomHeader
                    toggleChat={toggleChat}
                    toggleExpand={toggleExpand}
                    isExpanded={isExpanded}
                  />
                ),
              },
            }}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
          />
        </div>
      ) : (
        <div className={styles.chatButtonWrapper}>
          <button className={styles.openBtn} onClick={toggleChat}>
            <BsChatDots />
          </button>
          <span className={styles.chatLabel}>Chat with us</span>
        </div>
      )}
    </div>
  );
}

export default ChatSupport;
