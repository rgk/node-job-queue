import { execFile } from 'child_process';

import os from 'os';

const THREAD_COUNT = os.cpus().length;

const processes = new Map();
const output = new Map();

export function processJob(job) {
  console.info(job + ' started.');
  processes.set(job, execFile(job, ['--queue'], (error, stdout, stderr) => {
    if (error) console.error(error);

    if (stdout || stderr) output.set(job, stdout || stderr);

    console.info(job + ' finished.');

    processes.delete(job);

    console.info(job + ' stopped.');

    processJob();
  }));
}

class JobQueue {
  constructor(list) {
    this.list = list;
    this.index = 0;
    this.output = [];
  }
  // Getter
  get list() {
    return this.list;
  }
  // Method
  process() {
    return this.output;
  }
}
