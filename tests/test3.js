import { setTimeout } from 'timers/promises';

const value = await setTimeout(1000, 'test3');

console.log(value);