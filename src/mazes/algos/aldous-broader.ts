import { IGrid, ICell, GridConnections } from '../../_interfaces';
import { getRandomKey } from '../utils';
import _random from 'lodash.random';
import _sample from 'lodash.sample';

// 1. Work through the grid row-wise, starting with the cell at NW. Initialize the “run” set to be empty.
// 2. Add the current cell to the “run” set.
// 3. For the current cell, randomly decide whether to carve east or not.
// 4. If a passage was carved, make the new cell the current cell and repeat steps 2-4.
// 5. If a passage was not carved, choose any one of the cells in the run set and carve a passage north. Then empty the
// run set, set the next cell in the row to be the current cell, and repeat steps 2-5.
// 6. Continue until all rows have been processed.

export default (grid: IGrid): GridConnections => {
  let cell = getRandomKey(grid.grid2);
  let unvisited = Object.keys(grid.grid2).length - 1;

  while (unvisited > 0) {
    const randomNeighbor = getRandomKey(cell.neighbors)
    const neighbor = grid.grid2[randomNeighbor];
    console.log('alexalex - ++++++++++', cell);
    if (!neighbor.hasLinks()) {
      const dir = grid.linkCellsById(cell.id, neighbor.id);
      unvisited--;
    }

    cell = neighbor;
  }


  return grid.makeMatrixFromDictConnections();
};
