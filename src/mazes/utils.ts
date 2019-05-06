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
  let directionArr;
  if (direction === 'north') { directionArr = [row - 1, column]; }
  else if (direction === 'east') { directionArr = [row, column + 1]; }
  else if (direction === 'south') { directionArr = [row + 1, column]; }
  else { directionArr = [row, column - 1]; }

  // return makeId(directionArr);
  return directionArr;
}

// getNeighborFromDirection(baseCellId: CellId, direction: Direction): CellId {
//   const parsedId: [number, number] = parsedIdFromStr(baseCellId);
//   // const oppositeDirection = getOppositeDirection(direction);
//   const neighborPostion = getNeighborPosition(direction, parsedId[0], parsedId[1]);

//   return makeIdFromArr(neighborPostion);
// }

// export function neighborExists(direction: Direction, grid: Maze, row: number, column: number): number {
//   const [newRow, newColumn] = getNeighborPosition(direction, row, column);

//   if (grid[newRow] && grid[newRow][newColumn]) {
//     return grid[newRow][newColumn];
//   } else {
//     return -1;
//   }