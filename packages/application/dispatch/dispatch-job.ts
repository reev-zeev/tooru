import type { Coordinates } from "../../domain/geography/coordinates";
import { transition } from "../../domain/orders/job";
import type { DispatchNotifier, DriverLocator, JobRepository } from "./ports";

/**
 * Purpose: orchestrate the first dispatch step for a requested job.
 * This is intentionally provider-agnostic and leaves atomic persistence to
 * JobRepository so concurrent workers cannot both own the same job.
 */
export interface DispatchJobInput {
  readonly jobId: string;
  readonly pickup: Coordinates;
  readonly radiusMeters: number;
}

export interface DispatchJobResult {
  readonly jobId: string;
  readonly candidateDriverIds: readonly string[];
  readonly started: boolean;
}

export class DispatchJob {
  constructor(
    private readonly jobs: JobRepository,
    private readonly drivers: DriverLocator,
    private readonly notifier: DispatchNotifier,
  ) {}

  async execute(input: DispatchJobInput): Promise<DispatchJobResult> {
    const job = await this.jobs.getById(input.jobId);
    if (!job) throw new Error("Job not found");

    if (job.status !== "requested") {
      throw new Error(`Job is not dispatchable from status: ${job.status}`);
    }

    const started = await this.jobs.moveToDispatching(job.id);
    if (!started) {
      return { jobId: job.id, candidateDriverIds: [], started: false };
    }

    // Keep the domain transition explicit even though persistence is authoritative.
    transition(job.status, "dispatching");

    const candidates = await this.drivers.nearby(
      input.pickup,
      input.radiusMeters,
      job.kind,
    );

    const eligible = candidates.filter((candidate) => candidate.available && candidate.eligible);
    await Promise.all(eligible.map((candidate) => this.notifier.offer(candidate.driverId, job.id)));

    return {
      jobId: job.id,
      candidateDriverIds: eligible.map((candidate) => candidate.driverId),
      started: true,
    };
  }
}
