import * as fs from 'fs/promises';

const encodings: Record<number, string> = {
  0: 'ABCEFG',
  1: 'CF',
  2: 'ACDEG',
  3: 'ACDFG',
  4: 'BCDF',
  5: 'ABDFG',
  6: 'ABDEFG',
  7: 'ACF',
  8: 'ABCDEFG',
  9: 'ABCDFG',
};
const countToDisplays: Record<number, number[]> = (() => {
  const result = {} as Record<number, number[]>;
  for (let digit = 0; digit < 10; digit++) {
    const count = encodings[digit].length;
    if (!(count in result)) {
      result[count] = [];
    }
    result[count].push(digit);
  };
  return result;
})();

const countDistribution = ((symbols: string[]) => {
  return symbols
    .flatMap(str => str.split(''))
    .reduce((a, char) => {
      if (!(char in a)) {
        a[char] = 0;
      }
      a[char]++;
      return a;
    }, {} as Record<string, number>);
})

// Number of times each segment is used to display all 10 digits.
// { A: 8, B: 6, C: 8, E: 4, F: 9, G: 7, D: 7 }
const BASE_DISTRIBUTION: Record<string, number> =
  countDistribution(Object.values(encodings));

const uniquelySegmentedDigits = [1, 4, 7, 8];

type Entry = {
  inputs: string[];
  outputs: string[];
}

const parseLine = (line: string): Entry => {
  const [input, output] = line.trim().split(' | ');
  return {
    inputs: input.split(' '),
    outputs: output.split(' '),
  }
}

// The segment distribution is:
// { A: 8, B: 6, C: 8, E: 4, F: 9, G: 7, D: 7 }
// These are all unique except [A, C] and [D, G].
// C is identified by being used to display a 1 (two segments).
// D is identified by being used to display a 4 (four segments).
const decodeEntry = (entry: Entry): Record<string, string> => {
  const one = entry.inputs.filter(input => input.length === encodings[1].length)[0];
  const four = entry.inputs.filter(input => input.length === encodings[4].length)[0];

  const mapping: Record<string, string> = {};
  const inputDistribution = countDistribution(entry.inputs);
  Object.entries(inputDistribution).forEach(([signal, count]) => {
    // Too lazy to do this with code.
    switch (count) {
      case 4:
        mapping[signal] = 'E';
        break;
      case 6:
        mapping[signal] = 'B';
        break;
      case 7: {
        const segment = four.indexOf(signal) >= 0 ? 'D' : 'G';
        mapping[signal] = segment;
        break;
      }
      case 8: {
        const segment = one.indexOf(signal) >= 0 ? 'C' : 'A';
        mapping[signal] = segment;
        break;
      }
      case 9:
        mapping[signal] = 'F';
        break;
    }
  });

  return mapping;
}

const decodeNumber = (segments: string, mapping: Record<string, string>) => {
  const decodedSegments = segments.split('').map(s => mapping[s]);
  decodedSegments.sort();
  const normalizedEncoding = decodedSegments.join('');
  // Take advantage that we defined them in order.
  return Object.values(encodings).indexOf(normalizedEncoding);
}

const part1 = (input: string) => {
  const lines = input.trim().split('\n');
  const entries = lines.map(parseLine);

  const uniqueSegmentCounts = uniquelySegmentedDigits.map(digit => encodings[digit].length);
  const uniqueOutputs =
    entries
      .flatMap(entry => entry.outputs)
      .filter(output => {
        return uniqueSegmentCounts.indexOf(output.length) >= 0;
      });

  return uniqueOutputs.length;
};

const part2 = (input: string) => {
  const lines = input.trim().split('\n');
  const entries = lines.map(parseLine);

  return entries
    .map(entry => {
      const mapping = decodeEntry(entry);
      const digits = entry.outputs.map(o => decodeNumber(o, mapping));
      const number = Number(digits.join(''));
      return number;
    })
    .reduce((sum, number) => sum + number, 0);
};

const run = async () => {
  const input = await fs.readFile('input.txt', 'utf-8');

  console.log(`Part 1: ${part1(input)}`);
  console.log(`Part 2: ${part2(input)}`);
}

run()
  .then(() => { process.exit(); })
  .catch(error => { throw error; });
