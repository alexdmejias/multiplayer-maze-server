import Inquirer from 'inquirer';
import Grid from './mazes/grid';
import BinaryTreeAlgo, {binaryToStr} from './mazes/algos/binary';

const grid = new Grid(10, 10);
const binaryGrid = BinaryTreeAlgo(grid, 10);

console.log(binaryToStr(binaryGrid));
