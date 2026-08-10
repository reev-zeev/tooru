/**
 * Purpose: canonical lifecycle for every executable logistics/mobility job.
 * State transitions are explicit so dispatch, payments, and interfaces cannot
 * silently create incompatible lifecycle states.
 */
export type JobKind = "ride" | "delivery" | "pickup" | "multi_stop";

export type JobStatus =
  | "draft"
  | "quoted"
  | "requested"
  | "dispatching"
  | "assigned"
  | "arriving"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "expired";

const transitions: Readonly<Record<JobStatus, readonly JobStatus[]>> = {
  draft: ["quoted", "cancelled"],
  quoted: ["requested", "cancelled"],
  requested: ["dispatching", "cancelled", "expired"],
  dispatching: ["assigned", "cancelled", "expired"],
  assigned: ["arriving", "cancelled"],
  arriving: ["in_progress", "cancelled"],
  in_progress: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
  expired: [],
};

export function canTransition(from: JobStatus, to: JobStatus): boolean {
  return transitions[from].includes(to);
}

export function transition(from: JobStatus, to: JobStatus): JobStatus {
  if (!canTransition(from, to)) {
    throw new Error(`Invalid job transition: ${from} -> ${to}`);
  }
  return to;
}

export interface Job {
  readonly id: string;
  readonly kind: JobKind;
  readonly status: JobStatus;
  readonly cityId: string;
  readonly customerId: string;
  readonly driverId?: string;
}
