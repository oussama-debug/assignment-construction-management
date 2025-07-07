"use client";

import { Button } from "@civalgo/ui/button";
import { PlusIcon, RefreshCw } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { useState } from "react";
import { useCreateWorkers } from "@/lib/stores/use-create-workers";

export default function WorkersHeader() {
  const { setIsOpen } = useCreateWorkers();
  const { refetch } = trpc.worker.getActiveCheckIns.useQuery(
    {},
    {
      refetchInterval: 5000,
      refetchIntervalInBackground: true,
    }
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="w-full flex flex-row justify-between items-center">
      <div className="flex items-center space-x-3">
        <h1 className="text-md font-medium font-sans!">Dashboard</h1>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant={"secondary"}
          size="sm"
          className="space-x-1"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          <span>Refresh</span>
        </Button>
        <Button
          variant="default"
          size="sm"
          className="space-x-1"
          onClick={() => setIsOpen(true)}
        >
          <PlusIcon className="h-4 w-4" />
          <span>Add Worker</span>
        </Button>
      </div>
    </div>
  );
}
