import { ParallelMessages } from "../classes";

export const parallel = (...queues): ParallelMessages =>
  new ParallelMessages(queues);
