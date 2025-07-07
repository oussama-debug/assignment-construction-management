"use client";

import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc/client";

import { useWorkerMatching } from "@/hooks/use-worker-matching";
import { useCheckInOut } from "@/hooks/use-check-in-out";
import { useCheckInStatus } from "@/hooks/use-check-in-status";

import { WorkersSiteSelector } from "./checkin-site-selector";
import { WorkersCheckInButtons } from "./checkin-actions";
import { WorkerStatus } from "./checkin-status";

import type { WorkerUser } from "@/lib/types";

interface WorkersCheckinProps {
  id: string;
  name: string;
  email: string;
}

export default function WorkersCheckin({
  id,
  name,
  email,
}: WorkersCheckinProps) {
  const [selectedSiteId, setSelectedSiteId] = useState<string>("");

  const user: WorkerUser = { id, name, email };

  const { matchedWorker, hasWorkerRecord } = useWorkerMatching(user);
  const { checkIn, checkOut, isCheckingIn, isCheckingOut } = useCheckInOut();
  const { isCurrentlyCheckedIn } = useCheckInStatus({
    worker: matchedWorker,
    selectedSiteId,
  });

  const { data: sites } = trpc.site.getActiveSites.useQuery();

  const handleCheckIn = async () => {
    if (!selectedSiteId) {
      toast.error("Please select a construction site first");
      return;
    }

    if (!matchedWorker) {
      toast.error("No worker record found. Please contact your supervisor.");
      return;
    }

    await checkIn({
      workerId: matchedWorker.id,
      siteId: selectedSiteId,
    });
  };

  const handleCheckOut = async () => {
    if (!matchedWorker) {
      toast.error("No worker record found. Please contact your supervisor.");
      return;
    }

    await checkOut({
      workerId: matchedWorker.id,
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-md font-medium text-gray-900">
            Welcome, {name}!
          </h1>

          <div className="flex items-center gap-x-4">
            <WorkersSiteSelector
              sites={sites}
              selectedSiteId={selectedSiteId}
              onSiteChange={setSelectedSiteId}
              disabled={!hasWorkerRecord}
            />

            <WorkersCheckInButtons
              onCheckIn={handleCheckIn}
              onCheckOut={handleCheckOut}
              isCheckingIn={isCheckingIn}
              isCheckingOut={isCheckingOut}
              isCurrentlyCheckedIn={isCurrentlyCheckedIn}
              selectedSiteId={selectedSiteId}
              disabled={!hasWorkerRecord}
            />
          </div>
        </div>

        <WorkerStatus
          worker={matchedWorker}
          userId={id}
          email={email}
          selectedSiteId={selectedSiteId}
          sites={sites}
          isCurrentlyCheckedIn={isCurrentlyCheckedIn}
        />
      </div>
    </div>
  );
}
