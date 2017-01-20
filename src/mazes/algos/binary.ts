import {IGrid, ICell} from '../../_interfaces';

export default (grid: IGrid, size: number) => {
  grid.grid.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      let neighbors = [];

      if (cell.neighbors.north) {
        neighbors.push(cell.neighbors.north);
      }

      if (cell.neighbors.east) {
        neighbors.push(cell.neighbors.east);
      }

      let index = Math.floor(Math.random() * neighbors.length);
      let neighbor = neighbors[index];

      if (neighbor) {
        cell.setLink(neighbor);
      }

      cell.position = {
        top: (cell.row * size),
        left: (cell.column * size)
      };
    });
  });

  return grid;
};

export function binaryToStr (preparedGrid: IGrid): string {
  let output = `+${('---+').repeat(preparedGrid.columns)}\n`;
  preparedGrid.grid.forEach((row: ICell[]) => {
    let top = '|';
    let bottom = '+';
    row.forEach((cell: ICell) => {
      // if (!cell) {
      //   let cell = new Cell(-1, -1);
      // }

      let body = '   ';
      let eastBoundry = (cell.isLinked(cell.neighbors.east) ? ' ' : '|');
      top += body + eastBoundry;

      let southBoundry = (cell.isLinked(cell.neighbors.south) ? '   ' : '---');
      let corner  = '+';
      bottom += southBoundry + corner;
    });
    output += top + '\n';
    output += bottom + '\n';

  });
  return output;
}
