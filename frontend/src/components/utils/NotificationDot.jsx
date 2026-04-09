import React from "react";

const NotificationDot = ({ show = false }) => {
  return (
    <>
    <span className={`absolute -top-[1px] -right-[1px] z-10 w-2.5 h-2.5 bg-[var(--accent)] rounded-full animate-ping ${show ? "block" : "hidden"}`} />
    <span className={`absolute -top-[1px] -right-[1px] z-20 w-2.5 h-2.5 bg-red-500 rounded-full ${show ? "block" : "hidden"}`} />
  </>
  );
};

export default NotificationDot;
