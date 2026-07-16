"use client";

import { motion } from "framer-motion";
import { Camera, Sparkles, MapPinned, Bike, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    icon: Camera,
    title: "Report Animal",
    desc: "Snap a photo of the injured animal, add a description, and capture the GPS location.",
    color: "text-amber-500 bg-amber-50 border-amber-100",
  },
  {
    icon: Sparkles,
    title: "AI Analysis",
    desc: "MobileNet and TensorFlow.js scan the photo locally to assess animal type and wound severity.",
    color: "text-primary bg-primary-50 border-primary-100",
  },
  {
    icon: MapPinned,
    title: "NGO Matching",
    desc: "Nearby veterinary clinics and rescue NGOs receive instant alerts to claim the case.",
    color: "text-sky-500 bg-sky-50 border-sky-100",
  },
  {
    icon: Bike,
    title: "Volunteer Assigned",
    desc: "A rescue volunteer accepts the mission, triggering live route navigation.",
    color: "text-indigo-500 bg-indigo-50 border-indigo-100",
  },
  {
    icon: CheckCircle2,
    title: "Rescue Completed",
    desc: "The animal is secured, treated, and transported safely to the recovery shelter.",
    color: "text-emerald-500 bg-emerald-50 border-emerald-100",
  },
];

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-slate-50/50 py-24 sm:py-32">
      {/* Background decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,rgba(14,165,164,0.05),transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold uppercase tracking-wider text-primary"
          >
            Workflow
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
          >
            How it works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg text-slate-500"
          >
            From the moment you capture a photo to the final rescue, our intelligent network coordinates every step.
          </motion.p>
        </div>

        {/* Animated Timeline */}
        <div className="relative mx-auto max-w-lg lg:max-w-none">
          {/* Vertical connecting line for desktop */}
          <div className="absolute left-1/2 top-4 hidden h-[85%] w-0.5 -translate-x-1/2 bg-slate-200 lg:block" />

          <div className="space-y-12 lg:grid lg:grid-cols-5 lg:gap-8 lg:space-y-0">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, type: "spring", stiffness: 260, damping: 20 }}
                  className="flex flex-col items-center text-center lg:block group"
                >
                  {/* Step bubble */}
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "relative flex h-16 w-16 items-center justify-center rounded-2xl border shadow-sm transition-transform duration-300 group-hover:scale-110",
                        s.color
                      )}
                    >
                      <Icon size={26} />
                      <span className="absolute -bottom-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-500 shadow-sm border border-slate-100">
                        {i + 1}
                      </span>
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <div className="mt-6">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                      {s.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
