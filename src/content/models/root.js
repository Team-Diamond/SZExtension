import { observable } from 'mobx'

export class Root {
  @observable
  n = 0;

  @observable
  mainJson = null;

  addOne() {
    console.log("add" + this.n);
    this.n ++;
    console.log(this.n)
  }
}

export const root = new Root();
