import * as fs from 'fs/promises';

class Board {
  private board: number[][];
  private marked: boolean[][] = [...Array(5)].map(e => Array(5).fill(false));
  private numberIndices: Record<number, [number, number]> = {};

  constructor(lines: string[]) {
    this.board = lines.map(line => line.trim().split(/\s+/).map(number => parseInt(number)));

    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        this.numberIndices[this.board[row][col]] = [row, col];
      }
    }
  }

  draw(value: number) {
    if (!(value in this.numberIndices)) {
      return;
    }

    const index = this.numberIndices[value];
    this.marked[index[0]][index[1]] = true;
  }

  isWinner() {
    for (let i = 0; i < 5; i++) {
      let rowWin = true;
      let colWin = true;
      for (let j = 0; j < 5; j++) {
        rowWin = rowWin && this.marked[i][j];
        colWin = colWin && this.marked[j][i];
      }
      if (rowWin || colWin) {
        return true;
      }
    }
    return false;
  }

  sumUnmarked() {
    let sum = 0;

    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        if (!this.marked[row][col]) {
          sum += this.board[row][col];
        }
      }
    }

    return sum;
  }
}

const part1 = (input: string) => {
  const lines = input.trim().split("\n");

  const numbers = lines[0].split(",").map(number => parseInt(number));

  const boards: Board[] = [];

  let index = 2;
  while (index < lines.length) {
    const board = lines.slice(index, index+5);
    boards.push(new Board(board));
    index += 6;
  }

  for (let call of numbers) {
    for (let board of boards) {
      board.draw(call);
      if (board.isWinner()) {
        return board.sumUnmarked() * call;
      }
    }
  }

  return 0;
};

const part2 = (input: string) => {
  const lines = input.trim().split("\n");

  const numbers = lines[0].split(",").map(number => parseInt(number));

  let boards: Board[] = [];

  let index = 2;
  while (index < lines.length) {
    const board = lines.slice(index, index+5);
    boards.push(new Board(board));
    index += 6;
  }

  let callIndex = 0;
  while (boards.length > 1) {
    let call = numbers[callIndex];
    boards.forEach(board => board.draw(call));
    boards = boards.filter(board => !board.isWinner());

    callIndex++;
  }

  // Winner may not have won yet.
  const winner = boards[0];
  while (!winner.isWinner()) {
    let call = numbers[callIndex];
    winner.draw(call);
    callIndex++;
  }

  return winner.sumUnmarked() * numbers[callIndex-1];
};

const run = async () => {
  const input = await fs.readFile('input.txt', 'utf-8');

  console.log(`Part 1: ${part1(input)}`);
  console.log(`Part 2: ${part2(input)}`);
}

run()
  .then(() => { process.exit(); })
  .catch(error => { throw error; });
