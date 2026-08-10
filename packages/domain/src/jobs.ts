export const JOB_STATUS = {
  DRAFT: "draft",
  QUOTED: "quoted",
  SEARCHING: "searching",
  OFFERED: "offered",
  ASSIGNED: "assigned",
  ACCEPTED: "accepted",
  ARRIVED: "arrived",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  EXPIRED: "expired",
} as const;

export type JobStatus = (typeof JOB_STATUS)[keyof typeof JOB_STATUS];

export const SERVICE_TYPE = {
  DELIVERY: "delivery",
  RIDE: "ride",
} as const;

export type ServiceType = (typeof SERVICE_TYPE)[keyof typeof SERVICE_TYPE];

const terminalStatuses = new Set<JobStatus>([
  JOB_STATUS.COMPLETED,
  JOB_STATUS.CANCELLED,
  JOB_STATUS.EXPIRED,
]);

const transitions: Record<JobStatus, readonly JobStatus[]> = {
  draft: ["quoted", "cancelled"],
  quoted: ["searching", "cancelled"],
  searching: ["offered", "cancelled", "expired"],
  offered: ["assigned", "searching", "cancelled", "expired"],
  assigned: ["accepted", "searching", "cancelled"],
  accepted: ["arrived", "cancelled"],
  arrived: ["in_progress", "cancelled"],
  in_progress: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
  expired: [],
};

export const canTransition = (from: JobStatus, to: JobStatus): boolean =>
  !terminalStatuses.has(from) && transitions[from].includes(to);

export const isTerminal = (status: JobStatus): boolean => terminalStatuses.has(status);
