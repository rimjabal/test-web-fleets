"use client";

import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useIntlayer } from "next-intlayer";

import { FleetCard } from "@/components/fleets/FleetCard";
import { fetchFleets } from "@/lib/fleets-api";
import { MODAL_IDS, useModalActions } from "@/components/modal";
import { CreateFleetModal } from "@/components/fleets/CreateFleetModal";

export default function FleetsPage() {
  const content = useIntlayer("fleets-page");
  const { openModal } = useModalActions();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
  } = useInfiniteQuery({
    queryKey: ["fleets"],
    queryFn: ({ pageParam }) => fetchFleets(pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" } // on précharge 200px avant d'atteindre le bas
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isPending) return <p className="p-8">{content.loading}</p>;
  if (isError) return <p className="p-8">{content.error}</p>;

  const fleets = data.pages.flatMap((page) => page.items);

  return (
    <div className="mx-auto w-full max-w-[1600px] p-6 md:p-8">
      <header className="mb-6 flex items-center justify-end">
  <button
    onClick={() => openModal(MODAL_IDS.createFleet)}
    className="flex items-center gap-2 text-sm text-white/80 transition hover:text-white"
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" />
    </svg>
    {content.createFleet}
  </button>
</header>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {fleets.map((fleet) => (
          <FleetCard
            key={fleet.id}
            fleet={fleet}
            companiesLabel={content.companies}
          />
        ))}
      </div>

      {/* sentinelle : dès qu'elle entre à l'écran, on charge la suite */}
      <div ref={loadMoreRef} className="h-10" />

      {isFetchingNextPage && (
        <p className="pb-8 text-center text-sm text-white/60">
          {content.loading}
        </p>
      )}

      <CreateFleetModal />
    </div>
  );
}