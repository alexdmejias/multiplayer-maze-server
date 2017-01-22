import {ICell} from '../_interfaces';

class Cell implements ICell {
  row: number;
  column: number;
  id: string;
  distance: number;
  neighbors: {[k:string]: ICell} = {};

  links = {};
  constructor (rowArg: number, columnArg: number) {
    this.row = rowArg;
    this.column = columnArg;

    this.id = `${this.row}-${this.column}`;
  }

  // instead of creating a setter for each direction
  setNeighbors (direction, value) {
    this.neighbors[direction] = value;
  }

  // instead of creating a getter for each direction
  getNeighbors (direction): ICell {
    return this.neighbors[direction];
  }

  getAllNeighbors (): ICell[] {
    const list = [];
    for (let direction in this.neighbors) {
      if (this.neighbors[direction]) {
        list.push(direction);
      }
    }
    return list;
  }

  setLink (cell, bidirectional = true) {
    this.links[cell.id] = cell;

    if (bidirectional) {
      cell.links[this.id] = this;
    }
    return this;
  }

  delLink (cell, bidirectional = true) {
    delete this.links[cell.id];

    if (bidirectional) {
      delete cell.links[this.id];
    }
    return this;
  }

  getLinksIds () {
    return Object.keys(this.links);
  }

  getLink (id) {
    return this.links[id];
  }

  isLinked (cell) {
    if (cell) {
      if (this.links[cell.id]) {
        return this.links[cell.id];
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  setDistance (dis) {
    this.distance = dis;
  }

}

export default Cell;
