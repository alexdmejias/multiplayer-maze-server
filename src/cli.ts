const inquirer = require('inquirer');
import Grid from './mazes/grid';
import algos from './mazes/algos';

inquirer.prompt([{
  type: 'list',
  message: 'What type of algorithm do you want to run?',
  name: 'algo',
  choices: [
    ...Object.keys(algos),
    'none'
  ]
}])
  .then((answers) => {
    const grid = new Grid(10, 10, algos[answers.algo]);
    console.log(grid.print());
    console.log(grid.allCellConnectionsAsStr())
  });
