import { ICell, Direction } from '../_interfaces';
import Distance from './distance';

class Cell implements ICell {
  row: number;
  column: number;
  id: string;
  distance: any;
  neighbors: { [K in Direction]?: ICell } = {};
  // links: { [K: string]: ICell } = {};
  links: { [K: string]: ICell } = {};

  constructor(rowArg: number, columnArg: number) {
    this.row = rowArg;
    this.column = columnArg;

    this.id = `${this.row}-${this.column}`;
  }

  // instead of creating a setter for each direction
  setNeighbors(direction: Direction, neighbor: ICell) {
    this.neighbors[direction] = neighbor;
  }

  // instead of creating a getter for each direction
  getNeighbors(direction: Direction): ICell {
    return this.neighbors[direction];
  }

  setLink(cell: ICell, bidirectional = true) {
    this.links[cell.id] = cell;

    if (bidirectional) {
      cell.links[this.id] = this;
    }
    return this;
  }

  delLink(cell: ICell, bidirectional = true) {
    delete this.links[cell.id];

    if (bidirectional) {
      delete cell.links[this.id];
    }
    // return this;
  }

  getLinksIds() {
    return Object.keys(this.links);
  }

  getLink(id: string): ICell {
    return this.links[id];
  }

  isLinked(cell: ICell): ICell | boolean {
    if (cell && cell.id && this.links[cell.id]) {
      return this.links[cell.id];
    } else {
      return false;
    }
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
