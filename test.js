import assert from 'node:assert';
import { JobQueue } from './lib.js';

const queue = new JobQueue(['./test/test1.js','./test/test2.js','./test/test3.js','./test/test4.js','./test/test5.js']);
