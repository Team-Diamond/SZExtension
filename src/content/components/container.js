import React, { Component } from 'react';
import { root } from '../models/root';
import * as MobX from 'mobx-react';
const observer = MobX.observer;

import {Article} from './Article.jsx';
import {ZoomBar} from './Zoombar.jsx'

var json = require('../ExampleWebpage.json');


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

  	const attributes = {
        src: "https://en.wikipedia.org/wiki/French_Revolution",
        stylesheet: "../style.css"
    };

    return (
      <div className="cards-container">
      	<link rel="stylesheet" type="text/css" href={attributes.stylesheet} />
        <h1>{root.n}</h1>
        <button type="button" onClick={root.addOne.bind(root)}>Click Me!</button>
        <div>
            <Article content={json.article} zoom={this.state.zoom} />
        	<ZoomBar zoom={this.state.zoom} onZoomChange={this.setZoom}/>
        </div>

      </div>
    )
  }
}
