export const Footer = () => {
  const links = [
    { href: "#offerings", label: "Workshop Bays" },
    { href: "#manifesto", label: "Our Standard" },
    { href: "#specifications", label: "Capabilities" },
    { href: "#reviews", label: "Feedback" },
    { href: "#faq", label: "Questions" },
  ];
  const contact = [
    { href: "#contact", label: "Book Bay Slot" },
    { href: "#contact", label: "WhatsApp Order" },
    { href: "#contact", label: "Send Short Form" },
  ];
  return (
    <footer className="bg-black text-[#8a7d63] py-12 border-t border-[#2a2313] text-xs" data-testid="site-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#2a2313]">
          <div className="md:col-span-2 space-y-3">
            <img src="/logo.png" alt="Sree Laxmi Automobiles logo" className="h-16 w-16 rounded-full object-cover border border-[#d4af37]/40" />
            <span className="font-black text-[#f2e9d8] text-base tracking-tight block">
              SREE LAXMI <span className="text-[#d4af37]">AUTOMOBILES</span>
            </span>
            <p className="text-xs text-[#8a7d63] max-w-sm leading-relaxed">
              Specialized automotive workshop for car &amp; truck wheel alignment, dynamic balancing, genuine tyres, and retreading.
            </p>
          </div>

          <div>
            <span className="block font-bold text-[#f2e9d8] uppercase tracking-wider text-[11px] mb-3">Links</span>
            <ul className="space-y-2">
              {links.map((l) => (
                <li key={l.href + l.label}>
                  <a href={l.href} className="hover:text-[#d4af37] transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="block font-bold text-[#f2e9d8] uppercase tracking-wider text-[11px] mb-3">Contact</span>
            <ul className="space-y-2">
              {contact.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:text-[#d4af37] transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-[#6b5f4a]">
          <div>Sree Laxmi Automobiles &bull; Honest Work &bull; Quick Service</div>
          <div>Car &amp; Truck Wheel Care</div>
        </div>
      </div>
    </footer>
  );
};
