"use client";

import { useEffect, useRef } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useIntlayer } from "next-intlayer";

import { CreateFleetModal } from "@/components/fleets/CreateFleetModal";
import { FleetCard } from "@/components/fleets/FleetCard";
import { MODAL_IDS, useModalActions } from "@/components/modal";
import { useEditFleetStore } from "@/lib/edit-fleet-store";
import { deleteFleet, fetchFleets } from "@/lib/fleets-api";

export default function FleetsPage() {
  const content = useIntlayer("fleets-page");
  const { openModal } = useModalActions();
  const setFleetToEdit = useEditFleetStore((s) => s.setFleetToEdit);
  const queryClient = useQueryClient();

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

  const deleteMutation = useMutation({
    mutationFn: deleteFleet,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["fleets"] }),
  });

  // infinite scroll : on observe une sentinelle en bas de liste
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
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isPending) return <p className="p-8">{content.loading}</p>;
  if (isError) return <p className="p-8">{content.error}</p>;

  const fleets = data.pages.flatMap((page) => page.items);

  return (
    <div className="w-full pb-8 pl-8 pr-8 pt-8 md:pl-19">
      <header className="mb-6 flex items-center justify-end">
        <button
          onClick={() => {
            setFleetToEdit(null); // mode création
            openModal(MODAL_IDS.createFleet);
          }}
          className="flex items-center gap-2 text-sm text-white/80 transition hover:text-white"
        >
          <svg
            aria-hidden="true"
            className="size-4 shrink-0"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="m14.25 2.5 1.85 5.4a3.2 3.2 0 0 0 2 2l5.4 1.85-5.4 1.85a3.2 3.2 0 0 0-2 2l-1.85 5.4-1.85-5.4a3.2 3.2 0 0 0-2-2L5 11.75l5.4-1.85a3.2 3.2 0 0 0 2-2l1.85-5.4Z" />
            <path d="m4.5 13.5.85 2.35a2 2 0 0 0 1.3 1.3L9 18l-2.35.85a2 2 0 0 0-1.3 1.3L4.5 22.5l-.85-2.35a2 2 0 0 0-1.3-1.3L0 18l2.35-.85a2 2 0 0 0 1.3-1.3L4.5 13.5Z" />
          </svg>
          {content.createFleet}
        </button>
      </header>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {fleets.map((fleet) => (
          <FleetCard
            key={fleet.id}
            fleet={fleet}
            companiesLabel={content.companies}
            deleteLabel={content.delete.value}
            editLabel={content.edit.value}
            optionsLabel={content.options.value}
            onDelete={(id) => deleteMutation.mutate(id)}
            onEdit={(f) => {
              setFleetToEdit(f); // mémorise la flotte à éditer
              openModal(MODAL_IDS.createFleet); // ouvre le même overlay
            }}
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

      {/* overlay de création / édition */}
      <CreateFleetModal />
    </div>
  );
}