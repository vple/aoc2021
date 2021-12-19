import * as fs from 'fs/promises';
import _ from 'lodash';

const key = (row: number, col: number): string => `${row}-${col}`;

const computePathRisk = (risks: number[][]) => {
  const maxRows = risks.length;
  const maxCols = risks[0].length;

  // Subtract 10 to make sure we don't overflow later.
  const pathRisk = Array(maxRows).fill(0).map(x => Array(maxCols).fill(Number.MAX_SAFE_INTEGER - 10));
  pathRisk[maxRows-1][maxCols-1] = 0;

  const next = [[maxRows-1, maxCols-1]];

  while (next.length > 0) {
    const [row, col] = next.shift() as [number, number];
    // The cost to get to the end if stepping onto this coordinate.
    const pathCost = risks[row][col] + pathRisk[row][col];

    if (row - 1 >= 0) {
      if (pathCost < pathRisk[row-1][col]) {
        pathRisk[row-1][col] = pathCost;
        next.push([row-1, col]);
      }
    }
    if (col - 1 >= 0) {
      if (pathCost < pathRisk[row][col-1]) {
        pathRisk[row][col-1] = pathCost;
        next.push([row, col-1]);
      }
    }
    if (row + 1 < maxRows) {
      if (pathCost < pathRisk[row+1][col]) {
        pathRisk[row+1][col] = pathCost;
        next.push([row+1, col]);
      }
    }
    if (col + 1 < maxCols) {
      if (pathCost < pathRisk[row][col+1]) {
        pathRisk[row][col+1] = pathCost;
        next.push([row, col+1]);
      }
    }
  }

  return pathRisk;
}

const part1 = (input: string) => {
  const lines = input.trim().split('\n');

  const risk: number[][] =
    lines.map(line => {
      return line.split('').map(n => Number(n));
    });

  const maxRows = lines.length;
  const maxCols = lines[0].length;

  const pathRisk = computePathRisk(risk);
  return pathRisk[0][0];
};

const part2 = (input: string) => {
  const lines = input.trim().split('\n');

  const risk: number[][] =
    lines.map(line => {
      return line.split('').map(n => Number(n));
    });

  const maxRows = lines.length;
  const maxCols = lines[0].length;

  const expandedRisk: number[][] = Array(maxRows * 5).fill(0).map(x => Array(maxCols * 5).fill(0));

  for (let row = 0; row < maxRows; row++) {
    for (let col = 0; col < maxCols; col++) {
      const original = risk[row][col];

      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
          // Max is 9 + 4 + 4 = 17.
          let expanded = original + r + c;
          if (expanded > 9) {
            // [10, 17] - 9 => [1, 8]
            expanded -= 9;
          }

          expandedRisk[r * maxRows + row][c * maxCols + col] = expanded;
        }
      }
    }
  }

  const pathRisk = computePathRisk(expandedRisk);
  return pathRisk[0][0];
};

const run = async () => {
  const input = await fs.readFile('input.txt', 'utf-8');

  console.log(`Part 1: ${part1(input)}`);
  console.log(`Part 2: ${part2(input)}`);
}

run()
  .then(() => { process.exit(); })
  .catch(error => { throw error; });
