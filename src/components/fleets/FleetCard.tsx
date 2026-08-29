import type { Fleet } from "@prisma/client";
import type { ReactNode } from "react";

export function FleetCard({
  fleet,
  companiesLabel,
}: {
  fleet: Fleet;
  companiesLabel: ReactNode;
}) {
  return (
    <article
      className="group relative flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-2xl p-4 text-white ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:ring-white/20"
      style={{
        background: `linear-gradient(150deg, ${fleet.color} -5%, #171226 78%)`,
      }}
    >
      {/* menu ... en haut à droite */}
      <button
        type="button"
        aria-label="Options"
        className="absolute right-2.5 top-2.5 text-white/50 transition hover:text-white"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="5" cy="12" r="1.6" />
          <circle cx="12" cy="12" r="1.6" />
          <circle cx="19" cy="12" r="1.6" />
        </svg>
      </button>

      {/* haut : titre + description */}
      <div className="pr-6">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
          {fleet.title}
        </h3>
        {fleet.description && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-white/60">
            {fleet.description}
          </p>
        )}
      </div>

      {/* bas : compteur d'entreprises */}
      <div className="flex items-center gap-1.5 text-xs text-white/70">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
          <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
          <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
        </svg>
        <span>
          {fleet.companiesCount} {companiesLabel}
        </span>
      </div>
    </article>
  );
}