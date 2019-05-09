import { ICell, Direction, CellId } from '../_interfaces';
// import Distance from './distance';

class Cell implements ICell {
  row: number;
  column: number;
  id: string;
  distances: { [k in CellId]: number };
  neighbors = {};
  neighborsId: string = '0';
  links = {};

  constructor(rowArg: number, columnArg: number) {
    this.row = rowArg;
    this.column = columnArg;

    this.id = `${this.row}-${this.column}`;
  }

  // instead of creating a setter for each direction
  setNeighbors(direction: Direction, neighbor: ICell) {
    this.neighbors[direction] = neighbor;
  }

  hasNeighbor(direction: Direction): boolean {
    return !!this.neighbors[direction];
  }

  getCellType(): string {
    const scale = [1, 2, 3, 5];
    let cellType = 0;
    if (this.hasNeighbor('north')) {
      cellType += scale[0];
    }

    if (this.hasNeighbor('east')) {
      cellType += scale[1];
    }

    if (this.hasLink('north')) {
      cellType += scale[2];
    }

    if (this.hasLink('east')) {
      cellType += scale[3];
    }

    return cellType.toString(16);
  }

  toString(): CellId {
    return `${this.row}-${this.column}`;
  }

  // instead of creating a getter for each direction
  getNeighbors(direction: Direction): ICell {
    return this.neighbors[direction];
  }

  setLink(cell: CellId, direction: Direction, bidirectional = true) {
    this.links[direction] = cell;
  }

  // delLink(cell: ICell, bidirectional = true) {
  //   delete this.links[cell.id];

  //   if (bidirectional) {
  //     delete cell.links[this.id];
  //   }
  //   // return this;
  // }

  getLinksIds() {
    return Object.keys(this.links);
  }

  getLink(direction: Direction): CellId {
    return this.links[direction];
  }

  hasLink(direction: Direction): boolean {
    return !!this.links[direction];
  }

  setDistances(distances: { [k: string]: number }) {
    this.distances = distances;
  }
}

export default Cell;
