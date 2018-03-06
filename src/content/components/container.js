import React, { Component } from 'react';
import { root } from '../models/root';
import * as MobX from 'mobx-react';
const observer = MobX.observer;

@observer
export default class Container extends Component {

  render() {
    return (
      <div className="cards-container">
        <h1>{root.n}</h1>
        <button type="button" onClick={root.addOne.bind(root)}>Click Me!</button>
      </div>
    )
  }
}
