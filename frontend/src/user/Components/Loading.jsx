import React from "react";
import { TailSpin } from "react-loader-spinner";

const Loading = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999, // Đảm bảo luôn trên cùng
        pointerEvents: "auto", // Chặn thao tác phía sau
      }}
    >
      <TailSpin height="60" width="60" color="#3498db" ariaLabel="loading" />
    </div>
  );
};

export default Loading;
