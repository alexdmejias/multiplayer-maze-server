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
      let neighbors = [];

      if (cell.neighbors.north) {
        neighbors.push(cell.neighbors.north);
        neighborsId *= 2;
      }

      if (cell.neighbors.east) {
        neighbors.push(cell.neighbors.east);
        neighborsId *= 4;
      }

      if (neighborsId < 1) {
        neighborsId = 0;
      }

      let index = Math.floor(Math.random() * neighbors.length);
      let neighbor = neighbors[index];

      if (neighbor) {
        const neighborCell = grid.grid2[neighbor];
        cell.setLink(neighborCell);
      }

      cell.neighborsId = neighborsId + (index + 1);
      rowConnections.push(cell.neighborsId);
    });
    gridConnections.push(rowConnections);
  });

  return gridConnections;
};
