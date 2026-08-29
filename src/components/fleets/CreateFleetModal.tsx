"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useIntlayer } from "next-intlayer";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/button";
import { Modal, MODAL_IDS, useModalActions } from "@/components/modal";
import { FLEET_COLORS } from "@/lib/fleet-colors";
import { createFleetSchema, type CreateFleetInput } from "@/lib/fleet-schema";
import { createFleet } from "@/lib/fleets-api";

import { FleetPreviewCard } from "./FleetPreviewCard";

export function CreateFleetModal() {
  const content = useIntlayer("create-fleet");
  const { closeModal } = useModalActions();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateFleetInput>({
    resolver: zodResolver(createFleetSchema),
    defaultValues: { title: "", description: "", color: FLEET_COLORS[0] },
  });

  const values = watch(); // valeurs en direct → alimentent la preview

  const { mutate, isPending } = useMutation({
    mutationFn: createFleet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fleets"] }); // recharge la liste
      reset(); // vide le formulaire
      closeModal(); // ferme l'overlay
    },
  });

  const onSubmit = (data: CreateFleetInput) => mutate(data);

  return (
    <Modal id={MODAL_IDS.createFleet} animation="scale">
      <Modal.Overlay opacity={0.4} />
      <Modal.Return>
        <span className="flex items-center gap-2 text-sm text-white/70">
          <span aria-hidden>←</span>
          {content.back.value}
        </span>
      </Modal.Return>
      <Modal.Close />

      <Modal.Content
        maxWidth="960px"
        width="92vw"
        scrollable
        className="rounded-3xl bg-[#17122b]/95 p-8 ring-1 ring-white/10"
      >
        {/* Breadcrumbs — se mettent à jour avec le titre */}
        <nav className="mb-6 text-sm text-white/40">
          {content.directory.value}
          <span className="mx-2">›</span>
          <span className="text-white/90">
            {values.title || content.titleFallback.value}
          </span>
        </nav>

        <div className="grid gap-8 md:grid-cols-2">
          {/* GAUCHE : preview live */}
          <FleetPreviewCard
  title={values.title || content.titleFallback.value}
  description={values.description || content.descFallback.value}
  color={values.color}
  typeLabel={content.previewType.value}
/>

          {/* DROITE : formulaire */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <div>
              <h2 className="text-lg font-semibold">{content.heading.value}</h2>
              <p className="mt-1 text-sm text-white/50">
                {content.subtitle.value}
              </p>
            </div>

            {/* Nom */}
            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-white/70">
                {content.nameLabel.value}
              </span>
              <input
                {...register("title")}
                placeholder={content.namePlaceholder.value}
                className="rounded-lg bg-white/5 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-primary-400"
              />
              {errors.title && (
                <span className="text-xs text-danger">
                  {errors.title.message}
                </span>
              )}
            </label>

            {/* Couleur */}
            <div className="flex flex-col gap-1.5">
              <span className="text-sm text-white/70">
                {content.colorLabel.value}
              </span>
              <div className="flex flex-wrap gap-2">
                {FLEET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-label={c}
                    onClick={() =>
                      setValue("color", c, { shouldValidate: true })
                    }
                    style={{ backgroundColor: c }}
                    className={`size-7 rounded-full transition ${
                      values.color === c
                        ? "ring-2 ring-white ring-offset-2 ring-offset-[#17122b]"
                        : "hover:scale-110"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Description */}
            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-white/70">
                {content.descLabel.value}
              </span>
              <textarea
                {...register("description")}
                rows={3}
                placeholder={content.descPlaceholder.value}
                className="resize-none rounded-lg bg-white/5 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-primary-400"
              />
            </label>

            <Modal.Footer align="space-between">
              <Button type="button" variant="danger" onClick={closeModal}>
                {content.cancel.value}
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="text-white"
                isLoading={isPending}
                disabled={isPending}
              >
                {content.create.value}
              </Button>
            </Modal.Footer>
          </form>
        </div>
      </Modal.Content>
    </Modal>
  );
}