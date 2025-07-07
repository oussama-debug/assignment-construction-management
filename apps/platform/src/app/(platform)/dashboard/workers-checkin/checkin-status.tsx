"use client";

import type { Worker, ConstructionSite } from "@/lib/types";

interface WorkerStatusProps {
  worker: Worker | undefined;
  userId: string;
  email: string;
  selectedSiteId: string;
  sites: ConstructionSite[] | undefined;
  isCurrentlyCheckedIn: boolean;
}

export function WorkerStatus({
  worker,
  userId,
  email,
  selectedSiteId,
  sites,
  isCurrentlyCheckedIn,
}: WorkerStatusProps) {
  const selectedSite = sites?.find((site) => site.id === selectedSiteId);

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-2 mb-2">
        <span className="font-medium text-gray-900 uppercase text-xs">
          Status:
        </span>
      </div>
      <div className="space-y-1">
        <p className="text-sm text-gray-600">
          <span className="font-medium">User ID:</span> {userId}
        </p>

        {worker ? (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Worker ID:</span> {worker.id}
          </p>
        ) : (
          <p className="text-sm text-red-600">
            <span className="font-medium">⚠️ No worker record found for:</span>{" "}
            {email}
          </p>
        )}

        <p className="text-sm text-gray-600">
          <span className="font-medium">Selected Site:</span>{" "}
          {selectedSite
            ? `${selectedSite.name} (${selectedSite.siteCode})`
            : "No site selected"}
        </p>

        <p className="text-sm text-gray-600">
          <span className="font-medium">Check-in Status:</span>
          <span
            className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
              isCurrentlyCheckedIn
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {isCurrentlyCheckedIn ? "Checked In" : "Available"}
          </span>
        </p>
      </div>
    </div>
  );
}
