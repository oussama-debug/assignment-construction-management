"use client";

import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc/client";
import type { CheckInParams, CheckOutParams } from "@/lib/types";

export function useCheckInOut() {
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const utils = trpc.useUtils();

  const checkInMutation = trpc.worker.checkIn.useMutation({
    onSuccess: () => {
      toast.success("Successfully checked in!");
      utils.worker.getActiveCheckIns.invalidate();
    },
    onError: (error) => {
      console.error("Check-in error:", error);
      toast.error("Failed to check in. Please try again.");
    },
    onSettled: () => {
      setIsCheckingIn(false);
    },
  });

  const checkOutMutation = trpc.worker.checkOut.useMutation({
    onSuccess: () => {
      toast.success("Successfully checked out!");
      utils.worker.getActiveCheckIns.invalidate();
    },
    onError: (error) => {
      console.error("Check-out error:", error);
      toast.error("Failed to check out. Please try again.");
    },
    onSettled: () => {
      setIsCheckingOut(false);
    },
  });

  const checkIn = async (params: CheckInParams) => {
    setIsCheckingIn(true);
    await checkInMutation.mutateAsync(params);
  };

  const checkOut = async (params: CheckOutParams) => {
    setIsCheckingOut(true);
    await checkOutMutation.mutateAsync(params);
  };

  return {
    checkIn,
    checkOut,
    isCheckingIn,
    isCheckingOut,
    isLoading: isCheckingIn || isCheckingOut,
  };
}
