"use client";

import { trpc } from "@/lib/trpc/client";
import { Button } from "@civalgo/ui/button";
import { CheckIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@civalgo/ui/select";
import { useState } from "react";
import { toast } from "sonner";

type WorkerProps = {
  id: string;
  name: string;
};

export default function WorkersCheckin({ id, name }: WorkerProps) {
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState<string>("");

  const { mutateAsync: checkIn } = trpc.worker.checkIn.useMutation({
    onSuccess: () => {
      toast.success("Successfully checked in!");
      setIsCheckingIn(false);
      refetch();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to check in. Please try again.");
      setIsCheckingIn(false);
    },
  });
  const { mutateAsync: checkOut } = trpc.worker.checkOut.useMutation({
    onSuccess: () => {
      toast.success("Successfully checked out!");
      setIsCheckingOut(false);
      refetch();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to check out. Please try again.");
      setIsCheckingOut(false);
    },
  });

  const { data: sites } = trpc.site.getActiveSites.useQuery();

  const { data: activeCheckIns, refetch } =
    trpc.worker.getActiveCheckIns.useQuery({
      siteId: selectedSiteId || undefined,
    });

  const isCurrentlyCheckedIn = activeCheckIns?.data?.some(
    (checkIn) => checkIn.workerId === id
  );

  const handleCheckIn = async () => {
    if (!selectedSiteId) {
      toast.error("Please select a construction site first");
      return;
    }
    setIsCheckingIn(true);
    await checkIn({
      workerId: id,
      siteId: selectedSiteId,
    });
  };

  const handleCheckOut = async () => {
    try {
      setIsCheckingOut(true);
      await checkOut({
        workerId: id,
      });
      toast.success("Successfully checked out!");
      refetch();
    } catch (error) {
      toast.error("Failed to check out. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-6 flex justify-between items-center flex-row">
          <h1 className="text-md font-medium text-gray-900 mb-2">
            Welcome, {name}!
          </h1>
          <div className="flex flex-row justify-start items-center gap-x-4">
            <div>
              {sites && sites.length > 0 ? (
                <Select
                  value={selectedSiteId}
                  onValueChange={(value) => setSelectedSiteId(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a site" />
                  </SelectTrigger>
                  <SelectContent>
                    {sites.map((site) => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.name} ({site.siteCode})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-sm text-gray-600 p-2 bg-gray-100 rounded-md">
                  No construction sites available. Please contact your
                  supervisor to set up construction sites.
                </div>
              )}
            </div>
            <Button
              onClick={handleCheckIn}
              disabled={isCurrentlyCheckedIn || isCheckingIn || !selectedSiteId}
              loading={isCheckingIn}
              className="w-full space-x-2"
              variant={isCurrentlyCheckedIn ? "outline" : "default"}
            >
              <CheckIcon className="h-4 w-4" />
              <span>
                {!selectedSiteId
                  ? "Select a site"
                  : isCurrentlyCheckedIn
                    ? "Already Checked In"
                    : "Check In"}
              </span>
            </Button>

            <Button
              onClick={handleCheckOut}
              disabled={!isCurrentlyCheckedIn || isCheckingOut}
              loading={isCheckingOut}
              className="w-full space-x-2"
              variant={!isCurrentlyCheckedIn ? "outline" : "destructive"}
            >
              <span>
                {!isCurrentlyCheckedIn ? "Not Checked In" : "Check Out"}
              </span>
            </Button>
          </div>
        </div>

        <div className="mb-6 space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-medium text-gray-900 uppercase text-xs">
                Status:
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Worker ID:</span> {id}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Selected Site:</span>{" "}
                {selectedSiteId
                  ? sites?.find((site) => site.id === selectedSiteId)?.name ||
                    selectedSiteId
                  : "No site selected"}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Status:</span>
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
        </div>
      </div>
    </div>
  );
}
