"use client";

import type { Fleet } from "@prisma/client";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

export function FleetCard({
  fleet,
  companiesLabel,
  deleteLabel,
  editLabel,
  optionsLabel,
  onDelete,
  onEdit,
}: {
  fleet: Fleet;
  companiesLabel: ReactNode;
  deleteLabel: string;
  editLabel: string;
  optionsLabel: string;
  onDelete: (id: string) => void;
  onEdit: (fleet: Fleet) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [menuOpen]);

  return (
    <article
      className={`group relative flex aspect-[8/7] flex-col justify-between overflow-hidden rounded-[10px] p-5 text-white ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:ring-white/20 ${
        menuOpen ? "z-30" : ""
      }`}
      style={{
        background: `linear-gradient(145deg, ${fleet.color}66 0%, ${fleet.color}33 32%, #20203d 72%, #211d38 100%)`,
      }}
    >
      {/* menu ... */}
      <div ref={menuRef} className="absolute right-2 top-2 z-40">
        <button
          type="button"
          aria-label={optionsLabel}
          onClick={() => setMenuOpen((v) => !v)}
          className="rounded-[10px] p-1 text-white/50 transition hover:bg-white/10 hover:text-white"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="12" r="1.6" />
            <circle cx="12" cy="12" r="1.6" />
            <circle cx="19" cy="12" r="1.6" />
          </svg>
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-9 z-50 min-w-36 overflow-hidden rounded-[10px] bg-[#1e1832] py-1 shadow-xl ring-1 ring-white/10">
            {/* Modifier */}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onEdit(fleet);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-white/90 transition hover:bg-white/5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
              {editLabel}
            </button>

            {/* Supprimer */}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onDelete(fleet.id);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-danger transition hover:bg-white/5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              </svg>
              {deleteLabel}
            </button>
          </div>
        )}
      </div>

      {/* haut : titre + description */}
      <div className="relative z-10 pr-6">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
          {fleet.title}
        </h3>
        {fleet.description && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-white/60">
            {fleet.description}
          </p>
        )}
      </div>

      {/* bas : compteur */}
      <div className="relative z-10 flex items-center gap-1.5 text-white/70">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
          <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
          <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
        </svg>
        <span className="text-[13px] tracking-[0.02em]">
          <span className="font-medium">{fleet.companiesCount}</span>{" "}
          <span className="font-light text-white/60">{companiesLabel}</span>
        </span>
      </div>
    </article>
  );
}