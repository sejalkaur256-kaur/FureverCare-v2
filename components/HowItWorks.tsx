import { Camera, Sparkles, MapPinned, Bike } from "lucide-react";

const STEPS = [
  {
    icon: Camera,
    title: "Report",
    desc: "Snap a photo of the injured animal, add a description and your live location.",
  },
  {
    icon: Sparkles,
    title: "AI Detects",
    desc: "Our AI analyzes the photo to detect injuries, severity, and urgency instantly.",
  },
  {
    icon: MapPinned,
    title: "Match NGO",
    desc: "Nearby NGOs, shelters and vets are notified and can accept the rescue request.",
  },
  {
    icon: Bike,
    title: "Live Rescue",
    desc: "Track the assigned volunteer in real time until the animal is safely rescued.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-12 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-500">
          How it works
        </p>
        <h2 className="mt-2 text-3xl font-bold text-ink-900 sm:text-4xl">
          From a photo to a rescue, in minutes
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <div
            key={s.title}
            className="group relative rounded-2xl border border-gray-100 bg-white p-6 shadow-soft transition-transform hover:-translate-y-1"
          >
            <span className="absolute right-5 top-5 text-4xl font-bold text-gray-100">
              {i + 1}
            </span>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500 text-white shadow-lg shadow-brand-500/30">
              <s.icon size={22} />
            </div>
            <h3 className="text-lg font-semibold text-ink-900">{s.title}</h3>
            <p className="mt-1 text-sm text-gray-500">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
