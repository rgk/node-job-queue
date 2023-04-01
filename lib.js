import { execFile } from 'child_process';

import os from 'os';

const THREAD_COUNT = os.cpus().length;

class JobQueue {
  threads = THREAD_COUNT;
  #index = 0;
  output = [];
  constructor(list) {
    this.list = list;
  }

  get list() {
    return this.list;
  }
  
  set list(list) {
    return this.list = list;
  }

  // Methods
  processJob(job) {
    return execFile(job, ['--queue'], (error, stdout, stderr) => {
      if (error) console.error(error);

      if (stdout || stderr) this.output[job] = stdout || stderr;

      console.info(job + ' finished.');
    });
  }

  queueList(reverse = false) {
    if (reverse) this.#index = this.threads;
    return list;
  }
}
