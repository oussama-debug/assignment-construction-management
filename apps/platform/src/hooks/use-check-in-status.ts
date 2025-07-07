"use client";

import { trpc } from "@/lib/trpc/client";
import type { Worker } from "@/lib/types";

interface UseCheckInStatusParams {
  worker: Worker | undefined;
  selectedSiteId: string;
}

export function useCheckInStatus({
  worker,
  selectedSiteId,
}: UseCheckInStatusParams) {
  const {
    data: activeCheckIns,
    refetch,
    isLoading,
  } = trpc.worker.getActiveCheckIns.useQuery({
    siteId: selectedSiteId || undefined,
  });

  const isCurrentlyCheckedIn = activeCheckIns?.data?.some(
    (checkIn) => checkIn.workerId === worker?.id
  );

  return {
    activeCheckIns,
    isCurrentlyCheckedIn: !!isCurrentlyCheckedIn,
    refetch,
    isLoading,
  };
}
