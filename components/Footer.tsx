import { PawPrint } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <div className="flex items-center gap-2 text-ink-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
            <PawPrint size={16} />
          </span>
          <span className="font-semibold">FureverCare AI</span>
        </div>
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} FureverCare AI — Prototype build. All
          data shown is simulated.
        </p>
      </div>
    </footer>
  );
}
