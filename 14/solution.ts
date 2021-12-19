import * as fs from 'fs/promises';
import _ from 'lodash';

type PairPolymer = {
  last: string;
  pairs: Record<string, number>;
}

const parseRules = (lines: string[]) => {
  const rules: Record<string, string> = {};
  lines.map(line => {
    const match = line.match(/(\w\w) -> (\w)/)!;
    rules[match[1]] = match[2];
  })
  return rules;
}

const step = (polymer: string, rules: Record<string, string>): string => {
  let result = '';
  for (let i = 0; i < polymer.length-1; i++) {
    const pair = polymer.substring(i, i+2);
    result += polymer[i];
    const insert = rules[pair];
    if (insert) {
      result += insert;
    }
  }
  result += polymer[polymer.length-1];

  return result;
}

const toPairPolymer = (polymer: string): PairPolymer => {
  const last = polymer[polymer.length-1];
  const pairs: Record<string, number> = {};

  for (let i = 0; i < polymer.length-1; i++) {
    const pair = polymer.substring(i, i+2);
    if (!pairs[pair]) {
      pairs[pair] = 0;
    }
    pairs[pair]++;
  }

  return {
    last,
    pairs
  }
}

const pairStep = (polymer: PairPolymer, rules: Record<string, string>): PairPolymer => {
  const newPairs: Record<string, number> = {};
  for (const [pair, count] of Object.entries(polymer.pairs)) {
    const insert = rules[pair];
    if (insert) {
      // Add two new pairs.
      const pair1 = `${pair[0]}${insert}`;
      if (!newPairs[pair1]) {
        newPairs[pair1] = 0;
      }
      newPairs[pair1] += count;

      const pair2 = `${insert}${pair[1]}`;
      if (!newPairs[pair2]) {
        newPairs[pair2] = 0;
      }
      newPairs[pair2] += count;
    } else {
      // No change to pair, add all counts.
      if (!newPairs[pair]) {
        newPairs[pair] = 0;
      }
      newPairs[pair] += count;
    }
  }

  return {
    last: polymer.last,
    pairs: newPairs
  };
}

const countElements = (polymer: PairPolymer): Record<string, number> => {
  const counts = _.reduce(polymer.pairs, (result, value, key) => {
    const element = key[0];
    if (!result[element]) {
      result[element] = 0;
    }
    result[element] += value;
    return result;
  }, {} as Record<string, number>);

  if (!counts[polymer.last]) {
    counts[polymer.last] = 0;
  }
  counts[polymer.last]++;

  return counts;
}

const part1 = (input: string) => {
  const lines = input.trim().split('\n');

  const template = lines[0].trim();
  const rules = parseRules(lines.slice(2));

  let polymer = template;
  for (let i = 0; i < 10; i++) {
    polymer = step(polymer, rules);
  }

  const counts = _.countBy(polymer);
  const countValues = Object.values(counts);

  return _.max(countValues)! - _.min(countValues)!;
};

const part2 = (input: string) => {
  const lines = input.trim().split('\n');

  const template = lines[0].trim();
  const rules = parseRules(lines.slice(2));

  let polymer = toPairPolymer(template);
  for (let i = 0; i < 40; i++) {
    polymer = pairStep(polymer, rules);
  }

  const counts = countElements(polymer);
  const countValues = Object.values(counts);

  return _.max(countValues)! - _.min(countValues)!;
};

const run = async () => {
  const input = await fs.readFile('input.txt', 'utf-8');

  console.log(`Part 1: ${part1(input)}`);
  console.log(`Part 2: ${part2(input)}`);
}

run()
  .then(() => { process.exit(); })
  .catch(error => { throw error; });
