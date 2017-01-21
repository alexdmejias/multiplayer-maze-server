import Cell from './cell';
import Distance from './distance';
import {IGrid, ICell} from '../_interfaces';

class Grid implements IGrid {
  rows: number;
  columns: number;
  grid: ICell[][];

  constructor (rows: number, columns: number) {
    this.rows = rows;
    this.columns = columns;

    this.grid = this.prepareGrid();
    this.configureCells();
  }

  prepareGrid (): Cell[][] {
    const grid: Cell[][] = [];
    for (var i = 0; i < this.rows; i++) {
      grid.push([]);
      for (var h = 0; h < this.columns; h++) {
        grid[i].push(new Cell(i, h));
      }
    }

    return grid;
  }

  configureCells () {
    this.eachCell().forEach((cell) => {
      const {row, column} = cell;

      cell.id = `${row}-${column}`;

      cell.setNeighbors('north', this.getCell(row - 1, column));
      cell.setNeighbors('south', this.getCell(row + 1, column));
      cell.setNeighbors('west', this.getCell(row, column - 1));
      cell.setNeighbors('east', this.getCell(row, column + 1));
    });
  }

  getCell (row, column): Cell {
    if (this.grid[row] && this.grid[row][column]) {
      return this.grid[row][column];
    }
  }

  randomCell (): Cell {
    const row = Math.floor(Math.random() * this.rows);
    const column = Math.floor(Math.random() * this.columns);

    return this.grid[row][column];
  }

  size (): number {
    return this.rows * this.columns;
  }

  eachRow () {
    return this.grid;
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
    let maze: string = '';

    maze += ' _ '.repeat(this.rows);
    this.grid.forEach((row) => {
      maze += '\n';
      row.forEach((column) => {
        maze += '| '
      })
      maze += ' _ '.repeat(this.rows);
    })

    return maze;
  }

}

export default Grid;