import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { LogOut, ExternalLink } from "lucide-react";
import { API, getToken, clearToken, authHeaders, formatApiErrorDetail } from "../lib/api";

const inputCls =
  "w-full px-3 py-2 rounded-lg border border-[#3a2f1b] bg-[#0a0906] text-[#f2e9d8] text-xs placeholder:text-[#6b5f4a] focus:outline-none focus:border-[#d4af37]";

export default function AdminDashboard() {
  const [tab, setTab] = useState("enquiries");
  const [enquiries, setEnquiries] = useState([]);
  const [settings, setSettings] = useState({ phone: "", whatsapp: "", address: "", hours: "", alert_email: "", external_staff_url: "", google_review_url: "" });
  const navigate = useNavigate();

  const loadEnquiries = useCallback(async () => {
    const { data } = await axios.get(`${API}/enquiries`, authHeaders());
    setEnquiries(data);
  }, []);

  const loadSettings = useCallback(async () => {
    const { data } = await axios.get(`${API}/settings`);
    setSettings({
      phone: data.phone || "", whatsapp: data.whatsapp || "", address: data.address || "",
      hours: data.hours || "", alert_email: data.alert_email || "", external_staff_url: data.external_staff_url || "",
      google_review_url: data.google_review_url || "",
    });
  }, []);

  useEffect(() => {
    if (!getToken()) { navigate("/admin"); return; }
    axios.get(`${API}/auth/me`, authHeaders())
      .then(() => { loadEnquiries(); loadSettings(); })
      .catch(() => { clearToken(); navigate("/admin"); });
  }, [navigate, loadEnquiries, loadSettings]);

  const logout = () => { clearToken(); navigate("/admin"); };

  const saveSettings = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/settings`, settings, authHeaders());
      toast.success("Settings saved. Website updated.");
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail));
    }
  };

  const tabs = [["enquiries", "Enquiries"], ["settings", "Settings"]];

  return (
    <div className="min-h-screen bg-[#0a0906] text-[#f2e9d8]" data-testid="admin-dashboard">
      <header className="border-b border-[#2a2313] sticky top-0 bg-[#0a0906] z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-black text-lg">SREE LAXMI</span>
            <span className="text-[10px] font-bold text-[#d4af37] uppercase tracking-widest">Staff Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            {settings.external_staff_url?.trim() && (
              <a
                href={settings.external_staff_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#d4af37] hover:text-[#eac968]"
                data-testid="tyre-manager-link"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Tyre Price Manager
              </a>
            )}
            <Link to="/" className="text-xs text-[#8a7d63] hover:text-[#d4af37]" data-testid="view-site-link">View Site</Link>
            <button onClick={logout} className="inline-flex items-center gap-1.5 text-xs font-bold text-[#a79a7e] hover:text-[#d4af37]" data-testid="logout-btn">
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-2 mb-8" data-testid="dashboard-tabs">
          {tabs.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              data-testid={`tab-${key}`}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                tab === key ? "bg-[#d4af37] text-[#0a0906]" : "border border-[#2a2313] text-[#a79a7e] hover:text-[#f2e9d8]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "enquiries" && (
          <div className="bg-[#131008] border border-[#2a2313] rounded-xl overflow-x-auto" data-testid="enquiries-panel">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#2a2313] text-[#d4af37] uppercase tracking-wider">
                  <th className="py-3 px-4">Date</th><th className="py-3 px-4">Name</th><th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Vehicle</th><th className="py-3 px-4">Service</th><th className="py-3 px-4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2313] text-[#a79a7e]">
                {enquiries.map((e) => (
                  <tr key={e.id} data-testid={`enquiry-row-${e.id}`}>
                    <td className="py-3 px-4 whitespace-nowrap">{new Date(e.created_at).toLocaleString()}</td>
                    <td className="py-3 px-4 font-bold text-[#f2e9d8]">{e.name}</td>
                    <td className="py-3 px-4"><a href={`tel:${e.phone}`} className="hover:text-[#d4af37]">{e.phone}</a></td>
                    <td className="py-3 px-4">{e.vehicle_type}</td>
                    <td className="py-3 px-4">{e.service}</td>
                    <td className="py-3 px-4 max-w-[200px] truncate">{e.notes || "-"}</td>
                  </tr>
                ))}
                {enquiries.length === 0 && (
                  <tr><td colSpan="6" className="py-10 text-center text-[#6b5f4a]" data-testid="enquiries-empty">No enquiries yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {tab === "settings" && (
          <form onSubmit={saveSettings} className="bg-[#131008] border border-[#2a2313] rounded-xl p-6 max-w-2xl space-y-4" data-testid="settings-form">
            <p className="text-xs text-[#8a7d63]">These details update the website instantly — call button, WhatsApp button, map, and enquiry email alerts.</p>
            {[
              ["phone", "Workshop Phone (e.g. +91 98xxx xxxxx)", "settings-phone-input"],
              ["whatsapp", "WhatsApp Number (e.g. 9198xxxxxxxx)", "settings-whatsapp-input"],
              ["address", "Workshop Address (used for Google Map)", "settings-address-input"],
              ["hours", "Opening Hours (e.g. Mon–Sat 9am–8pm)", "settings-hours-input"],
              ["alert_email", "Email for Enquiry Alerts", "settings-email-input"],
              ["external_staff_url", "External Staff App URL (optional — if you already have a tyre-price app, paste its link and the Staff Login button will open it)", "settings-staff-url-input"],
              ["google_review_url", "Google Review Link (from your Google Business Profile — 'Ask for reviews' link)", "settings-google-review-input"],
            ].map(([key, label, tid]) => (
              <div key={key}>
                <label className="block text-xs font-bold text-[#cbbfa5] mb-1">{label}</label>
                <input value={settings[key]} onChange={(e) => setSettings({ ...settings, [key]: e.target.value })} className={inputCls} data-testid={tid} />
              </div>
            ))}
            <button type="submit" className="px-8 py-3 rounded-lg bg-[#d4af37] hover:bg-[#eac968] text-[#0a0906] text-xs font-bold uppercase tracking-widest" data-testid="settings-save-btn">Save Settings</button>
          </form>
        )}
      </div>
    </div>
  );
}
