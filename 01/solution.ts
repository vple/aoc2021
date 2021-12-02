import * as fs from 'fs/promises';

const part1 = async (input: string) => {
  const lines = input.split("\n").map(value => parseInt(value));

  let increases = 0;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] > lines[i-1]) {
      increases++;
    }
  }

  return increases;
};

const part2 = async (input: string) => {
  const lines = input.split("\n").map(value => parseInt(value));

  let increases = 0;
  for (let i = 3; i < lines.length; i++) {
    if (lines[i] > lines[i-3]) {
      increases++;
    }
  }

  return increases;
};

const run = async () => {
  const input = await fs.readFile('input.txt', 'utf-8');

  await part1(input)
    .then(result => console.log(`Part 1: ${result}`));
  await part2(input)
    .then(result => console.log(`Part 2: ${result}`));
}

run()
  .then(() => { process.exit(); })
  .catch(error => { throw error; });
