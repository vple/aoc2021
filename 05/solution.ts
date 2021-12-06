import * as fs from 'fs/promises';

const parseLine = (line: string) => {
  const parts = line.split(' -> ');
  const coordinate1 = parts[0].split(',').map(x => parseInt(x));
  const coordinate2 = parts[1].split(',').map(x => parseInt(x));

  return [coordinate1, coordinate2];
}

const isHorizontal = (pair: number[][]) => {
  return pair[0][1] === pair[1][1];
}

const isVertical = (pair: number[][]) => {
  return pair[0][0] === pair[1][0];
}

const isDiagonal = (pair: number[][]) => {
  console.log(pair);
  console.log(Math.abs(pair[1][0] - pair[0][0]) === Math.abs(pair[1][1] - pair[0][1]));
  return Math.abs(pair[1][0] - pair[0][0]) === Math.abs(pair[1][1] - pair[0][1]);
}

const part1 = (input: string) => {
  const lines = input.trim().split("\n");

  const coordinates = lines.map(line => parseLine(line));

  const hvOnly = coordinates.filter(pair => isHorizontal(pair) || isVertical(pair));

  const counts: Record<string, number> = {};

  for (let i = 0; i < hvOnly.length; i++) {
    const first = hvOnly[i][0];
    const second = hvOnly[i][1];

    // Vertical
    if (first[0] === second[0]) {
      const small = Math.min(first[1], second[1]);
      const big = Math.max(first[1], second[1]);

      for (let i = small; i <= big; i++) {
        const key = `${first[0]}-${i}`;
        if (!(key in counts)) {
          counts[key] = 0;
        }
        counts[key]++;
      }
    } else if (first[1] === second[1]) {
      // Horizontal
      const small = Math.min(first[0], second[0]);
      const big = Math.max(first[0], second[0]);

      for (let i = small; i <= big; i++) {
        const key = `${i}-${first[1]}`;
        if (!(key in counts)) {
          counts[key] = 0;
        }
        counts[key]++;
      }
    }
  }

  return Object.values(counts).filter(count => count >= 2).length;
};

const part2 = (input: string) => {
  const lines = input.trim().split("\n");

  const coordinates = lines.map(line => parseLine(line));

  // All valid.
  const hvOnly = coordinates;

  const counts: Record<string, number> = {};

  for (let i = 0; i < hvOnly.length; i++) {
    const first = hvOnly[i][0];
    const second = hvOnly[i][1];

    if (isVertical(hvOnly[i])) {
      // Vertical
      const small = Math.min(first[1], second[1]);
      const big = Math.max(first[1], second[1]);

      for (let i = small; i <= big; i++) {
        const key = `${first[0]}-${i}`;
        if (!(key in counts)) {
          counts[key] = 0;
        }
        counts[key]++;
      }
    } else if (isHorizontal(hvOnly[i])) {
      // Horizontal
      const small = Math.min(first[0], second[0]);
      const big = Math.max(first[0], second[0]);

      for (let i = small; i <= big; i++) {
        const key = `${i}-${first[1]}`;
        if (!(key in counts)) {
          counts[key] = 0;
        }
        counts[key]++;
      }
    } else {
      // Diagonal
      const dx = second[0] > first[0] ? 1 : -1;
      const dy = second[1] > first[1] ? 1 : -1;

      for (let i = 0; i <= Math.abs(second[0] - first[0]); i++) {
        const x = first[0] + (dx * i);
        const y = first[1] + (dy * i);
        const key = `${x}-${y}`;

        if (!(key in counts)) {
          counts[key] = 0;
        }
        counts[key]++;
      }
    }
  }

  return Object.values(counts).filter(count => count >= 2).length;
};

const run = async () => {
  const input = await fs.readFile('input.txt', 'utf-8');

  console.log(`Part 1: ${part1(input)}`);
  console.log(`Part 2: ${part2(input)}`);
}

run()
  .then(() => { process.exit(); })
  .catch(error => { throw error; });
