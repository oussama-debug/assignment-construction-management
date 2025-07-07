export type {
  User,
  Worker,
  CheckIn,
  ConstructionSite,
  NewUser,
  NewWorker,
  NewCheckIn,
  NewConstructionSite,
  PaginationParams,
  PaginationResult,
} from "@civalgo/database";

import type { Worker, ConstructionSite } from "@civalgo/database";

export interface WorkerUser {
  id: string;
  name: string;
  email: string;
  role?: "supervisor" | "worker";
}

export interface CheckInParams {
  workerId: string;
  siteId: string;
  notes?: string;
}

export interface CheckOutParams {
  workerId: string;
  notes?: string;
}

export interface WorkerWithStatus extends Worker {
  isActive: boolean;
  displayName: string;
}

export interface ConstructionSiteWithStatus extends ConstructionSite {
  workerCount?: number;
  activeCheckIns?: number;
}
