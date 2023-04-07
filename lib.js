import util from 'node:util';
import { execFile } from 'child_process';

import os from 'os';

const execFilePromise = util.promisify(execFile);

const THREAD_COUNT = os.cpus().length;

class JobQueue {
  threads = THREAD_COUNT;
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
    console.info(job + ' started.');
    return execFilePromise(job, ['--queue'], (error, stdout, stderr) => {
      if (error) console.error(error);

      if (stdout || stderr) this.output[job] = stdout || stderr;

      console.info(job + ' finished.');
    });
  }

  *getJob() {
    for (let i = 0; i < this.list.length; i++) yield this.list[i];
  }

  async lock(thread, jobs) {
    for await (const job of jobs) {
      await this.processJob(job);
    }
  }

  queueList(reverse = false) {
    if (reverse) this.list.reverse();
    
    const jobs = this.getJob();

    for (let i = 0; i < this.threads; i++) lock(i, jobs);

    return this.list;
  }
}
