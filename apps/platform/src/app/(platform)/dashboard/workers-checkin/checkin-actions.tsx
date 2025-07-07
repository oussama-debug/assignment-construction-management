"use client";

import { Button } from "@civalgo/ui/button";
import { CheckIcon } from "lucide-react";

interface CheckInButtonsProps {
  onCheckIn: () => void;
  onCheckOut: () => void;
  isCheckingIn: boolean;
  isCheckingOut: boolean;
  isCurrentlyCheckedIn: boolean;
  selectedSiteId: string;
  disabled?: boolean;
}

export function WorkersCheckInButtons({
  onCheckIn,
  onCheckOut,
  isCheckingIn,
  isCheckingOut,
  isCurrentlyCheckedIn,
  selectedSiteId,
  disabled = false,
}: CheckInButtonsProps) {
  const canCheckIn = !isCurrentlyCheckedIn && selectedSiteId && !disabled;
  const canCheckOut = isCurrentlyCheckedIn && !disabled;

  return (
    <div className="flex gap-x-4">
      <Button
        onClick={onCheckIn}
        disabled={!canCheckIn || isCheckingIn}
        loading={isCheckingIn}
        className="space-x-2"
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
        onClick={onCheckOut}
        disabled={!canCheckOut || isCheckingOut}
        loading={isCheckingOut}
        variant={!isCurrentlyCheckedIn ? "outline" : "destructive"}
      >
        <span>{!isCurrentlyCheckedIn ? "Not Checked In" : "Check Out"}</span>
      </Button>
    </div>
  );
}
