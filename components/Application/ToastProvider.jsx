"use client";

import dynamic from "next/dynamic";
import "react-toastify/dist/ReactToastify.css";

const ToastContainer = dynamic(
  () => import("react-toastify").then((mod) => mod.ToastContainer),
  { ssr: false }
);

export default function ToastProvider() {
  return (
    <ToastContainer
      theme="colored"
      position="top-right"
      autoClose={4000}
      hideProgressBar
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable={false}
      toastClassName="nn-toast"
      bodyClassName="nn-toast-body"
    />
  );
}
