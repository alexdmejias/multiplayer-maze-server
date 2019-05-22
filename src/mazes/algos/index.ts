import { IAlgos } from '../../_interfaces';
import Binary from './binary';
import Sidewinder from './sidewinder';
import AldousBroder from './aldous-broader';

const algos: IAlgos = {
  binary: Binary,
  sidewinder: Sidewinder,
  aldousBroder: AldousBroder
}

export default algos;