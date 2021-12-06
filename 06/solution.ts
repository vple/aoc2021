import * as fs from 'fs/promises';

const simulateDay = (fish: number[]) => {
  const result: number[] = [];
  fish.forEach(timer => {
    if (timer > 0) {
      result.push(timer-1);
    } else {
      result.push(6);
      result.push(8);
    }
  })
  return result;
}

const memoizedDescendantCounts = new Map<string, number>();

const countDescendants = (timer: number, days: number): number => {
  const key: string = `${timer}-${days}`;
  if (memoizedDescendantCounts.has(key)) {
    return memoizedDescendantCounts.get(key)!!;
  }

  let total = 1;
  let remainingDays = days - timer - 1; // First birth.
  while (remainingDays >= 0) {
    // timer = 6
    total += countDescendants(8, remainingDays);
    remainingDays -= 7;
  }

  memoizedDescendantCounts.set(key, total);
  return total;
}

const part1 = (input: string) => {
  const lines = input.trim().split(",").map(number => parseInt(number));

  let fish = lines;
  for (let i = 0; i < 80; i++) {
    fish = simulateDay(fish);
  }

  return fish.length;
};

const part2 = (input: string) => {
  const lines = input.trim().split(",").map(number => parseInt(number));

  let total = 0;
  lines.forEach(timer => {
    total += countDescendants(timer, 256);
  });

  return total;
};

const run = async () => {
  const input = await fs.readFile('input.txt', 'utf-8');

  console.log(`Part 1: ${part1(input)}`);
  console.log(`Part 2: ${part2(input)}`);
}

run()
  .then(() => { process.exit(); })
  .catch(error => { throw error; });
