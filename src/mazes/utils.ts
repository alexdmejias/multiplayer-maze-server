import _sample from 'lodash.sample';
import { CellId, Direction } from "../_interfaces";

export function makeIdFromArr(rowColumn: [number, number]): CellId {
  return `${rowColumn[0]}-${rowColumn[1]}`;
}

export function parsedIdFromStr(cellId: CellId): any {
  return cellId
    .split('-')
    .map((curr: string) => parseInt(curr, 10));
}

export function getOppositeDirection(direction: Direction): Direction {
  switch (direction) {
    case 'north':
      return 'south';
    case 'south':
      return 'north';
    case 'east':
      return 'west';
    default:
      return 'east';
  }
}

export function getNeighborPosition(direction: Direction, row: number, column: number): [number, number] {
  if (direction === 'north') { return [row - 1, column]; }
  else if (direction === 'east') { return [row, column + 1]; }
  else if (direction === 'south') { return [row + 1, column]; }
  else { return [row, column - 1]; }
}

export function getNeighborDirection(baseCell: CellId, endCell: CellId): Direction {
  const parsedBaseCell = parsedIdFromStr(baseCell);
  const parsedEndCell = parsedIdFromStr(endCell);

  if (((parsedBaseCell[0] - 1) === parsedEndCell[0]) && parsedBaseCell[1] === parsedEndCell[1]) {
    return 'north';
  } else if (((parsedBaseCell[0] + 1) === parsedEndCell[0]) && parsedBaseCell[1] === parsedEndCell[1]) {
    return 'south';
  } else if ((parsedBaseCell[0] === parsedEndCell[0]) && ((parsedBaseCell[1] - 1) === parsedEndCell[1])) {
    return 'west';
  } else {
    return 'east';
  };
}

export function getRandomKey<T>(dictionary: { [k in string]: T }): T {
  return dictionary[_sample(Object.keys(dictionary))];
}
