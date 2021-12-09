import * as fs from 'fs/promises';

const basinKey = (point: [number, number]) => `${point[0]}-${point[1]}`;

const computeBasin = (lowPoint: [number, number], grid: number[][]) => {
  const rows = grid.length;
  const cols = grid[0].length;

  const basin = new Set<string>();
  let next: [number, number][] = [lowPoint];

  while (next.length > 0) {
    const point = next.shift();
    if (!point) {
      throw new Error();
    }

    const row = point[0];
    const col = point[1];
    const height = grid[row][col];

    basin.add(basinKey(point));

    const neighbors: [number, number][] = [];

    if (row > 0) {
      neighbors.push([row-1, col]);
    }
    if (row < rows-1) {
      neighbors.push([row+1, col]);
    }
    if (col > 0) {
      neighbors.push([row, col-1]);
    }
    if (col < cols-1) {
      neighbors.push([row, col+1]);
    }

    neighbors.forEach(neighbor => {
      if (basin.has(basinKey(neighbor))) return;
      const neighborHeight = grid[neighbor[0]][neighbor[1]];
      if (neighborHeight <= height) return;
      if (neighborHeight === 9) return;
      next.push(neighbor);
    });
  }
  return basin;
}

const part1 = (input: string) => {
  const lines = input.trim().split('\n');
  const grid = lines.map(line => line.split('').map(digit => Number(digit)));

  const rows = grid.length;
  const cols = grid[0].length;

  let risk = 0;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const current = grid[row][col];
      if (row > 0 && grid[row-1][col] <= current) {
        continue;
      }
      if (row < rows-1 && grid[row+1][col] <= current) {
        continue;
      }
      if (col > 0 && grid[row][col-1] <= current) {
        continue;
      }
      if (col < cols-1 && grid[row][col+1] <= current) {
        continue;
      }
      risk += (current + 1);
    }
  }

  return risk;
};

const part2 = (input: string) => {
  const lines = input.trim().split('\n');
  const grid = lines.map(line => line.split('').map(digit => Number(digit)));

  const rows = grid.length;
  const cols = grid[0].length;

  const lowPoints: [number, number][] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const current = grid[row][col];
      if (row > 0 && grid[row-1][col] <= current) {
        continue;
      }
      if (row < rows-1 && grid[row+1][col] <= current) {
        continue;
      }
      if (col > 0 && grid[row][col-1] <= current) {
        continue;
      }
      if (col < cols-1 && grid[row][col+1] <= current) {
        continue;
      }
      lowPoints.push([row, col]);
    }
  }

  const basinSizes = lowPoints.map(point => computeBasin(point, grid).size);
  basinSizes.sort((a, b) => a-b);
  const largestThree = basinSizes.slice(-3);

  return largestThree[0] * largestThree[1] * largestThree[2];
};

const run = async () => {
  const input = await fs.readFile('input.txt', 'utf-8');

  console.log(`Part 1: ${part1(input)}`);
  console.log(`Part 2: ${part2(input)}`);
}

run()
  .then(() => { process.exit(); })
  .catch(error => { throw error; });
