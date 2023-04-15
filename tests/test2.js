import { setTimeout } from 'timers/promises';

const value = await setTimeout(1000, 'test2');

console.log(value);