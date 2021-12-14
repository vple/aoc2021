import * as fs from 'fs/promises';

const parse = (lines: string[]) => {
  const connections: Record<string, string[]> = {};

  lines.forEach(line => {
    const [first, second] = line.split('-');

    if (!(first in connections)) {
      connections[first] = [];
    }
    connections[first].push(second);

    if (!(second in connections)) {
      connections[second] = [];
    }
    connections[second].push(first);
  });

  return connections;
}

const searchUniquePaths = (connections: Record<string, string[]>) => {
  let total = 0;

  const livePaths = [['start']];
  while (livePaths.length > 0) {
    const path = livePaths.pop()!;
    const adjacent = connections[path[path.length - 1]];
    const visited = new Set(path);
    adjacent.forEach(cave => {
      // Skip visited small caves.
      if (cave === cave.toLowerCase()) {
        if (visited.has(cave)) {
          return;
        }
      }

      // Complete path.
      if (cave === 'end') {
        total++;
        return;
      }

      // Otherwise, add to DFS.
      livePaths.push([...path, cave]);
    })
  }
  return total;
}

const searchUniquePaths2 = (connections: Record<string, string[]>) => {
  let total = 0;

  const livePaths = [['start']];
  while (livePaths.length > 0) {
    const path = livePaths.pop()!;

    const smallCaves = path.filter(c => c === c.toLowerCase());
    const hasVisitedCaveTwice = smallCaves.length !== new Set(smallCaves).size;

    const lastCave = path[path.length - 1];
    const adjacent = connections[lastCave];

    const visited = new Set(path);
    adjacent.forEach(cave => {
      const isSmallCave = cave === cave.toLowerCase();
      // Skip visited small caves.
      if (isSmallCave) {
        if (cave === 'start') {
          return;
        }
        if (visited.has(cave) && hasVisitedCaveTwice) {
          return;
        }
      }

      // Complete path.
      if (cave === 'end') {
        total++;
        return;
      }

      // Otherwise, add to DFS.
      livePaths.push([...path, cave]);
    })
  }
  return total;
}

const part1 = (input: string) => {
  const lines = input.trim().split('\n');

  const connections = parse(lines);
  return searchUniquePaths(connections);
};

const part2 = (input: string) => {
  const lines = input.trim().split('\n');

  const connections = parse(lines);
  return searchUniquePaths2(connections);
};

const run = async () => {
  const input = await fs.readFile('input.txt', 'utf-8');

  console.log(`Part 1: ${part1(input)}`);
  console.log(`Part 2: ${part2(input)}`);
}

run()
  .then(() => { process.exit(); })
  .catch(error => { throw error; });
