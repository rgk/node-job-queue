import os from 'os';

const THREAD_COUNT = os.cpus().length;

const [ runtime, file, ...input ] = process.argv;

console.info('Job queue is running.');
