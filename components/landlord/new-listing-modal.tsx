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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create listing</DialogTitle>
          <DialogDescription>
            Add a new property and publish it to your marketplace.
          </DialogDescription>
        </DialogHeader>
        <ListingForm />
      </DialogContent>
    </Dialog>
  );
}
