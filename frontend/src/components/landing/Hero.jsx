import { HERO_IMAGE_URL } from "../../constants/site";

export const Hero = () => {
  return (
    <header id="top" className="py-20 sm:py-28 bg-[#0a0906] border-b border-[#2a2313]" data-testid="hero-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl text-[#f2e9d8] leading-[0.95] mb-6" data-testid="hero-headline">
            Fast service. <span className="text-[#d4af37]">Genuine parts.</span>
          </h1>
          <p className="font-serif-title text-xl sm:text-2xl text-[#cbbfa5] max-w-2xl leading-relaxed italic" data-testid="hero-subheadline">
            "Quick service and honest work for working professionals and heavy commercial haulers who cannot afford wasted hours."
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              data-testid="hero-reach-workshop-btn"
              className="px-8 py-4 rounded-full bg-[#d4af37] hover:bg-[#eac968] text-[#0a0906] text-xs font-bold uppercase tracking-widest transition-colors shadow-[0_0_30px_rgba(212,175,55,0.25)]"
            >
              Reach Workshop
            </a>
            <span className="text-xs font-semibold text-[#8a7d63]">
              Laser Alignment &bull; Wheel Balancing &bull; Tyre Sales &bull; Retread
            </span>
          </div>
        </div>

        <div className="mt-14 max-w-5xl">
          <div
            className="aspect-[21/9] rounded-2xl border border-[#3a2f1b] relative overflow-hidden flex flex-col justify-end bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_IMAGE_URL})` }}
            data-testid="hero-image"
          >
            <div className="relative z-10 m-6 max-w-lg bg-[#0a0906]/85 backdrop-blur-md p-4 rounded-xl text-[#f2e9d8] border border-[#3a2f1b]">
              <div className="text-[10px] font-mono uppercase text-[#d4af37] tracking-widest font-bold">The Workshop Standard</div>
              <p className="text-xs text-[#cbbfa5] mt-1">Calibrated laser readings and genuine parts direct from manufacturers.</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none"></div>
          </div>
        </div>
      </div>
    </header>
  );
};
