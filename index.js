import { execFile } from 'child_process';

import os from 'os';

const THREAD_COUNT = os.cpus().length;

const [ runtime, file, ...input ] = process.argv;

const processes = new Map();
const output = new Map();

+function keepGoing(start = 0) {
  if (~start) console.log([ ...output ]);
  while (start++ < input.length) {
    processes.add(input, execFile(input[start], ['--queue'], (error, stdout, stderr) => {
      if (error) throw error;

      if (stdout || stderr) output.set(input[start], stdout || stderr);

      console.log(`{$input[start} is finished.`);
      processes.delete(input[start]);
      keepGoing(start < input.length ? start : -1);
    }));

    console.log(`{$input[start} is being processed.`);

    if (processes.size >= THREAD_COUNT) break;
  }
}();

console.info(`${runtime} ${file} is currently running.`);
