import axios from "axios";

export const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const getToken = () => localStorage.getItem("sla_token");
export const setToken = (t) => localStorage.setItem("sla_token", t);
export const clearToken = () => localStorage.removeItem("sla_token");

export const authHeaders = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

export function formatApiErrorDetail(detail) {
  if (detail == null) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).filter(Boolean).join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

export const fetchSettings = async () => {
  const { data } = await axios.get(`${API}/settings`);
  return data;
};
