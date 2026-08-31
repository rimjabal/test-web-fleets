"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useIntlayer } from "next-intlayer";

import { Button } from "@/components/button";
import { Modal, MODAL_IDS, useModalActions } from "@/components/modal";
import { useEditFleetStore } from "@/lib/edit-fleet-store";
import { FLEET_COLORS } from "@/lib/fleet-colors";
import { createFleetSchema, type CreateFleetInput } from "@/lib/fleet-schema";
import { createFleet, updateFleet } from "@/lib/fleets-api";

import { FleetPreviewCard } from "./FleetPreviewCard";

export function CreateFleetModal() {
  const content = useIntlayer("create-fleet");
  const { closeModal } = useModalActions();
  const queryClient = useQueryClient();

  const fleetToEdit = useEditFleetStore((s) => s.fleetToEdit);
  const setFleetToEdit = useEditFleetStore((s) => s.setFleetToEdit);
  const isEditing = Boolean(fleetToEdit);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    trigger,
    formState: { errors, isValid },
  } = useForm<CreateFleetInput>({
    resolver: zodResolver(createFleetSchema),
    mode: "onChange",
    defaultValues: { title: "", description: "", color: "" },
  });

  // pré-remplir (édition) ou vider (création) quand la flotte ciblée change
  useEffect(() => {
    if (fleetToEdit) {
      reset({
        title: fleetToEdit.title,
        description: fleetToEdit.description ?? "",
        color: fleetToEdit.color,
      });
      void trigger(); // revalide → isValid passe à true → bouton actif
    } else {
      reset({ title: "", description: "", color: "" });
    }
  }, [fleetToEdit, reset, trigger]);

  const values = watch();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateFleetInput) =>
      isEditing ? updateFleet(fleetToEdit!.id, data) : createFleet(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fleets"] });
      reset();
      setFleetToEdit(null);
      closeModal();
    },
  });

  const onSubmit = (data: CreateFleetInput) => mutate(data);

  const handleClose = () => {
    setFleetToEdit(null);
    closeModal();
  };
  return (
    <Modal id={MODAL_IDS.createFleet} animation="scale">
      <Modal.Overlay opacity={0.6} />
      <Modal.Return>
        <span className="flex items-center gap-2 text-sm text-white/70">
          <span aria-hidden>←</span>
          {content.back.value}
        </span>
      </Modal.Return>
      <Modal.Close />

      <Modal.Content
        maxWidth="1040px"
        width="92vw"
        scrollable
        className="rounded-2xl bg-[#1b1630]/60 p-8 ring-1 ring-white/10 backdrop-blur-2xl md:p-10"
      >
        {/* Breadcrumbs — suivent le titre en live */}
        <nav className="mb-8 text-sm text-white/40">
          {content.directory.value}
          <span className="mx-2">›</span>
          <span className="text-white/90">
            {values.title || content.titleFallback.value}
          </span>
        </nav>

        <div className="grid gap-10 md:grid-cols-[380px_1fr]">
          {/* GAUCHE : preview live avec tilt */}
          <FleetPreviewCard
            title={values.title || content.titleFallback.value}
            description={values.description || content.descFallback.value}
            color={values.color}
            typeLabel={content.previewType.value}
          />

          {/* DROITE : formulaire */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-semibold text-primary-100">
                {isEditing ? content.editHeading.value : content.heading.value}
              </h2>
              <p className="mt-1 text-sm text-white/50">
                {content.subtitle.value}
              </p>
            </div>

            {/* Nom + Couleur côte à côte */}
            <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-start">
              <label className="flex flex-col gap-2">
                <span className="text-sm text-white/70">
                  {content.nameLabel.value}{" "}
                  <span className="text-danger">*</span>
                </span>
                <input
                  {...register("title")}
                  placeholder={content.namePlaceholder.value}
                  className="rounded-lg bg-white/10 px-4 py-3 text-sm outline-none ring-1 ring-white/15 transition focus:ring-2 focus:ring-primary-400"
                />
                {errors.title && (
                  <span className="text-xs text-danger">
                    {errors.title.message}
                  </span>
                )}
              </label>

              <div className="flex flex-col gap-2">
                <span className="text-sm text-white/70">
                  {content.colorLabel.value}
                </span>
                <div className="flex items-center gap-2.5 pt-2">
                  {FLEET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      aria-label={c}
                      onClick={() =>
                        setValue("color", c, { shouldValidate: true })
                      }
                      style={{ backgroundColor: c }}
                      className={`size-6 shrink-0 rounded-full transition ${
                        values.color === c
                          ? "ring-2 ring-white ring-offset-2 ring-offset-[#1b1630]"
                          : "hover:scale-110"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Description pleine largeur */}
            <label className="flex flex-col gap-2">
              <span className="text-sm text-white/70">
                {content.descLabel.value}
              </span>
              <textarea
                {...register("description")}
                rows={4}
                placeholder={content.descPlaceholder.value}
                className="resize-none rounded-lg bg-white/10 px-4 py-3 text-sm outline-none ring-1 ring-white/15 transition focus:ring-2 focus:ring-primary-400"
              />
            </label>

            <Modal.Footer align="space-between">
              <Button type="button" variant="danger" onClick={handleClose}>
                {content.cancel.value}
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="text-white disabled:cursor-not-allowed disabled:opacity-40"
                isLoading={isPending}
                disabled={isPending || !values.title?.trim() || !values.color}

              >
                {isEditing ? content.save.value : content.create.value}
              </Button>
            </Modal.Footer>
          </form>
        </div>
      </Modal.Content>
    </Modal>
  );
}