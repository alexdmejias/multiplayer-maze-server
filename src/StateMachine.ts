import logger from './logger';

interface IStateMachine {
  initTransition: string;
  transitions: ITransitions;
  methods: { [name: string]: Function; };
  _hasTransition(transition: string): boolean;
  init(): any;
}

export interface ITransition {
  from: string;
  to: string;
  duration: number
}

export interface ITransitions {
  [key: string]: ITransition;
}

interface IStateMachineConfig {
  initTransition: string;
  transitions: ITransitions;
  methods: { [name: string]: Function }
}

class StateMachine implements IStateMachine {
  private timer: any;
  currentTransition: string = '';
  initTransition: string = '';
  transitions: { [name: string]: ITransition };
  methods: { [name: string]: Function; };

  constructor(config: IStateMachineConfig) {
    this.transitions = config.transitions;
    this.initTransition = config.initTransition;
    this.methods = config.methods;
  }

  _hasTransition(transition: string): boolean {
    return this.transitions.hasOwnProperty(transition);
  }

  _capitalizeFirstLetter(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  _makeMethodName(transitionName: string): string {
    return `on${this._capitalizeFirstLetter(transitionName)}`;
  }

  _callTransition(transitionToCall: string): void {
    const methodizedName = this._makeMethodName(transitionToCall);

    if (this.methods[methodizedName] && this.transitions.hasOwnProperty(transitionToCall)) {
      const { duration, to } = this.transitions[transitionToCall]
      this.currentTransition = to;

      logger.debug(`SM.calling ${methodizedName}, should call next method in ${duration}`);

      this.methods[methodizedName]();

      this.timer = setTimeout(() => {
        const next = this.transitions[transitionToCall].to;

        if (this.methods['onEnterState']) {
          logger.debug(`SM.calling onEnterState, ${transitionToCall} -> ${next}`);
          this.methods['onEnterState'](transitionToCall, next);
        }

        this._callTransition(next);
      }, duration);
    } else {
      console.log('nope')
    }
  }

  init(): any {
    const { initTransition } = this;

    // this.methods[this._makeMethodName(initTransition)]();
    this._callTransition(initTransition);
  }

}

export default StateMachine;