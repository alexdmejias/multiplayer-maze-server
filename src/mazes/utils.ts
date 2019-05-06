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
