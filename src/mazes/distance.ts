import { ICell } from './../_interfaces';
class Distance {
  cells: { [k: string]: number };
  root: ICell;

  constructor(root: ICell) {
    this.root = root;
    this.cells = {
      [root.id]: 0
    }
  }

  get(cellId: string): number {
    return this.cells[cellId];
  }

  set(cellId: string, distance: number) {
    if (Object.keys(this.cells).indexOf(cellId) === -1) {
      this.cells[cellId] = distance;
    }
  }

  getKeys() {
    return Object.keys(this.cells);
  }

}

export default Distance;
