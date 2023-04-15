import util from 'node:util';
import { fork } from 'child_process';

import os from 'os';

const THREAD_COUNT = os.cpus().length;

class JobQueue {
  threads = THREAD_COUNT;
  options = { silent: true };

  #output = null;

  constructor(list) {
    this.list = list;
  }

  // Methods
  processJob(job, thread) {
    return new Promise((resolve, reject) => {
      const process = fork(job, ['--queue'], this.options);

      this.#output[job] = [];

      process.stdout?.on('data', (data) => {
        this.#output[job].push(data);
      });

      process.on('spawn', () => console.info('thread: ' + thread + ' <|> ' + job + ' started.'));
      process.on('error', reject);
      process.on('exit', () => console.info('thread: ' + thread + ' <|> ' + job + ' finished.'));
      process.on('close', resolve);
    })
  }

  async *#getJob() {
    for (let i = 0; i < this.list.length; i++) yield this.list[i];
  }

  async lock(thread, jobs) {
    const registry = [];
    for await (const job of jobs) {
      registry.push(await this.processJob(job, thread));
    }

    return `Thread: ${thread} complete.`;
  }

  clear() {
    return this.#output = [];
  }

  result() {
    return this.#output;
  }

  async run(reverse = false, clear = true) {
    if (reverse) this.list.reverse();
    
    const jobs = this.#getJob();

    const thread = [];

    if (clear) this.clear();

    for (let i = 1; i <= this.threads; i++) thread[i] = this.lock(i, jobs);

    return Promise.all(thread);
  }
}
