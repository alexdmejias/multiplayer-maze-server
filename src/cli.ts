const inquirer = require('inquirer');
import Algos from './mazes/algos';
import Grid from './mazes/grid';

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
    const grid = new Grid({ rows: 10, columns: 10, algo: answers.algo });
    const cons = grid.transformGrid(Algos[answers.algo])
    // grid.makeMatrixFromDictConnections();
    console.log(grid.print());
  });
