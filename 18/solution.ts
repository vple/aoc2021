import * as fs from 'fs/promises';
import _ from 'lodash';

type Snailfish = {
  left: Snailfish | number;
  right: Snailfish | number;
  parent: Snailfish | undefined;
  isLeft: boolean | undefined;
}

const parseSnailfish = (line: string): Snailfish => {
  const stack: (Snailfish | number)[] = [];
  while (line.length > 0) {
    const char = line[0];
    line = line.substring(1);

    switch (char) {
      case '[':
      case ',':
        break;
      case ']':
        const right = stack.pop()!;
        const left = stack.pop()!;
        const snailfish: Snailfish = {
          left,
          right,
          parent: undefined,
          isLeft: undefined,
        };
        if (typeof right !== 'number') {
          (right as Snailfish).parent = snailfish;
          (right as Snailfish).isLeft = false;
        }
        if (typeof left !== 'number') {
          (left as Snailfish).parent = snailfish;
          (left as Snailfish).isLeft = true;
        }
        stack.push(snailfish);
        break;
      default:
        // Numbers are single digits.
        if (isNaN(+char)) {
          throw Error();
        }
        stack.push(+char);
        break;
    }
  }
  return stack[0] as Snailfish;
}

const add = (x: Snailfish, y: Snailfish): Snailfish => {
  const sum: Snailfish = {
    left: x,
    right: y,
    parent: undefined,
    isLeft: undefined,
  }
  x.parent = sum;
  x.isLeft = true;
  y.parent = sum;
  y.isLeft = false;

  reduce(sum);
  return sum;
}

const string = (number: Snailfish | number): string => {
  if (typeof number === 'number') {
    return number.toString();
  } else {
    const snailfish = number as Snailfish;
    return `[${string(snailfish.left)},${string(snailfish.right)}]`;
  }
}

const reduce = (snailfish: Snailfish) => {
  while (reduceStep(snailfish)) {
    // console.log('step', string(snailfish));
  }
}

const reduceStep = (element: Snailfish, depth: number = 0): boolean => {
  // Do explosions before splits.
  if (depth === 0 && reduceExplode(element, depth)) {
    return true;
  }

  if (typeof element.left === 'number' && element.left >= 10) {
    const left = element.left as number;
    const splitLeft = Math.floor(left/2);
    const splitRight = Math.ceil(left/2);
    const split: Snailfish = {
      left: splitLeft,
      right: splitRight,
      parent: element,
      isLeft: true,
    };
    element.left = split;
    return true;
  }

  if (typeof element.left !== 'number') {
    const snailfish = element.left as Snailfish;
    const reduce = reduceStep(snailfish, depth+1);
    if (reduce) {
      return true;
    }
  }

  if (typeof element.right !== 'number') {
    const snailfish = element.right as Snailfish;
    const reduce = reduceStep(snailfish, depth+1);
    if (reduce) {
      return true;
    }
  }

  if (typeof element.right === 'number' && element.right >= 10) {
    const right = element.right as number;
    const splitLeft = Math.floor(right/2);
    const splitRight = Math.ceil(right/2);
    const split: Snailfish = {
      left: splitLeft,
      right: splitRight,
      parent: element,
      isLeft: false,
    };
    element.right = split;
    return true;
  }

  return false;
}

const reduceExplode = (element: Snailfish, depth: number = 0): boolean => {
  // Traversal is always left to right, so this is the left-most.
  if (depth === 4) {
    explode(element);
    return true;
  }

  if (typeof element.left !== 'number') {
    const reduce = reduceExplode(element.left as Snailfish, depth+1);
    if (reduce) {
      return true;
    }
  }

  if (typeof element.right !== 'number') {
    const reduce = reduceExplode(element.right as Snailfish, depth+1);
    if (reduce) {
      return true;
    }
  }

  return false;
}

const explode = (element: Snailfish) => {
  // Find first left number.
  // Find closest node that is a right.
  let node: Snailfish | number | undefined = element;
  while (node) {
    // Could be undefined.
    if (node.isLeft === false) {
      break;
    }
    node = node.parent;
  }
  // We are now either at a node that is a right or an undefined node.
  // If node is undefined, we were already on the left-most side and have nothing to do.
  if (node) {
    // Now traverse down the left side.
    let parent = node.parent!;
    node = parent.left;
    let immediateLeft = true;
    while (typeof node !== 'number') {
      parent = node;
      node = parent.right;
      immediateLeft = false;
    }
    if (immediateLeft) {
      const newLeft = (parent.left as number) + (element.left as number);
      parent.left = newLeft;
    } else {
      const newRight = (parent.right as number) + (element.left as number);
      parent.right = newRight;
    }
  }

  // Do the same for the right side.
  node = element;
  while (node) {
    if (node.isLeft) {
      break;
    }
    node = node.parent;
  }
  // We are now either at a node that is a left or an undefined node.
  // If node is undefined, we were already on the left-most side and have nothing to do.
  if (node) {
    // Now traverse down the right side.
    let parent = node.parent!;
    node = parent.right;
    let immediateRight = true;
    while (typeof node !== 'number') {
      parent = node;
      node = parent.left;
      immediateRight = false;
    }

    if (immediateRight) {
      const newRight = (parent.right as number) + (element.right as number);
      parent.right = newRight;
    } else {
      const newLeft = (parent.left as number) + (element.right as number);
      parent.left = newLeft;
    }
  }

  // Types guaranteed due to depth 4.
  const parent: Snailfish = element.parent! as Snailfish;
  if (element.isLeft) {
    parent.left = 0;
  } else {
    parent.right = 0;
  }
}

const magnitude = (number: Snailfish | number): number => {
  if (typeof number === 'number') {
    return number as number;
  }
  const snailfish = number as Snailfish;
  return 3 * magnitude(snailfish.left) + 2 * magnitude(snailfish.right);
}

const part1 = (input: string) => {
  const lines = input.trim().split('\n');
  const snailfish = lines.map(parseSnailfish);

  const sum = snailfish.reduce((a, b) => add(a, b));

  return magnitude(sum);
};

const part2 = (input: string) => {
  const lines = input.trim().split('\n');
  let snailfish = lines.map(parseSnailfish);

  let largestMagnitude = 0;
  for (let i = 0; i < snailfish.length; i++) {
    for (let j = 0; j < snailfish.length; j++) {
      if (i === j) continue;
      // Adding mutates stuff, simplest way to get around it is to regenerate base input.
      snailfish = lines.map(parseSnailfish);
      const sum = add(snailfish[i], snailfish[j]);
      const m = magnitude(sum);
      if (m > largestMagnitude) {
        largestMagnitude = m;
      }
    }
  }

  return largestMagnitude;
};

const run = async () => {
  const input = await fs.readFile('input.txt', 'utf-8');

  console.log(`Part 1: ${part1(input)}`);
  console.log(`Part 2: ${part2(input)}`);
}

run()
  .then(() => { process.exit(); })
  .catch(error => { throw error; });
