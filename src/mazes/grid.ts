import Cell from './cell';
import Distance from './distance';
import {IGrid, ICell} from '../_interfaces';

class Grid implements IGrid {
  rows: number;
  columns: number;
  grid: ICell[][];

  constructor (rows: number, columns: number, algorithm?: Function) {
    this.rows = rows;
    this.columns = columns;

    // this.grid = this.createMatrix();
    this.configureCells(algorithm);
  }

  createMatrix (): Cell[][] {
    const grid: Cell[][] = [];
    for (var i = 0; i < this.rows; i++) {
      grid.push([]);
      for (var h = 0; h < this.columns; h++) {
        grid[i].push(new Cell(i, h));
      }
    }

    return grid;
  }

  configureCells (algorithm?: Function): void {
    this.grid = this.createMatrix();

    this.grid.forEach((row) => {
      row.forEach((cell) => {
        const {row, column} = cell;

        cell.id = `${row}-${column}`;

        cell.setNeighbors('north', this.getCell(row - 1, column));
        cell.setNeighbors('south', this.getCell(row + 1, column));
        cell.setNeighbors('west', this.getCell(row, column - 1));
        cell.setNeighbors('east', this.getCell(row, column + 1));
      });
    });

    if (algorithm) {
      algorithm(this, 10);
    }
  }

  getCell (row, column): ICell {
    if (this.grid[row] && this.grid[row][column]) {
      return this.grid[row][column];
    }
  }

  randomCell (): ICell {
    const row = Math.floor(Math.random() * this.rows);
    const column = Math.floor(Math.random() * this.columns);

    return this.grid[row][column];
  }

  size (): number {
    return this.rows * this.columns;
  }

  eachCell () {
    return this.grid.reduce((prev, curr, currIndex) => {
      return prev.concat(curr);
    }, []);
  }

  getDistances (root) {
    let distances = new Distance(root.id);
    let frontier = [root];
    let currDistance = 1;
    distances.set(root.id, 0);

    while (frontier.length > 0) {
      const newFrontier = [];

      frontier.forEach((currCell) => {
        currCell.getLinksIds().forEach((currLink) => {
          if (!distances.get(currLink)) {
            distances.set(currLink, currDistance);
            newFrontier.push(currCell.getLink(currLink));
          }
        });
      });
      frontier = newFrontier;
      currDistance++;
    }

    return distances;
  }

  print (): string {
    let output = `+${('---+').repeat(this.columns)}\n`;
    this.grid.forEach((row: ICell[]) => {
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

}

export default Grid;
