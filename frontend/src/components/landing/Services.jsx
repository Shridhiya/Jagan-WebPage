const services = [
  {
    tag: "Bay 1 • Alignment & Balancing",
    title: "Precision Car & Truck Wheel Alignment",
    body: "Misaligned wheels scrub tyres and pull sideways on open highways. Our laser alignment calibrates camber, caster, and toe to factory tolerances for both commuter cars and heavy trucks.",
    includes: "Multi-point geometry inspection • Steering angle centering • Dynamic spin balance",
    note: "Express Slot Available",
    cta: "Book Wheel Bay",
    testid: "service-alignment-card",
  },
  {
    tag: "Bay 2 • Tyres & Retread",
    title: "Genuine Tyres & Retreading Solutions",
    body: "We stock authentic tyres from leading brands with verified batch codes. For commercial operators, our tyre retread service bonds new high-mileage compound onto sound casings.",
    includes: "Fresh batch tyres with warranty • Valve replacement • Casing soundness testing",
    note: "Stock Inquiries Welcomed",
    cta: "Check Size & Price",
    testid: "service-tyres-card",
  },
];

export const Services = () => {
  return (
    <section id="offerings" className="py-24 bg-[#0a0906] border-b border-[#2a2313]" data-testid="services-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-bold text-[#d4af37] uppercase tracking-widest block mb-2">Capabilities</span>
            <h2 className="font-serif-title text-3xl sm:text-4xl text-[#f2e9d8]">Workshop services &amp; fitments.</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#a79a7e] max-w-md">
            Laser alignment, computerized high-speed dynamic balancing, fresh brand tyres, and industrial-grade retreading.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((s) => (
            <div
              key={s.title}
              data-testid={s.testid}
              className="bg-[#131008] rounded-2xl p-8 border border-[#2a2313] hover:border-[#d4af37]/50 transition-colors shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="text-xs font-bold text-[#d4af37] uppercase tracking-wider">{s.tag}</div>
                <h3 className="font-bold text-2xl text-[#f2e9d8]">{s.title}</h3>
                <p className="text-xs sm:text-sm text-[#a79a7e] leading-relaxed">{s.body}</p>
                <div className="p-4 rounded-xl bg-[#0a0906] border border-[#2a2313] text-xs space-y-1 text-[#cbbfa5]">
                  <div className="font-bold text-[#f2e9d8]">Includes:</div>
                  <div>{s.includes}</div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-[#2a2313] flex items-center justify-between">
                <span className="text-xs font-bold text-[#f2e9d8]">{s.note}</span>
                <a href="#contact" className="text-xs font-bold text-[#d4af37] hover:text-[#eac968] hover:underline" data-testid={`${s.testid}-cta`}>
                  {s.cta} &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
