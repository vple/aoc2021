import * as fs from 'fs/promises';
import _ from 'lodash';

type Packet = {
  version: number;
  type: number;
  length: number;
}

type LiteralPacket = {
  literal: number;
} & Packet;

type OperatorPacket = {
  lengthType: number;
  subpackets: Packet[];
} & Packet;

const toBinary = (message: string) => {
  return message.split('').map(n => parseInt(n, 16).toString(2).padStart(4, '0')).join('');
}

// Parses the next top-level packet.
const parsePacket = (binary: string): Packet => {
  let length = 0;

  // Read N digits, mutating & shifting binary.
  // Also updates length for convenience.
  const readN = (n: number): number => {
    const number = parseInt(binary.substring(0, n), 2);
    binary = binary.substring(n);
    length += n;
    return number;
  }

  const binaryReadN = (n: number): string => {
    const number = binary.substring(0, n);
    binary = binary.substring(n);
    length += n;
    return number;
  }

  const version = readN(3);
  const type = readN(3);

  if (type === 4) {
    // Literal
    let literalString = '';
    while (true) {
      const group = binaryReadN(5);
      literalString += group.substring(1);
      if (group[0] === '0') {
        break;
      }
    }
    const literal = parseInt(literalString, 2);
    return {
      version,
      type,
      length,
      literal,
    } as LiteralPacket;
  } else {
    // Operator
    const lengthType = readN(1);

    // console.log(version, type, lengthType);

    if (lengthType === 0) {
      const subpacketTargetBitLength = readN(15);
      const subpackets: Packet[] = [];
      let subpacketBitLength = 0;

      while (subpacketBitLength < subpacketTargetBitLength) {
        const packet = parsePacket(binary);
        subpackets.push(packet);
        subpacketBitLength += packet.length;
        binary = binary.substring(packet.length);
      }

      return {
        version,
        type,
        length: length + subpacketTargetBitLength,
        lengthType,
        subpackets,
      } as OperatorPacket;
    } else {
      const targetSubpackets = readN(11);
      const subpackets: Packet[] = [];

      for (let i = 0; i < targetSubpackets; i++) {
        const packet = parsePacket(binary);
        subpackets.push(packet);
        binary = binary.substring(packet.length);
      }

      const subpacketLength = _.sum(subpackets.map(sp => sp.length));

      return {
        version,
        type,
        length: length + subpacketLength,
        lengthType,
        subpackets,
      } as OperatorPacket;
    }
  }
}

const sumVersions = (packet: Packet): number => {
  if ('literal' in packet) {
    return packet.version;
  }
  if ('subpackets' in packet) {
    const subpackets = (packet as OperatorPacket).subpackets;
    return packet.version + _.sum(subpackets.map(subpacket => sumVersions(subpacket)));
  }
  throw Error();
}

const evaluatePacket = (packet: Packet): number => {
  if ('literal' in packet) {
    const literal = packet as LiteralPacket;
    return literal.literal;
  }
  if ('subpackets' in packet) {
    const operator = packet as OperatorPacket;
    const subpacketValues = operator.subpackets.map(evaluatePacket);
    switch (operator.type) {
      case 0:
        return _.sum(subpacketValues);
      case 1:
        return subpacketValues.reduce((a, b) => a * b, 1);
      case 2:
        return _.min(subpacketValues) || 0;
      case 3:
        return _.max(subpacketValues) || 0;
      case 5:
        return Number(subpacketValues[0] > subpacketValues[1]);
      case 6:
        return Number(subpacketValues[0] < subpacketValues[1]);
      case 7:
        return Number(subpacketValues[0] === subpacketValues[1]);
      default:
        throw Error();
    }

    const subpackets = (packet as OperatorPacket).subpackets;
    return packet.version + _.sum(subpackets.map(subpacket => sumVersions(subpacket)));
  }
  throw Error();
}

const part1 = (input: string) => {
  const message = input.trim();
  const binary = toBinary(message);
  const packet = parsePacket(binary);

  return sumVersions(packet);
};

const part2 = (input: string) => {
  const message = input.trim();
  const binary = toBinary(message);
  const packet = parsePacket(binary);

  return evaluatePacket(packet);
};

const run = async () => {
  const input = await fs.readFile('input.txt', 'utf-8');

  console.log(`Part 1: ${part1(input)}`);
  console.log(`Part 2: ${part2(input)}`);
}

run()
  .then(() => { process.exit(); })
  .catch(error => { throw error; });
