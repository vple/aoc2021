import * as fs from 'fs/promises';

const open = new Set(['(', '[', '{', '<' ]);
const close = new Set([')', ']', '}', '>']);
const forward: Record<string, string> = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>',
};
const backward: Record<string, string> = {
  ')': '(',
  ']': '[',
  '}': '{',
  '>': '<',
};

const findCorrupted = (line: string) => {
  const stack = [];
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (open.has(char)) {
      stack.push(char);
      continue;
    }
    const opener = stack.pop();
    if (backward[char] !== opener) {
      return char;
    }
  }
  return undefined;
}

const findIncomplete = (line: string) => {
  const stack = [];
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (open.has(char)) {
      stack.push(char);
      continue;
    }
    const opener = stack.pop();
    if (backward[char] !== opener) {
      return undefined;
    }
  }
  return stack;
}

const completeLine = (stack: string[]) => {
  stack.reverse();
  return stack.map(char => forward[char]);
}

const scoreCompletion = (completion: string[]) => {
  const scores = completion.map(char => {
    switch (char) {
      case ')': return 1;
      case ']': return 2;
      case '}': return 3;
      case '>': return 4;
      default: throw new Error();
    }
  });
  return scores.reduce((a, c) => 5 * a + c, 0);
}

const part1 = (input: string) => {
  const lines = input.trim().split('\n');
  const corrupted = lines.map(line => findCorrupted(line)).filter(char => char !== undefined);

  return corrupted.map(char => {
    switch (char) {
      case ')': return 3;
      case ']': return 57;
      case '}': return 1197;
      case '>': return 25137;
      default: return 0;
    }
  }).reduce((a: number, c) => a + c, 0);
};

const part2 = (input: string) => {
  const lines = input.trim().split('\n');
  const incomplete = lines.map(findIncomplete).filter(result => result !== undefined) as string[][];
  const completions = incomplete.map(completeLine);
  const scores = completions.map(scoreCompletion);
  scores.sort((a, b) => a - b);
  return scores[(scores.length - 1)/2];
};

const run = async () => {
  const input = await fs.readFile('input.txt', 'utf-8');

  console.log(`Part 1: ${part1(input)}`);
  console.log(`Part 2: ${part2(input)}`);
}

run()
  .then(() => { process.exit(); })
  .catch(error => { throw error; });
