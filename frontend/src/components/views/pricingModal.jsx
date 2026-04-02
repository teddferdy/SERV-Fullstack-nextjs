"use client";

import React, { useState } from "react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import PricingSection from "./pricingSection";

const PricingModal = ({ children, subscriptionTier = "Free" }) => {
  const [open, setOpen] = useState(false);

  const canOpen = subscriptionTier === "Free" || subscriptionTier === "free";
  return (
    <Dialog open={open} onOpenChange={(isOpen) => canOpen && setOpen(isOpen)}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="p-8 pt-4 sm:max-w-4xl">
        <PricingSection />
      </DialogContent>
    </Dialog>
  );
};

export default PricingModal;
