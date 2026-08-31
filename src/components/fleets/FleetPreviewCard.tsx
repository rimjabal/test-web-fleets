"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { MouseEvent } from "react";

export function FleetPreviewCard({
  title,
  description,
  color,
  typeLabel,
}: {
  title: string;
  description: string;
  color?: string; // vide = carte neutre en verre dépoli
  typeLabel: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), {
    stiffness: 200,
    damping: 15,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), {
    stiffness: 200,
    damping: 15,
  });

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

 const background = color
  ? `linear-gradient(165deg, ${color}CC 0%, ${color}66 35%, rgba(23,18,43,0.55) 100%)`
  : `linear-gradient(165deg, rgba(40,32,64,0.5) 0%, rgba(23,18,43,0.35) 100%)`;

  return (
    <div className="flex items-start justify-center [perspective:1200px]">
      <motion.article
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          background,
        }}
        className="flex aspect-[550/519] w-full max-w-[380px] flex-col rounded-[10px] p-6 text-white ring-1 ring-white/10 backdrop-blur-md will-change-transform"
      >
        {/* haut : type + menu */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-white/80">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
            </svg>
            {typeLabel}
          </div>
          <span className="text-lg leading-none text-white/40">···</span>
        </div>

        {/* corps : titre + description */}
        <div className="mt-8">
          <h3 className="line-clamp-2 text-2xl font-semibold leading-tight">
            {title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm text-white/60">
            {description}
          </p>
        </div>
      </motion.article>
    </div>
  );
}