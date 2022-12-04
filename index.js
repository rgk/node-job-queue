import { execFile } from 'child_process';

import os from 'os';

const THREAD_COUNT = os.cpus().length;

const [ runtime, file, ...input ] = process.argv;

const processes = new Map();
const output = new Map();

+function processJob(job = input.pop()) {
  if (!job) return output;

  console.log(job + ' started.');
  processes.set(job, execFile(job, ['--queue'], (error, stdout, stderr) => {
    if (error) console.error(error);

    if (stdout || stderr) output.set(job, stdout || stderr);

    console.log(job + ' finished.');

    processes.delete(job);

    processJob();
  }));

  if (processes.size <= THREAD_COUNT) processJob();
}();

console.info(`${runtime} ${file} is currently running.`);
