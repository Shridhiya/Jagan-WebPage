import { MapPin, Clock } from "lucide-react";

export const MapSection = ({ settings }) => {
  const address = settings?.address?.trim();
  const hours = settings?.hours?.trim();
  if (!address) return null;

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  return (
    <section id="location" className="py-24 bg-[#060503] border-t border-[#2a2313]" data-testid="map-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10">
          <span className="text-xs font-bold text-[#d4af37] uppercase tracking-widest block mb-2">Find The Workshop</span>
          <h2 className="font-serif-title text-3xl text-[#f2e9d8]">Drive straight to our bay.</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-xl bg-[#131008] border border-[#2a2313]" data-testid="address-card">
              <div className="flex items-center gap-2 text-[#d4af37] text-xs font-bold uppercase tracking-wider mb-2">
                <MapPin className="w-3.5 h-3.5" /> Address
              </div>
              <p className="text-sm text-[#f2e9d8] leading-relaxed">{address}</p>
            </div>
            {hours && (
              <div className="p-5 rounded-xl bg-[#131008] border border-[#2a2313]" data-testid="hours-card">
                <div className="flex items-center gap-2 text-[#d4af37] text-xs font-bold uppercase tracking-wider mb-2">
                  <Clock className="w-3.5 h-3.5" /> Opening Hours
                </div>
                <p className="text-sm text-[#f2e9d8] leading-relaxed">{hours}</p>
              </div>
            )}
          </div>
          <div className="lg:col-span-8 rounded-2xl overflow-hidden border border-[#2a2313] min-h-[320px]">
            <iframe
              title="Workshop location map"
              src={mapSrc}
              className="w-full h-full min-h-[320px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              data-testid="google-map-embed"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
