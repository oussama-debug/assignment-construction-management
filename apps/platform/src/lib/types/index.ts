export interface User {
  id: string;
  name: string;
  email: string;
  role: "worker" | "supervisor";
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Worker {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  employeeId?: string;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

export interface ConstructionSite {
  id: string;
  name: string;
  address: string;
  siteCode: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CheckIn {
  id: string;
  workerId: string;
  siteId: string;
  checkInTime: Date;
  checkOutTime?: Date;
  status: "checked_in" | "checked_out";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActiveCheckIn {
  id: string;
  workerId: string;
  workerName: string;
  siteId: string;
  siteName: string;
  checkInTime: Date;
  notes?: string;
}

export interface CheckInHistory {
  id: string;
  workerId: string;
  workerName: string;
  siteId: string;
  siteName: string;
  checkInTime: Date;
  checkOutTime?: Date;
  status: "checked_in" | "checked_out";
  notes?: string;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export type LoadingState = "idle" | "loading" | "success" | "error";

export interface AsyncState<T> {
  data: T | null;
  loading: LoadingState;
  error: string | null;
}
