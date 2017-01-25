import {IGrid, ICell} from '../../_interfaces';

export default (grid: IGrid): number[][] => {
  const gridConnections = [];
  grid.grid.forEach((row) => {
    const rowConnections = [];
    row.forEach((cell) => {
      let neighbors = [];
      let neighborsId = .5;

      if (cell.neighbors.north) {
        neighbors.push(cell.neighbors.north);
        neighborsId *= 2;
      }

      if (cell.neighbors.east) {
        neighbors.push(cell.neighbors.east);
        neighborsId *= 4;
      }

      // 1 no link no neighbor
      // 2 link to north
      // 3 link to east
      // 5 link to north neighbor to east
      // 6 link to east neighbor north

      if (neighborsId < 1) {
        neighborsId = 0;
      }

      let index = Math.floor(Math.random() * neighbors.length);
      let neighbor = neighbors[index];

      if (neighbor) {
        cell.setLink(neighbor);
      }

      cell.neighborsId = neighborsId + (index + 1);
      rowConnections.push(cell.neighborsId);
    });
    gridConnections.push(rowConnections);
  });

  return gridConnections;
};
