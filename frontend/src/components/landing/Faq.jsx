const faqs = [
  {
    q: "When should I get wheel alignment done?",
    a: "Every 5,000 to 7,000 km, or immediately if you notice the steering pulling to one side, off-center steering wheel, or uneven tread wear on tyre edges.",
  },
  {
    q: "Are genuine brand tyres provided with original invoice?",
    a: "Yes, every new tyre purchased at Sree Laxmi Automobiles is guaranteed genuine, carrying standard manufacturer warranty codes.",
  },
  {
    q: "Can I get a quick quote over phone or WhatsApp?",
    a: "Certainly. Click our phone or WhatsApp buttons below with your tyre size or vehicle model, and we will send you instant pricing.",
  },
];

export const Faq = () => {
  return (
    <section id="faq" className="py-24 bg-[#060503] border-b border-[#2a2313]" data-testid="faq-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-xs font-bold text-[#d4af37] uppercase tracking-widest block mb-2">Common Inquiries</span>
          <h2 className="font-serif-title text-3xl text-[#f2e9d8]">Everything you need to know.</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={f.q} className="p-6 rounded-xl bg-[#131008] border border-[#2a2313]" data-testid={`faq-item-${i + 1}`}>
              <h4 className="font-bold text-sm text-[#f2e9d8]">{f.q}</h4>
              <p className="text-xs text-[#a79a7e] mt-2 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
