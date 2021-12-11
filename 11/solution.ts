import * as fs from 'fs/promises';

type Octopus = {
  level: number;
  flash: boolean;
}

const print = (octopi: Octopus[][]) => {
  let s = '';
  octopi.forEach(line => {
    s += line.map(octopus => octopus.level).join('');
    s += '\n';
  });
  console.log(s);
}

const step = (octopi: Octopus[][]) => {
  const rows = octopi.length;
  const cols = octopi[0].length;

  const flashed = new Set<string>();
  const flashing: [number, number][] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const octopus = octopi[row][col];
      octopus.level++;
      if (octopus.level > 9) {
        flashing.push([row, col]);
      }
    }
  }

  while (flashing.length > 0) {
    const [row, col] = flashing.shift()!;
    const key = `${row}-${col}`;
    if (flashed.has(key)) continue;

    flashed.add(key);
    octopi[row][col].flash = true;

    for (let i = -1; i <= 1; i++) {
      const r = row + i;
      if (r < 0 || r >= rows) continue;
      for (let j = -1; j <= 1; j++) {
        const c = col + j;
        if (c < 0 || c >= cols) continue;
        if (i === 0 && j === 0) continue;

        octopi[r][c].level++;
        if (octopi[r][c].level > 9) {
          flashing.push([r, c]);
        }
      }
    }
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const octopus = octopi[row][col];
      if (octopus.flash) {
        octopus.level = 0;
        octopus.flash = false;
      }
    }
  }
}

const part1 = (input: string) => {
  const lines = input.trim().split('\n');
  const numbers = lines.map(line => line.split('').map(n => Number(n)));

  let octopi: Octopus[][] =
    numbers
      .map(numberLine =>
        numberLine.map(n => ({
          level: n,
          flash: false,
        })));

  let flashes = 0;
  for (let i = 0; i < 100; i++) {
    step(octopi);
    const flashCount = octopi.flatMap(line => line).filter(octopus => octopus.level === 0).length;
    flashes += flashCount;
  }

  return flashes;
};

const part2 = (input: string) => {
  const lines = input.trim().split('\n');
  const numbers = lines.map(line => line.split('').map(n => Number(n)));

  let octopi: Octopus[][] =
    numbers
      .map(numberLine =>
        numberLine.map(n => ({
          level: n,
          flash: false,
        })));

  let steps = 0;
  const total = octopi.length * octopi[0].length;
  while (true) {
    step(octopi);
    steps++;
    const flashCount = octopi.flatMap(line => line).filter(octopus => octopus.level === 0).length;
    if (flashCount === total) break;
  }

  return steps;
};

const run = async () => {
  const input = await fs.readFile('input.txt', 'utf-8');

  console.log(`Part 1: ${part1(input)}`);
  console.log(`Part 2: ${part2(input)}`);
}

run()
  .then(() => { process.exit(); })
  .catch(error => { throw error; });
