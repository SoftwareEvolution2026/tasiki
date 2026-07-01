/**
 * Task priority. Reserved for v3.0 (due dates & priorities) — declared now so
 * the contract grows additively rather than breaking later.
 */
export enum Priority {
  Low = 'LOW',
  Medium = 'MEDIUM',
  High = 'HIGH',
}

/** A task as returned by the API. */
export interface Task {
  id: string;
  title: string;
  description: string | null;
  done: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Payload for creating a task. */
export interface CreateTaskInput {
  title: string;
  description?: string;
}

/** Payload for updating a task — every field is optional. */
export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  done?: boolean;
}
