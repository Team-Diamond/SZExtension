import React from 'react';

var zoomBarHeight = 500;
var zoomBarWidth = 70;
var yOffset = 50;
var circleRadius = 20;

export class ZoomBar extends React.Component{
	constructor(props){
		super(props);
		this.state = {};
		this.handleChange = this.handleChange.bind(this);
		this.numZoomLayers = 5;
	}

	handleChange(e){
		if(e.buttons === 1){
			console.log("mouse down on svg");
			e.preventDefault();
			var svg = document.querySelector(".zoom-bar");
			var svgDim = svg.getBoundingClientRect();
			var mouseY = e.clientY - svgDim.top - yOffset;
			var z = ((zoomBarHeight - mouseY) / zoomBarHeight * this.numZoomLayers);
			z = Math.round(z * 10) / 10;
			this.props.onZoomChange(z);
		}
	}

	render(){
		var zoom = this.props.zoom;
		this.numZoomLayers = this.props.numZoomLayers || 5;
		var polygonPoints = "20,"+ yOffset +" 50," + yOffset + " 35," + (zoomBarHeight + yOffset);

		var scaleLines = [];
		for (var i = 0; i < this.numZoomLayers; i++){
			var y = i * zoomBarHeight / this.numZoomLayers + yOffset;
			var width = zoomBarWidth * (this.numZoomLayers - i ) / this.numZoomLayers;
			var x1 = zoomBarWidth / 2 - width / 2;
			var x2 = x1 + width;
			var line = <line x1={x1} x2={x2} y1={y} y2={y} />;
			scaleLines.push(line);
		}

		var circleY = zoomBarHeight - (zoom / this.numZoomLayers * zoomBarHeight) + yOffset;
		var sliderCircle = 
			<circle 
			className="slider-circle" 
			cx={zoomBarWidth/2} 
			cy={circleY} 
			r={circleRadius} />;

		return(
			<svg className="zoom-bar" width={zoomBarWidth} height={zoomBarHeight + 2*yOffset} onMouseMove={this.handleChange} onMouseDown={this.handleChange}>
				<polygon points={polygonPoints}/>
				{scaleLines}
				{sliderCircle}
				<text x={zoomBarWidth/2} y={circleY}>{zoom}</text>
			</svg>
		);
	}
}