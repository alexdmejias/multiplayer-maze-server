import { IGrid, ICell, GridConnections } from '../../_interfaces';
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
  grid.makeMatrixFromDict().forEach(row => {
    let run: ICell[] = [];

    row.forEach(cell => {
      run.push(cell);

      const atEasternBoundry = !cell.neighbors.east;
      const atNorthernBoundry = !cell.neighbors.north;
      const shouldCloseOut = atEasternBoundry || (!atNorthernBoundry && _random() === 0);

      if (shouldCloseOut) {
        const member = _sample(run);
        if (member.neighbors.north) {
          grid.linkCells(member.id, 'north');
        }
        run = [];
      } else {
        grid.linkCells(cell.id, 'east');
      }
    });
  });

  return grid.makeMatrixFromDictConnections();
};
