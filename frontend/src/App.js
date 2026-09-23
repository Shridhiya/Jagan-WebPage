import "@/App.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Manifesto } from "@/components/landing/Manifesto";
import { Services } from "@/components/landing/Services";
import { Specs } from "@/components/landing/Specs";
import { Reviews } from "@/components/landing/Reviews";
import { Faq } from "@/components/landing/Faq";
import { Contact } from "@/components/landing/Contact";
import { MapSection } from "@/components/landing/MapSection";
import { Footer } from "@/components/landing/Footer";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import { fetchSettings } from "@/lib/api";

const LandingPage = () => {
  const [settings, setSettings] = useState(null);
  useEffect(() => {
    fetchSettings().then(setSettings).catch(() => setSettings({}));
  }, []);

  return (
    <div className="bg-[#0a0906] min-h-screen" data-testid="landing-page">
      <Nav settings={settings} />
      <Hero />
      <Manifesto />
      <Services />
      <Specs />
      <Reviews />
      <Faq />
      <Contact settings={settings} />
      <MapSection settings={settings} />
      <Footer settings={settings} />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
      <Toaster theme="dark" position="top-center" />
    </div>
  );
}

export default App;
