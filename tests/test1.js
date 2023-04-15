import { setTimeout } from 'timers/promises';

const value = await setTimeout(1000, 'test1');

console.log(value);