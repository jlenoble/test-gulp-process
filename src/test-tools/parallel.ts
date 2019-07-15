import { ParallelMessages } from "../classes";

export const parallel = (...queues: string[][]): ParallelMessages =>
  new ParallelMessages(queues);
