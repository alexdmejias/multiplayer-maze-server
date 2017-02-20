const inquirer = require('inquirer');
import Grid, {Algos} from 'multiplayer-maze-core';

inquirer.prompt([{
  type: 'list',
  message: 'What type of algorithm do you want to run?',
  name: 'algo',
  choices: [
    ...Object.keys(Algos),
    'none'
  ]
}])
  .then((answers) => {
    console.log(`creating grid with the ${answers.algo} algorithm`);
    const grid = new Grid(10, 10, answers.algo);
    console.log(grid.print());
    console.log(grid.allCellConnectionsAsStr())
  });
