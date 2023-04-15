import { setTimeout } from 'timers/promises';

const value = await setTimeout(1000, 'test5');

console.log(value);