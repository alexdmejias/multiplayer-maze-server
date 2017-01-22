import Inquirer from 'inquirer';
import Grid from './mazes/grid';
import BinaryTreeAlgo from './mazes/algos/binary';

const grid = new Grid(10, 10, BinaryTreeAlgo);
console.log(grid.print());
