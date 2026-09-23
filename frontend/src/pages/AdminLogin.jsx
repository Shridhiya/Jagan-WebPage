import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { API, setToken, formatApiErrorDetail } from "../lib/api";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/auth/login`, { email, password });
      setToken(data.token);
      toast.success(`Welcome, ${data.user.name || "Admin"}`);
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail));
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full px-3.5 py-2.5 rounded-lg border border-[#3a2f1b] bg-[#0a0906] text-[#f2e9d8] text-sm placeholder:text-[#6b5f4a] focus:outline-none focus:border-[#d4af37] transition-colors";

  return (
    <div className="min-h-screen bg-[#0a0906] flex items-center justify-center px-4" data-testid="admin-login-page">
      <div className="w-full max-w-sm bg-[#131008] border border-[#2a2313] rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Sree Laxmi Automobiles logo" className="h-20 w-20 rounded-full object-cover border border-[#d4af37]/40 mx-auto mb-4" />
          <span className="font-black text-xl text-[#f2e9d8]">SREE LAXMI</span>
          <span className="block text-[10px] font-bold text-[#d4af37] uppercase tracking-widest mt-1">Staff Login</span>
        </div>
        <form onSubmit={handleLogin} className="space-y-4" data-testid="login-form">
          <div>
            <label className="block text-xs font-bold text-[#cbbfa5] mb-1">Username</label>
            <input type="text" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin" className={inputCls} data-testid="login-username-input" />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#cbbfa5] mb-1">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputCls} data-testid="login-password-input" />
          </div>
          <button
            type="submit"
            disabled={loading}
            data-testid="login-submit-btn"
            className="w-full py-3 rounded-lg bg-[#d4af37] hover:bg-[#eac968] disabled:opacity-60 text-[#0a0906] font-bold text-xs uppercase tracking-widest transition-colors"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-[#8a7d63] hover:text-[#d4af37]" data-testid="back-to-site-link">&larr; Back to website</Link>
        </div>
      </div>
    </div>
  );
}
