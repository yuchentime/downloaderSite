import create from "zustand";

const alertInfo = {
  show: false,
  type: "alert-warning",
  msg: "",
};

export const useAlertStore = create((set) => ({
  alertInfo,
  notify: (alertInfo) => set(alertInfo),
  reset: () => set(alertInfo),
}));
