import { PawPrint, Heart, Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/50 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        {/* Left section: logo and message */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <div className="flex items-center gap-2 text-slate-900">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-md shadow-primary/10">
              <PawPrint size={15} />
            </div>
            <span className="font-bold tracking-tight">
              FureverCare <span className="text-primary font-black">AI</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 text-center md:text-left max-w-xs mt-1">
            Connecting citizens, shelters, NGOs, and volunteers through intelligent emergency response.
          </p>
        </div>

        {/* Middle section: social links */}
        <div className="flex justify-center space-x-6 md:order-2 mt-6 md:mt-0">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-slate-900 transition-colors"
            aria-label="GitHub"
          >
            <Github size={20} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-slate-900 transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="mailto:contact@furevercare.ai"
            className="text-slate-400 hover:text-slate-900 transition-colors"
            aria-label="Contact Us"
          >
            <Mail size={20} />
          </a>
        </div>

        {/* Right section: copyright */}
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-xs leading-5 text-slate-400">
            &copy; {new Date().getFullYear()} FureverCare AI. All rights reserved. Created for humanitarian animal rescue.
          </p>
        </div>
      </div>
    </footer>
  );
}
