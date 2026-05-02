"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ListingForm } from "@/components/listings/CreateListingForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function NewListingModal() {
  return <NewListingModalControlled open />;
}

export function NewListingModalControlled({
  open,
  returnTo = "/dashboard/landlord/listings",
}: {
  open?: boolean;
  returnTo?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromQuery = searchParams.get("create") === "1";
  const isOpen = open ?? fromQuery;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          router.push(returnTo);
        }
      }}
    >
      <DialogContent className="flex max-h-[min(92vh,920px)] flex-col gap-0 overflow-hidden p-0 pt-0 sm:max-w-3xl">
        <div className="shrink-0 border-b border-border px-6 pb-4 pt-6 pr-14">
          <DialogHeader className="space-y-1.5 text-left">
            <DialogTitle className="text-xl font-semibold tracking-tight">Create listing</DialogTitle>
            <DialogDescription className="text-[15px] leading-snug">
              Add a new property and publish it to your marketplace.
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-6">
          <ListingForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
