const rows = [
  ["Hatchbacks & Sedans", "Computerized Laser 4-Wheel", "High-Speed Dynamic Spin", "New Genuine Brands", "20 – 30 mins"],
  ["SUVs & Crossovers", "Heavy-Duty Ramp Calibration", "Dynamic Off-Road / Highway", "AT / HT All-Terrain Stock", "25 – 35 mins"],
  ["Commercial Trucks", "Multi-Axle Commercial Rig", "Heavy Rim High-Capacity", "New + Premium Retread", "Priority Slot"],
];

export const Specs = () => {
  return (
    <section id="specifications" className="py-24 bg-[#060503] border-b border-[#2a2313]" data-testid="specs-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold text-[#d4af37] uppercase tracking-widest block mb-2">Technical Matrix</span>
          <h2 className="font-serif-title text-3xl text-[#f2e9d8]">Equipment &amp; Vehicle Coverage</h2>
        </div>

        <div className="overflow-x-auto" data-testid="specs-table">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-[#d4af37] text-[#d4af37] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Vehicle Category</th>
                <th className="py-3 px-4">Alignment System</th>
                <th className="py-3 px-4">Balancing Type</th>
                <th className="py-3 px-4">Tyre Options</th>
                <th className="py-3 px-4">Typical Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2313] text-[#a79a7e]">
              {rows.map((r) => (
                <tr key={r[0]} data-testid={`spec-row-${r[0].toLowerCase().replace(/[^a-z]+/g, "-")}`}>
                  <td className="py-4 px-4 font-bold text-[#f2e9d8]">{r[0]}</td>
                  <td className="py-4 px-4">{r[1]}</td>
                  <td className="py-4 px-4">{r[2]}</td>
                  <td className="py-4 px-4">{r[3]}</td>
                  <td className="py-4 px-4 font-semibold text-[#eac968]">{r[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
