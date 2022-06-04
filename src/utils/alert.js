import Swal from "sweetalert2";
import messages from "../constants/messages";

const Alert = {
  error(error, msg) {
    Swal.fire({
      title: messages.error,
      icon: "error",
      denyButtonText: "OK",
      denyButtonColor: "#E02424",
      html: error
        ? `<div class="font-bold">${error}</div>${msg ? `<p>${msg}</p>` : ""}`
        : "",
    });
  },

  loading(title) {
    Swal.fire(title);
    Swal.showLoading();
  },

  success(title, msg, onClose) {
    Swal.fire({
      title,
      icon: "success",
      text: msg,
      denyButtonText: "OK",
      didClose() {
        if (onClose) onClose();
      },
    });
  },

  abort() {
    Swal.close();
  },
};

export default Alert;
