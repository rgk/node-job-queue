import { execFile } from 'child_process';

import os from 'os';

const THREAD_COUNT = os.cpus().length;

class JobQueue {
  constructor(list) {
    this.list = list;
    this.index = 0;
    this.threads = THREAD_COUNT;
    this.output = [];
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

  queueList(list = this.list) {
    return list;
  }
}
