import * as fs from 'fs/promises';
import _ from 'lodash';

type Bounds = {
  minX: number,
  maxX: number,
  minY: number,
  maxY: number;
}

const inYBounds = (y: number, bounds: Bounds) => y >= bounds.minY && y <= bounds.maxY;

const inBounds = (x: number, y: number, bounds: Bounds) => x >= bounds.minX && x <= bounds.maxX && y >= bounds.minY && y <= bounds.maxY;

const validYVelocity = (vY: number, bounds: Bounds): boolean => {
  // Trick assuming y bounds are negative: after 2 * vY + 1 steps, the probe is at y = 0 with velocity -(vY + 1).
  let position = 0;
  let velocity = -(vY + 1);

  while (true) {
    if (inYBounds(position, bounds)) return true;
    if (position < bounds.minY) return false;
    position += velocity;
    velocity -= 1;
  }
}

const validVelocity = (initX: number, initY: number, bounds: Bounds): boolean => {
  let p_x = 0, p_y = 0;
  let v_x = initX, v_y = initY;

  while (true) {
    if (inBounds(p_x, p_y, bounds)) return true;
    // Assume we're always going forwards.
    if (p_x > bounds.maxX) return false;
    if (p_y < bounds.minY) return false;

    p_x += v_x;
    p_y += v_y;

    // Assume v_x is always >= 0.
    if (v_x > 0) {
      v_x--;
    }
    v_y--;
  }
}

const part1 = (input: string) => {
  const match = input.trim().match(/target area: x=(-?\d+)..(-?\d+), y=(-?\d+)..(-?\d+)/)!;
  const [minX, maxX, minY, maxY] = (match.slice(1, 5) as string[]).map(n => Number(n));
  const bounds: Bounds = {
    minX, maxX, minY, maxY,
  };

  // Assumption: we can always find a valid X velocity.
  const max: number = _.max([Math.abs(minY), Math.abs(maxY)])!;
  let best = 0;
  for (let i = 0; i <= max; i++) {
    if (validYVelocity(i, bounds)) {
      best = i;
    }
  }

  return best * (best + 1) / 2;
};

const part2 = (input: string) => {
  const match = input.trim().match(/target area: x=(-?\d+)..(-?\d+), y=(-?\d+)..(-?\d+)/)!;
  const [minX, maxX, minY, maxY] = (match.slice(1, 5) as string[]).map(n => Number(n));
  const bounds: Bounds = {
    minX, maxX, minY, maxY,
  };

  const x_max: number = maxX;
  const y_max: number = _.max([Math.abs(minY), Math.abs(maxY)])!;

  let count = 0;
  for (let x = 0; x <= x_max; x++) {
    for (let y = minY; y <= y_max; y++) {
      if (validVelocity(x, y, bounds)) {
        count++;
      }
    }
  }

  return count;
};

const run = async () => {
  const input = await fs.readFile('input.txt', 'utf-8');

  console.log(`Part 1: ${part1(input)}`);
  console.log(`Part 2: ${part2(input)}`);
}

run()
  .then(() => { process.exit(); })
  .catch(error => { throw error; });
