import {ParallelMessages} from '../classes';

export const parallel = (...queues) => new ParallelMessages(queues);
