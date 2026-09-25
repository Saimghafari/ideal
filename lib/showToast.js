import { Slide, toast } from "react-toastify";

/** Prefer API body message over Axios status-code text */
export const getErrorMessage = (
  error,
  fallback = "Something went wrong. Please try again."
) =>
  error?.response?.data?.message ||
  error?.message ||
  fallback;

export const showToast = (type, message, extra = {}) => {
  const options = {
    position: "top-right",
    autoClose: type === "info" ? 10000 : 4000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    theme: "light",
    transition: Slide,
    className: "nn-toast",
    bodyClassName: "nn-toast-body",
    ...extra,
  };

  switch (type) {
    case "info":
      toast.info(message, options);
      break;
    case "success":
      toast.success(message, options);
      break;
    case "warning":
      toast.warning(message, options);
      break;
    case "error":
      toast.error(message, options);
      break;
    default:
      toast(message, options);
      break;
  }
};
