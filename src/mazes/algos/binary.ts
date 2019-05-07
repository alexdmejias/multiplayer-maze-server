import { Direction, CellId } from './../../_interfaces';
import { IGrid, GridConnections } from '../../_interfaces';

export default (grid: IGrid): GridConnections => {
  grid.makeMatrixFromDict().forEach((row) => {

    row.forEach((cell) => {
      let neighbors: Direction[] = [];

      if (cell.neighbors.north) {
        neighbors.push('north');
      }

      if (cell.neighbors.east) {
        neighbors.push('east');
      }

      let index = Math.floor(Math.random() * neighbors.length);
      let neighbor = neighbors[index];

      if (neighbor) {
        grid.linkCells(cell.id, neighbor);
      }
    });
  });

  return grid.makeMatrixFromDictConnections();
};
