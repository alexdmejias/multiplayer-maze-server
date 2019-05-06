import { ICell, Direction, CellId } from '../_interfaces';
import Distance from './distance';

class Cell implements ICell {
  row: number;
  column: number;
  id: string;
  distance: any;
  neighbors = {};
  // links: { [K: string]: ICell } = {};
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



  toString(): CellId {
    return `${this.row}-${this.column}`;
  }

  // instead of creating a getter for each direction
  getNeighbors(direction: Direction): ICell {
    return this.neighbors[direction];
  }

  setLink(cell: CellId, direction: Direction, bidirectional = true) {
    this.links[direction] = cell;

    // if (bidirectional) {
    //   cell.links[this.id] = this;
    // }
    // return this;
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

  // isLinked(cell: ICell | string): ICell | boolean {
  //   if (!cell) return false;
  //   let cellId = typeof cell === 'string' ? cell : cell.id;

  //   if (this.links[cellId]) {
  //     return this.links[cellId];
  //   } else {
  //     return false;
  //   }
  // }

  hasLink(direction: Direction): boolean {
    return !!this.links[direction];
  }

  // setDistance(dis) {
  //   this.distance = dis;
  // }

  // distances() {
  //   const distances = new Distance(this);

  //   const frontier = [this]
  // }

}

export default Cell;
