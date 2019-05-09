import { CellId } from './../_interfaces';

class Distance {
  cells: { [k in CellId]: number } = {};
  root: CellId;

  constructor(root: CellId) {
    this.root = root;
  }

  get(cellId: CellId): number {
    return this.cells[cellId];
  }

  hasCell(cellId: CellId): boolean {
    return !!this.cells[cellId];
  }

  set(cellId: CellId, distance: number) {
    this.cells[cellId] = distance;
  }

  getKeys() {
    return Object.keys(this.cells);
  }

}

export default Distance;
