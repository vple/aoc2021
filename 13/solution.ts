import * as fs from 'fs/promises';
import _ from 'lodash';

type Instruction = {
  axis: 'x' | 'y';
  value: number;
}

const parseInstruction = (line: string): Instruction => {
  const match = line.match(/.*([xy])=(\d+)/);
  if (!match) throw Error();
  return {
    axis: match[1] as 'x' | 'y',
    value: Number(match[2]),
  }
}

const fold = (coordinate: [number, number], instruction: Instruction): [number, number] => {
  if (instruction.axis === 'y') {
    const y = coordinate[1] > instruction.value ? 2 * instruction.value - coordinate[1] : coordinate[1];
    return [coordinate[0], y];
  } else {
    const x = coordinate[0] > instruction.value ? 2 * instruction.value - coordinate[0] : coordinate[0];
    return [x, coordinate[1]];
  }
}

const print = (coordinates: [number, number][]) => {
  const maxX = _.maxBy(coordinates, a => a[0])![0] + 1;
  const maxY = _.maxBy(coordinates, a => a[1])![1] + 1;

  const chars = Array(maxY).fill([]).map(x => Array(maxX).fill('.'));
  for (const c of coordinates) {
    chars[c[1]][c[0]] = '#';
  }

  for (const line of chars) {
    console.log(line.join(''));
  }
}

const part1 = (input: string) => {
  let [dotLines, instructionLines] = input.trim().split('\n\n');
  let coordinates: [number, number][] =
    dotLines.trim().split('\n')
      .map(dot => {
        const pair = dot.split(',');
        return [Number(pair[0]), Number(pair[1])];
      });
  const instructions = instructionLines.trim().split('\n').map(parseInstruction);

  coordinates = coordinates.map(coordinate => fold(coordinate, instructions[0]));
  coordinates = _.uniqWith(coordinates, _.isEqual);

  return coordinates.length;
};

const part2 = (input: string) => {
  let [dotLines, instructionLines] = input.trim().split('\n\n');
  let coordinates: [number, number][] =
    dotLines.trim().split('\n')
      .map(dot => {
        const pair = dot.split(',');
        return [Number(pair[0]), Number(pair[1])];
      });
  const instructions = instructionLines.trim().split('\n').map(parseInstruction);

  for (const instruction of instructions) {
    coordinates = coordinates.map(coordinate => fold(coordinate, instruction));
    coordinates = _.uniqWith(coordinates, _.isEqual);
  }

  print(coordinates);

  return 0;
};

const run = async () => {
  const input = await fs.readFile('input.txt', 'utf-8');

  console.log(`Part 1: ${part1(input)}`);
  console.log(`Part 2: ${part2(input)}`);
}

run()
  .then(() => { process.exit(); })
  .catch(error => { throw error; });
