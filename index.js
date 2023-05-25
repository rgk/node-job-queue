import { JobQueue } from './lib.js';

const [ runtime, file, ...input ] = process.argv;

const args = input.filter(word => word[0] === '-');

const files = input.filter(word => word[0] !== '-');

const queue = new JobQueue(files, args);

await queue.run();

console.log(queue.output());
