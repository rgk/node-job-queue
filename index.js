import { execFile } from 'child_process';

import os from 'os';

const THREAD_COUNT = os.cpus().length;

const [ runtime, file, ...input ] = process.argv;

const processes = new Map();
const output = new Map();

+function keepGoing(start = 0) {
  if (~start) console.log([ ...output ]);
  while (start++ < input.length) {
    processes.add(input, execFile(input, ['--queue'], (error, stdout, stderr) => {
      if (error) throw error;

      if (stdout || stderr) output.set(input, stdout || stderr);

      processes.delete(input);
      keepGoing(start < input.length ? start : -1);
    })); 
    
    if (processes.size >= THREAD_COUNT) break;
  }
}();

console.info(`${runtime} ${file} is currently running.`);
