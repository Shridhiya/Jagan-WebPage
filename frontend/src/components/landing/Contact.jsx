import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Phone, MessageCircle } from "lucide-react";
import { WORKSHOP_PHONE_DISPLAY, WORKSHOP_PHONE_TEL, WHATSAPP_URL } from "../../constants/site";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const initialForm = {
  name: "",
  phone: "",
  vehicle_type: "Car (Hatchback/Sedan/SUV)",
  service: "Wheel Alignment",
  notes: "",
};

export const Contact = () => {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API}/enquiries`, form);
      toast.success("Enquiry sent. The workshop will call you back shortly.");
      setForm(initialForm);
    } catch (err) {
      toast.error("Could not send the enquiry. Please call or WhatsApp us instead.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    "w-full px-3.5 py-2.5 rounded-lg border border-[#3a2f1b] bg-[#0a0906] text-[#f2e9d8] text-xs placeholder:text-[#6b5f4a] focus:outline-none focus:border-[#d4af37] transition-colors";

  return (
    <section id="contact" className="py-24 bg-[#0a0906]" data-testid="contact-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold text-[#d4af37] uppercase tracking-widest block">Get Connected</span>
            <h2 className="font-serif-title text-3xl sm:text-4xl text-[#f2e9d8]">Prompt assistance for your vehicle.</h2>
            <p className="text-[#a79a7e] text-xs sm:text-sm leading-relaxed">
              Genuine parts and honest work. Call our desk, chat on WhatsApp, or send an enquiry form for quick slots and tyre price checks.
            </p>

            <div className="space-y-3 pt-4">
              <div className="p-4 rounded-xl bg-[#131008] border border-[#2a2313] flex items-center justify-between" data-testid="call-card">
                <div>
                  <span className="text-[11px] text-[#8a7d63] font-medium block">Phone Call</span>
                  <span className="text-xs font-bold text-[#f2e9d8]">Call Workshop Desk</span>
                  <span className="text-[11px] text-[#8a7d63] block mt-0.5">{WORKSHOP_PHONE_DISPLAY}</span>
                </div>
                <a
                  href={WORKSHOP_PHONE_TEL}
                  data-testid="call-direct-btn"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#d4af37]/50 text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0a0906] text-xs font-bold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" /> Call Direct
                </a>
              </div>

              <div className="p-4 rounded-xl bg-[#131008] border border-[#2a2313] flex items-center justify-between" data-testid="whatsapp-card">
                <div>
                  <span className="text-[11px] text-[#8a7d63] font-medium block">WhatsApp Messaging</span>
                  <span className="text-xs font-bold text-[#f2e9d8]">Fast Price &amp; Slot Info</span>
                </div>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="whatsapp-btn"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#d4af37] hover:bg-[#eac968] text-[#0a0906] text-xs font-bold transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Order on WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-[#131008] p-8 rounded-2xl shadow-2xl border border-[#2a2313]" data-testid="enquiry-form-card">
              <h3 className="font-bold text-xl text-[#f2e9d8] mb-1">Direct Workshop Enquiry</h3>
              <p className="text-xs text-[#8a7d63] mb-6">Leave your details and vehicle type. We will revert with availability and transparent pricing.</p>

              <form className="space-y-4" onSubmit={handleSubmit} data-testid="enquiry-form">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#cbbfa5] mb-1">Name</label>
                    <input type="text" required value={form.name} onChange={update("name")} placeholder="Your name" className={inputCls} data-testid="enquiry-name-input" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#cbbfa5] mb-1">Phone Number</label>
                    <input type="tel" required value={form.phone} onChange={update("phone")} placeholder="Mobile number" className={inputCls} data-testid="enquiry-phone-input" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#cbbfa5] mb-1">Vehicle Classification</label>
                    <select value={form.vehicle_type} onChange={update("vehicle_type")} className={inputCls} data-testid="enquiry-vehicle-select">
                      <option>Car (Hatchback/Sedan/SUV)</option>
                      <option>Truck / Commercial Fleet</option>
                      <option>Other Light Commercial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#cbbfa5] mb-1">Service Required</label>
                    <select value={form.service} onChange={update("service")} className={inputCls} data-testid="enquiry-service-select">
                      <option>Wheel Alignment</option>
                      <option>Wheel Balancing</option>
                      <option>New Tyres Quote</option>
                      <option>Retreading</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#cbbfa5] mb-1">Tyre Size or Notes (Optional)</label>
                  <textarea rows="3" value={form.notes} onChange={update("notes")} placeholder="e.g. Need 4 tyres for sedan or truck alignment slot..." className={inputCls} data-testid="enquiry-notes-input" />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    data-testid="enquiry-submit-btn"
                    className="w-full py-3.5 rounded-lg bg-[#d4af37] hover:bg-[#eac968] disabled:opacity-60 text-[#0a0906] font-bold text-xs uppercase tracking-widest transition-colors"
                  >
                    {submitting ? "Sending..." : "Submit Enquiry"}
                  </button>
                  <p className="text-[11px] text-[#8a7d63] text-center mt-2">No marketing spam &bull; Direct workshop callback</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
