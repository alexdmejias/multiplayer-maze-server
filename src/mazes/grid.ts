import { Direction, CellId } from './../_interfaces';
import Cell from './cell';
import Distance from './distance';
import { IGrid, ICell, IGridConfig, GridConnections, CellDictionary } from '../_interfaces';
import Algos from './algos';
import logger from '../logger';
import { getOppositeDirection, getNeighborPosition, parsedIdFromStr, makeIdFromArr, getNeighborDirection } from './utils';

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

    this.grid2 = this.createEmptyGrid();
  }

  transformGrid(algo: (grid: IGrid) => GridConnections): GridConnections {
    const transformedGrid = algo(this);

    return transformedGrid;
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

  makeMatrixFromDictConnections(): string[][] {
    const grid: string[][] = [];

    for (let i = 0; i < this.rows; i++) {
      const row: string[] = [];
      for (let j = 0; j < this.columns; j++) {
        const cell = this.grid2[`${i}-${j}`];
        cell.neighborsId = cell.getCellType();
        row.push(cell.neighborsId);
      }
      grid.push(row);
    }

    return grid;
  }

  createEmptyGrid(): CellDictionary {
    const grid: CellDictionary = {};

    for (let i = this.rows - 1; i >= 0; i--) {
      for (let j = this.columns - 1; j >= 0; j--) {
        const cell: ICell = new Cell(i, j);

        if (i !== 0) {
          cell.neighbors.north = makeIdFromArr([i - 1, j]);
        }

        if (j !== (this.columns - 1)) {
          cell.neighbors.east = makeIdFromArr([i, j + 1]);
        }

        if (i !== (this.rows - 1)) {
          cell.neighbors.south = makeIdFromArr([i + 1, j]);
        }

        if (j !== 0) {
          cell.neighbors.west = makeIdFromArr([i, j - 1]);
        }

        grid[makeIdFromArr([i, j])] = cell;
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

  getCell(row: number, column: number): ICell {
    if (this.grid[row] && this.grid[row][column]) {
      return this.grid[row][column];
    }
  }

  linkCells(baseCell: CellId, direction: Direction): void {
    const wasd = parsedIdFromStr(baseCell);
    const newLink = getNeighborPosition(direction, wasd[0], wasd[1]);
    const newLinkId = makeIdFromArr(newLink);

    this.grid2[baseCell].setLink(newLinkId, direction);
    this.grid2[newLinkId].setLink(baseCell, getOppositeDirection(direction));
  }

  linkCellsById(baseCell: CellId, endCell: CellId): Direction {
    const direction = getNeighborDirection(baseCell, endCell);

    if (this.grid2[baseCell].hasNeighbor(direction)) {
      this.grid2[baseCell].setLink(endCell, direction);
      this.grid2[endCell].setLink(baseCell, getOppositeDirection(direction));
    }

    return direction;
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

  getDistances(): [string, string, number] {
    let maxDistance = 0;
    let longestPair = [];
    Object.values(this.grid2).forEach(topLevelCell => {
      const d = new Distance(topLevelCell.id);
      d.set(topLevelCell.id, 0);
      let frontier = [topLevelCell.id];

      while (frontier.length > 0) {
        const newFrontier = [];

        frontier.forEach(cell => {
          Object.values(this.grid2[cell].links).forEach(linked => {
            if (d.hasCell(linked)) return;

            const newValue = d.get(cell) + 1;
            d.set(linked, newValue);

            if (newValue > maxDistance) {
              maxDistance = newValue;
              longestPair = [d.root, linked]
            }
            newFrontier.push(this.grid2[linked].id)
          })
        })

        frontier = newFrontier;
      }
      topLevelCell.setDistances(d.cells);
    });
    return [longestPair[0], longestPair[1], maxDistance];
  }

  print(): string {
    let corner = '+';
    let output = `${corner}${('---' + corner).repeat(this.columns)}\n`;
    this.makeMatrixFromDict().forEach((row: ICell[]) => {
      let top = '|';
      let bottom = corner;
      row.forEach((cell: ICell) => {
        let body = ` ${cell.neighborsId} `;
        let eastBoundry = cell.hasLink('east') ? ' ' : '|';
        top += body + eastBoundry;

        let southBoundry = cell.hasLink('south') ? '   ' : '---';
        bottom += southBoundry + corner;
      });
      output += top + '\n';
      output += bottom + '\n';
    });
    return output;
  }
}

export default Grid;
