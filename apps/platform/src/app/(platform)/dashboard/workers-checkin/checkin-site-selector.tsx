"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@civalgo/ui/select";
import type { ConstructionSite } from "@/lib/types";

interface WorkersSiteSelectorProps {
  sites: ConstructionSite[] | undefined;
  selectedSiteId: string;
  onSiteChange: (siteId: string) => void;
  disabled?: boolean;
}

export function WorkersSiteSelector({
  sites,
  selectedSiteId,
  onSiteChange,
  disabled = false,
}: WorkersSiteSelectorProps) {
  if (!sites || sites.length === 0) {
    return (
      <div className="text-sm text-gray-600 p-2 bg-gray-100 rounded-md">
        No construction sites available. Please contact your supervisor to set
        up construction sites.
      </div>
    );
  }

  return (
    <Select
      value={selectedSiteId}
      onValueChange={onSiteChange}
      disabled={disabled}
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
  );
}
