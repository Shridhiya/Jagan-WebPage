export const Nav = () => {
  const links = [
    { href: "#offerings", label: "Workshop Bays" },
    { href: "#manifesto", label: "Our Standard" },
    { href: "#specifications", label: "Capabilities" },
    { href: "#reviews", label: "Feedback" },
    { href: "#faq", label: "Questions" },
  ];
  return (
    <nav className="bg-[#0a0906] border-b border-[#2a2313] sticky top-0 z-40" data-testid="main-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <a href="#top" className="flex items-baseline gap-2" data-testid="brand-logo">
          <span className="font-black text-2xl tracking-tight text-[#f2e9d8]">SREE LAXMI</span>
          <span className="text-xs font-bold text-[#d4af37] uppercase tracking-widest">Automobiles</span>
        </a>
        <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-[#a79a7e]">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-[#d4af37] transition-colors" data-testid={`nav-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}>
              {l.label}
            </a>
          ))}
        </div>
        <div>
          <a
            href="#contact"
            data-testid="nav-enquire-btn"
            className="px-5 py-2.5 rounded-full bg-[#d4af37] hover:bg-[#eac968] text-[#0a0906] text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Enquire Now
          </a>
        </div>
      </div>
    </nav>
  );
};
