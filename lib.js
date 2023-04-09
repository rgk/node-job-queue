import util from 'node:util';
import { execFile } from 'child_process';

import os from 'os';

const execFilePromise = util.promisify(execFile);

const THREAD_COUNT = os.cpus().length;

class JobQueue {
  threads = THREAD_COUNT;
  output = [];

  cwd = false;
  timeout = false;
  maxBuffer = false;

  constructor(list) {
    this.list = list;
  }

  // Methods
  processJob(job) {
    return execFilePromise(job, ['--queue'], {
      ...this.cwd && { cwd: this.cwd },
      ...this.timeout && { timeout: this.timeout },
      ...this.maxBuffer && { maxBuffer: this.maxBuffer },
    }, (error, stdout, stderr) => {
      if (error) console.error(error);

      if (stdout || stderr) this.output[job] = stdout || stderr;
    });
  }

  async *getJob() {
    for (let i = 0; i < this.list.length; i++) yield this.list[i];
  }

  async lock(thread, jobs) {
    for await (const job of jobs) {
      console.info('thread: ' + thread + ' | ' + job + ' started.');
      await this.processJob(job);
      console.info('thread: ' + thread + ' | ' + job + ' finished.');
    }
  }

  queueList(reverse = false) {
    if (reverse) this.list.reverse();
    
    const jobs = this.getJob();

    for (let i = 0; i < this.threads; i++) this.lock(i, jobs);

    return this.list;
  }
}
