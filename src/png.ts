const inquirer = require('inquirer');
import Algos from './mazes/algos';
import Grid from './mazes/grid';
import { IGrid, IGridConfig } from './_interfaces';
import { createCanvas, Canvas, CanvasRenderingContext2D } from 'canvas';
var fs = require('fs');

interface IPNGViewer extends IGrid {
  imageWidth: number;
  imageHeight: number;
  canvas: Canvas;
  ctx: CanvasRenderingContext2D;
}

class PNGViewer extends Grid implements IPNGViewer {
  imageWidth = 0;
  imageHeight = 0;
  cellSize = 10;
  canvas: Canvas;
  ctx: CanvasRenderingContext2D;

  constructor(config: IGridConfig) {
    super(config);
    this.imageWidth = config.columns * config.cellSize;
    this.imageHeight = config.rows * config.cellSize;
    this.cellSize = config.cellSize;

    this.canvas = createCanvas(this.imageWidth, this.imageHeight);
    this.ctx = this.canvas.getContext('2d');
  }

  render() {
    this.grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const x1 = colIndex * this.cellSize;
        const y1 = rowIndex * this.cellSize;
        const x2 = (colIndex + 1) * this.cellSize;
        const y2 = (rowIndex + 1) * this.cellSize;

        if (!cell.neighbors['north']) {
          this.drawWall(this.ctx, x1, y1, x2, y1, 'north');
        }

        if (!cell.neighbors['west']) {
          this.drawWall(this.ctx, x1, y1, x1, y2, 'west');
        }

        if (!cell.isLinked(cell.neighbors.east)) {
          this.drawWall(this.ctx, x2, y1, x2, y2, 'link');
        }

        if (!cell.isLinked(cell.neighbors.south)) {
          this.drawWall(this.ctx, x1, y2, x2, y2, 'link');
        }
      })
    });

    const img = this.canvas.toBuffer();
    fs.writeFile("image.png", img, function (err) {
      if (err) {
        return console.log(err);
      }

      console.log("The file was saved!");
    });
  }

  drawWall(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, label: string) {
    ctx.beginPath();
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

}

inquirer.prompt([{
  type: 'list',
  message: 'What type of algorithm do you want to run?',
  name: 'algo',
  choices: [
    'none',
    ...Object.keys(Algos),
  ]
}])
  .then((answers) => {
    console.log(`creating grid with the ${answers.algo} algorithm`);
    const grid = new PNGViewer({ rows: 10, columns: 10, algo: answers.algo, cellSize: 15 });
    grid.render();
  });
