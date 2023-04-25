import util from 'node:util';
import { fork } from 'child_process';

import os from 'os';

const THREAD_COUNT = os.cpus().length;

export class JobQueue {
  threads = THREAD_COUNT;
  options = { silent: true };

  #output = null;
  #error = null;
  #input = null;

  constructor(list, args = []) {
    this.list = list;
    this.args = args;
  }

  // Methods
  processJob(job, thread) {
    return new Promise((resolve, reject) => {
      const process = fork(job, this.args, this.options);

      this.#output[job] = [];
      this.#error[job] = [];
      this.#input[job] = [];

      process.stdout?.on('data', (data) => {
        this.#output[job].push(data);
      });

      process.stdin?.on('data', (data) => {
        this.#input[job].push(data);
      });

      process.stderr?.on('data', (data) => {
        this.#error[job].push(data);
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
    return this.#output.length = 0;
  }

  result() {
    return this.#output.slice();
  }

  errors() {
    return this.#error.slice();
  }

  input() {
    return this.#input.slice();
  }

  stringify(data) {
    return JSON.stringify(data);
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
