import { JobQueue } from './lib.js';

const [ runtime, file, ...input ] = process.argv;

const queue = new JobQueue(input);

await queue.run();

console.log(queue.result());
