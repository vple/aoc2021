import * as fs from 'fs/promises';

const mostCommonBit = (numbers: number[][], index: number) => {
  const total = numbers.length;
  const column = numbers.map(line => line[index]);
  const sum = column.reduce((a, b) => a + b);
  return sum >= total/2 ? 1 : 0;
}

const part1 = (input: string) => {
  const lines = input.trim().split("\n");

  const total = lines.length;
  const half = total / 2;
  const numberLength = lines[0].length;

  const charLines = lines.map(line => line.split('').map(bit => parseInt(bit)));

  const arraySum = (previous: number[], current: number[]) => {
    for (let i = 0; i < numberLength; i++) {
      previous[i] += current[i];
    }
    return previous;
  }

  const indexSum = charLines.reduce(arraySum);

  const gamma = parseInt(indexSum.map(sum => (sum >= half) ? 1 : 0).join(''), 2);
  const epsilon = parseInt(indexSum.map(sum => (sum >= half) ? 0 : 1).join(''), 2);

  return gamma * epsilon;
};

const part2 = (input: string) => {
  const lines = input.trim().split("\n");

  const total = lines.length;
  const half = total / 2;
  const numberLength = lines[0].length;

  const charLines = lines.map(line => line.split('').map(bit => parseInt(bit)));

  let searchSpace = charLines;
  let index = 0;
  while (searchSpace.length > 1) {
    const mostCommon = mostCommonBit(searchSpace, index);
    searchSpace = searchSpace.filter(line => line[index] === mostCommon);
    index++;
  }
  const oxygen = parseInt(searchSpace[0].join(''), 2);

  searchSpace = charLines;
  index = 0;
  while (searchSpace.length > 1) {
    const leastCommon = 1 - mostCommonBit(searchSpace, index);
    searchSpace = searchSpace.filter(line => line[index] === leastCommon);
    index++;
  }
  const co2 = parseInt(searchSpace[0].join(''), 2);

  return oxygen * co2;
};

const run = async () => {
  const input = await fs.readFile('input.txt', 'utf-8');

  console.log(`Part 1: ${part1(input)}`);
  console.log(`Part 2: ${part2(input)}`);
}

run()
  .then(() => { process.exit(); })
  .catch(error => { throw error; });
