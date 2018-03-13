import React, { Component } from 'react';
import { root } from '../models/root';
import * as MobX from 'mobx-react';
const observer = MobX.observer;
import mobx from 'mobx'

import {Article} from './Article.jsx';
import {ZoomBar} from './Zoombar.jsx'

import style from '../style.css';

var staticJson = require('../ExampleWebpage.json');


@observer
export default class Container extends Component {

	constructor(props){
      super(props);
      this.state = {zoom: 0};
      this.setZoom = this.setZoom.bind(this);
    }

    setZoom(z){
      z = parseFloat(z);
      if(z >= 0 && z <= 100){
        console.log("New Zoom: " + z);
        this.setState({zoom: z});
      }
    }

  render() {
    let json = root.mainJson ? mobx.toJS(root.mainJson) : staticJson;

    console.log("render JSON", json);

    return (
      <div className="container">
        <div>
            <Article content={json} zoom={this.state.zoom} />
        	<ZoomBar zoom={this.state.zoom} onZoomChange={this.setZoom}/>
        </div>

      </div>
    )
  }
}
