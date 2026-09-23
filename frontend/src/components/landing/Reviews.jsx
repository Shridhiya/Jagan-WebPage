const reviews = [
  {
    quote:
      "They completed wheel balancing during my morning commute. The steering shake at 80 km/h disappeared completely. Honest technicians.",
    name: "Office Commuter",
    tag: "Car Owner",
  },
  {
    quote:
      "Reliable alignment for our logistics trucks. Fair rates, quick turnaround, and no unnecessary replacements pushed.",
    name: "Transport Manager",
    tag: "Commercial Fleet",
  },
];

export const Reviews = () => {
  return (
    <section id="reviews" className="py-24 bg-[#0a0906] border-b border-[#2a2313]" data-testid="reviews-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14">
          <span className="text-xs font-bold text-[#d4af37] uppercase tracking-widest block mb-2">Driver Testimonials</span>
          <h2 className="font-serif-title text-3xl text-[#f2e9d8]">Reputation earned one tyre at a time.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div
              key={r.name}
              data-testid={`review-card-${i + 1}`}
              className="bg-[#131008] p-6 rounded-xl border border-[#2a2313] flex flex-col justify-between"
            >
              <p className="text-xs text-[#a79a7e] leading-relaxed italic">"{r.quote}"</p>
              <div className="mt-4 pt-4 border-t border-[#2a2313]">
                <div className="text-xs font-bold text-[#f2e9d8]">{r.name}</div>
                <div className="text-[11px] text-[#8a7d63]">{r.tag}</div>
              </div>
            </div>
          ))}

          <div className="bg-[#0a0906] p-6 rounded-xl border border-dashed border-[#3a2f1b] flex flex-col justify-center items-center text-center" data-testid="share-review-card">
            <div className="text-xs font-bold text-[#f2e9d8]">Share Your Review</div>
            <p className="text-[11px] text-[#8a7d63] mt-1 mb-3">Help daily drivers find reliable automotive care.</p>
            <a href="#contact" className="text-xs font-bold text-[#d4af37] hover:text-[#eac968] hover:underline" data-testid="share-review-link">
              Write Feedback &rarr;
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
