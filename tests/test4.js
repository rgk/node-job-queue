import { setTimeout } from 'timers/promises';

const value = await setTimeout(1000, 'test4');

console.log(value);