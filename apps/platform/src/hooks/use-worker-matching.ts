"use client";

import { trpc } from "@/lib/trpc/client";
import type { Worker, WorkerUser } from "@/lib/types";

export function useWorkerMatching(user: WorkerUser) {
  const { data: workers, isLoading, error } = trpc.worker.getWorkers.useQuery();

  const matchedWorker = workers?.find(
    (worker: Worker) => worker.email === user.email
  );

  return {
    workers,
    matchedWorker,
    isLoading,
    error,
    hasWorkerRecord: !!matchedWorker,
  };
}
