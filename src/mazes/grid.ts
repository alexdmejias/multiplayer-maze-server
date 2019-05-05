import Cell from './cell';
import Distance from './distance';
import { IGrid, ICell, IGridConfig, GridConnections, CellDictionary } from '../_interfaces';
import Algos from './algos';
import logger from '../logger';



class Grid implements IGrid {
  rows: number;
  columns: number;
  algo: Function;
  grid: ICell[][];
  grid2: CellDictionary;
  allCellConnections: GridConnections;

  constructor(config: IGridConfig) {
    this.rows = config.rows;
    this.columns = config.columns;
    this.algo = Algos[config.algo];

    if (!this.algo && config.algo) {
      logger.warn(`maze.${config.algo} is not a valid algo`);
      logger.warn(`maze.valid algos are ${Object.keys(Algos)}`);
    }

    logger.debug('maze.creating grid with this config', config)

    // this.allCellConnections = this.configureCells(this.algo);

    this.grid2 = this.createEmptyGrid();
    // this.allCellConnections = Algos[config.algo](this);
  }

  transformGrid(algo: (grid: IGrid) => GridConnections): GridConnections {
    return algo(this);
  }

  makeMatrixFromDict(): ICell[][] {
    const grid: ICell[][] = [];

    for (let i = 0; i < this.rows; i++) {
      const row: ICell[] = [];
      for (let j = 0; j < this.columns; j++) {
        row.push(this.grid2[`${i}-${j}`]);
      }

      grid.push(row);
    }

    return grid;
  }

  makeMatrixFromDictConnections(): number[][] {
    const grid: number[][] = [];

    for (let i = 0; i < this.rows; i++) {
      const row: number[] = [];
      for (let j = 0; j < this.columns; j++) {
        row.push(this.grid2[`${i}-${j}`].neighborsId);
      }

      grid.push(row);
    }

    return grid;
  }

  createEmptyGrid(): CellDictionary {
    const grid: CellDictionary = {};

    for (let i = this.rows - 1; i >= 0; i--) {
      for (let j = this.columns - 1; j >= 0; j--) {
        const hasNorth = i !== 0;
        const hasEast = j !== (this.columns - 1);
        const cell: ICell = new Cell(i, j);
        cell.neighborsId = 0;

        if (hasNorth) {
          cell.neighbors.north = `${i - 1}-${j}`;
        }

        if (hasEast) {
          cell.neighbors.east = `${i}-${j + 1}`;
        }

        grid[`${i}-${j}`] = cell;
      }
    }

    return grid;
  }

  createMatrix(): Cell[][] {
    const grid: Cell[][] = [];
    for (let i = 0; i < this.rows; i++) {
      grid.push([]);
      for (let h = 0; h < this.columns; h++) {
        grid[i].push(new Cell(i, h));
      }
    }

    return grid;
  }

  configureCells(algorithm?: Function): GridConnections {
    this.grid = this.createMatrix();
    let gridConnections = [];
    this.grid.forEach(row => {
      const rowConnections: number[] = [];
      row.forEach(cell => {
        const { row, column } = cell;

        cell.id = `${row}-${column}`;

        cell.setNeighbors('north', this.getCell(row - 1, column));
        cell.setNeighbors('south', this.getCell(row + 1, column));
        cell.setNeighbors('west', this.getCell(row, column - 1));
        cell.setNeighbors('east', this.getCell(row, column + 1));

        rowConnections.push(0);
        cell.neighborsId = 0;
      });

      gridConnections.push(rowConnections);
    });

    if (algorithm) {
      gridConnections = algorithm(this, 10);
    }

    return gridConnections;
  }

  getCell(row: number, column: number): ICell {
    if (this.grid[row] && this.grid[row][column]) {
      return this.grid[row][column];
    }
  }

  /**
   * Returns a string which is a combination of all the grids cells connections
   *
   * @returns {string}
   *
   */
  allCellConnectionsAsStr(): string {
    return this.allCellConnections.reduce((prev, row) => {
      return prev + row.join('') + '|';
    }, '');
  }

  getAllCellConnections(): GridConnections {
    return this.allCellConnections;
  }

  randomCell(): ICell {
    const row = Math.floor(Math.random() * this.rows);
    const column = Math.floor(Math.random() * this.columns);

    return this.grid[row][column];
  }

  size(): number {
    return this.rows * this.columns;
  }

  eachCell() {
    return this.grid.reduce((prev, curr, currIndex) => {
      return prev.concat(curr);
    }, []);
  }

  // setCellTypes(): GridConnections {
  //   const gridConnections: GridConnections = [];

  //   this.grid.forEach(row => {
  //     const rowConnections: number[] = [];
  //     row.forEach(cell => {
  //       let neighborId = .5;
  //       if (cell.neighbors.north) {
  //         console.log('alexalex - ++++++++++', 'x2');
  //         neighborId *= 2;
  //       }

  //       if (cell.neighbors.east) {
  //         neighborId *= 4;
  //         console.log('alexalex - ++++++++++', 'x4');
  //       }

  //       neighborId = (neighborId < 1) ? 0 : neighborId;

  //       console.log('alexalex - >>>>>>>>>>', neighborId);
  //       rowConnections.push(neighborId);
  //     });

  //     gridConnections.push(rowConnections);
  //   });

  //   // this.allCellConnections = gridConnections;

  //   return gridConnections;
  // }

  // getDistances(root) {
  //   let distances = new Distance(root.id);
  //   let frontier = [root];
  //   let currDistance = 1;
  //   distances.set(root.id, 0);

  //   while (frontier.length > 0) {
  //     const newFrontier = [];

  //     frontier.forEach(currCell => {
  //       currCell.getLinksIds().forEach(currLink => {
  //         if (!distances.get(currLink)) {
  //           distances.set(currLink, currDistance);
  //           newFrontier.push(currCell.getLink(currLink));
  //         }
  //       });
  //     });
  //     frontier = newFrontier;
  //     currDistance++;
  //   }

  //   return distances;
  // }

  print(): string {
    let corner = '+';
    let output = `${corner}${('---' + corner).repeat(this.columns)}\n`;
    this.makeMatrixFromDict().forEach((row: ICell[]) => {
      let top = '|';
      let bottom = corner;
      row.forEach((cell: ICell) => {
        let body = ` ${cell.neighborsId} `;
        let eastBoundry = cell.isLinked(cell.neighbors.east) ? '⇢' : '|';
        top += body + eastBoundry;

        let southBoundry = cell.isLinked(cell.neighbors.south) ? ' ⇡ ' : '---';
        bottom += southBoundry + corner;
      });
      output += top + '\n';
      output += bottom + '\n';
    });
    return output;
  }
}

export default Grid;
