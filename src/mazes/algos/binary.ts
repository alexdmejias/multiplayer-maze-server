import { Direction, CellId } from './../../_interfaces';
import { IGrid, ICell, GridConnections } from '../../_interfaces';

// 1 no link no neighbor
// 2 link to north no neighbor to east
// 3 link to east no neighbor to north
// 5 link to north neighbor to east
// 6 link to east neighbor north


export default (grid: IGrid): GridConnections => {
  const gridConnections: GridConnections = [];
  grid.makeMatrixFromDict().forEach((row) => {
    const rowConnections: number[] = [];

    row.forEach((cell) => {
      let neighborsId = .5;
      let neighbors: { direction: Direction, cell: CellId }[] = [];

      if (cell.neighbors.north) {
        neighbors.push({ direction: 'north', cell: cell.neighbors.north });
        neighborsId *= 2;
      }

      if (cell.neighbors.east) {
        neighbors.push({ direction: 'east', cell: cell.neighbors.east });
        neighborsId *= 4;
      }

      if (neighborsId < 1) {
        neighborsId = 0;
      }

      let index = Math.floor(Math.random() * neighbors.length);
      let neighbor = neighbors[index];

      if (neighbor) {
        // cell.setLink(neighbor.cell, neighbor.direction);
        grid.linkCells(cell.id, neighbor.direction)
      }

      cell.neighborsId = neighborsId + (index + 1);
      rowConnections.push(cell.neighborsId);
    });
    gridConnections.push(rowConnections);
  });

  return gridConnections;
};
