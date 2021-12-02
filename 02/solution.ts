import * as fs from 'fs/promises';

const part1 = (input: string) => {
  const lines = input.split("\n");

  let horizontal = 0;
  let depth = 0;

  for(let i = 0; i < lines.length; i++) {
    const instructions = lines[i].split(' ');
    const value = parseInt(instructions[1]);
    switch(instructions[0]) {
      case 'forward':
        horizontal += value;
        break;
      case 'up':
        depth -= value;
        break;
      case 'down':
        depth += value;
        break;
      default:
        break;
    }
  }

  return horizontal * depth;
};

const part2 = (input: string) => {
  const lines = input.split("\n");

  let horizontal = 0;
  let depth = 0;
  let aim = 0;

  for(let i = 0; i < lines.length; i++) {
    const instructions = lines[i].split(' ');
    const value = parseInt(instructions[1]);
    switch(instructions[0]) {
      case 'forward':
        horizontal += value;
        depth += (aim * value);
        break;
      case 'up':
        aim -= value;
        break;
      case 'down':
        aim += value;
        break;
      default:
        break;
    }
  }

  return horizontal * depth;
};

const run = async () => {
  const input = await fs.readFile('input.txt', 'utf-8');

  console.log(`Part 1: ${part1(input)}`);
  console.log(`Part 2: ${part2(input)}`);
}

run()
  .then(() => { process.exit(); })
  .catch(error => { throw error; });
