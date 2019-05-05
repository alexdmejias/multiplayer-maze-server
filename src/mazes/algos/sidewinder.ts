export default () => { };

// import { IGrid, ICell, GridConnections } from '../../_interfaces';
// import _random from 'lodash.random';
// import _sample from 'lodash.sample';

// // 1 no link no neighbor
// // 2 link to north no neighbor to east
// // 3 link to east no neighbor to north
// // 5 link to north neighbor to east
// // 6 link to east neighbor north
// export default (grid: IGrid): GridConnections => {
//   const gridConnections: GridConnections = [];
//   grid.grid.forEach((row) => {
//     const rowConnections: number[] = [];
//     let run: ICell[] = [];

//     row.forEach(cell => {
//       let neighborsId = .5;
//       run.push(cell)
//       let atEasternBoundry = false;
//       let atNorthernBoundry = false;

//       if (cell.neighbors.north) {
//         // neighbors.push(cell.neighbors.north);
//         neighborsId *= 2;
//       }

//       if (cell.neighbors.east) {
//         // neighbors.push(cell.neighbors.east);
//         neighborsId *= 4;
//       }

//       const shouldCloseOut = atEasternBoundry || (!atNorthernBoundry && _random());

//       if (shouldCloseOut) {
//         const member: ICell = _sample(run);

//         console.log('alexalex - ----------', member);
//         if (member.neighbors.north) {
//           member.setLink(member.neighbors.north);

//           run = [];
//         }
//       } else if (cell.neighbors.east) {
//         cell.setLink(cell.neighbors.east)
//       }

//       rowConnections.push(neighborsId);
//     });
//     gridConnections.push(rowConnections);
//   });

//   return gridConnections;
// };
