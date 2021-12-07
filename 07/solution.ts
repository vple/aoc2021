import * as fs from 'fs/promises';

const calcFuel = (positions: number[], target: number, fuelFunction: (position: number, target: number) => number) => {
  return positions.reduce((total, position) => { return total + fuelFunction(position, target) }, 0);
}

const part1 = (input: string) => {
  const positions = input.trim().split(",").map(number => parseInt(number));
  positions.sort();

  const start = positions[0];
  const end = positions[positions.length-1];

  let min = Number.MAX_SAFE_INTEGER;

  for (let i = start; i <= end; i++) {
    const fuel = calcFuel(positions, i, (position, target) => { return Math.abs(position - target) });
    if (fuel < min) {
      min = fuel;
    }
  }

  return min;
};

const part2 = (input: string) => {
  const positions = input.trim().split(",").map(number => parseInt(number));
  positions.sort();

  const start = positions[0];
  const end = positions[positions.length-1];

  let min = Number.MAX_SAFE_INTEGER;

  for (let i = start; i <= end; i++) {
    const fuel =
      calcFuel(
        positions,
        i,
        (position, target) => {
          const distance = Math.abs(position - target);
          return distance * (distance + 1) / 2;
        });
    if (fuel < min) {
      min = fuel;
    }
  }

  return min;
};

const run = async () => {
  const input = await fs.readFile('input.txt', 'utf-8');

  console.log(`Part 1: ${part1(input)}`);
  console.log(`Part 2: ${part2(input)}`);
}

run()
  .then(() => { process.exit(); })
  .catch(error => { throw error; });
