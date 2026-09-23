const principles = [
  {
    title: "Zero Invented Defects",
    body: "If your tyres have thousands of kilometers of healthy tread left, we say so. We never push early replacements or needless mechanical add-ons.",
    gold: false,
  },
  {
    title: "Commuter Speed Priority",
    body: "We schedule alignment and balancing around working hours. Our multi-mechanic setup ensures in-and-out turnaround without idle waiting.",
    gold: true,
  },
  {
    title: "Truck & Commercial Scale",
    body: "From multi-axle logistics carriers to city sedans, our equipment handles high torque, heavy loads, and precision laser calibrations alike.",
    gold: false,
  },
];

export const Manifesto = () => {
  return (
    <section id="manifesto" className="py-24 bg-[#060503] border-b border-[#2a2313]" data-testid="manifesto-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-bold text-[#d4af37] uppercase tracking-widest block mb-2">Our Operating Philosophy</span>
          <h2 className="font-serif-title text-3xl sm:text-5xl text-[#f2e9d8] leading-tight">Three principles of honest automotive work.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {principles.map((p, i) => (
            <div
              key={p.title}
              className={`border-t-2 pt-8 space-y-4 ${p.gold ? "border-[#d4af37]" : "border-[#f2e9d8]/40"}`}
              data-testid={`principle-${i + 1}`}
            >
              <h3 className="font-bold text-xl text-[#f2e9d8]">{p.title}</h3>
              <p className="text-xs sm:text-sm text-[#a79a7e] leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
