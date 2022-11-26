import { execFile } from 'child_process';

import os from 'os';

const THREAD_COUNT = os.cpus().length;

const [ runtime, file, ...input ] = process.argv;

const processes = new Map();
const output = new Map();

+function keepGoing(start = 0) {
  if (~start) console.log([ ...output ]);
  while (start++ < input.length) {
    const inputFile = input[start];
    processes.add(inputFile, execFile(inputFile, ['--queue'], (error, stdout, stderr) => {
      if (error) throw error;

      if (stdout || stderr) output.set(inputFile, stdout || stderr);

      console.log(`{$inputFile} is finished.`);
      processes.delete(inputFile);
      keepGoing(start < input.length ? start : -1);
    }));

    console.log(`{$inputFile} is being processed.`);

    if (processes.size >= THREAD_COUNT) break;
  }
}();

console.info(`${runtime} ${file} is currently running.`);
