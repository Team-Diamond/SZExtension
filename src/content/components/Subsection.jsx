import React from 'react';
import {zoomStyle, createZoomedElement} from './Zoomable.js'

var views = [
	{className: "section-container", levels :[
		{ view: 0, styles:[
			{name: "padding-right", value: "0px"}
		]},
		{ view: -1, styles:[
		]},
		{ view: -2, styles: [
			{name: "flex", value:" 1 33%"},
			{name: "padding-right", value: "15px"}
		]},
		{ view: -3, styles: [
			{name: "flex", value:"0 1 20%"}
		]}
	]},
	{className: "section-title", levels :[
		{ view: 0, styles: [
			{name: "flex", value: "1 1 20%"},
			{name: "padding-right", value: "15px"}
		]},
		{ view: -2, styles: [
			{name: "flex", value: "1 0 100%"},
			{name: "padding-right", value: "0px"}
		]}
	]},
	{className: "section-content", levels:[
		{ view: 0, styles:[
			{name: "flex", value: "3 0 70%"},
		]},
		{ view: -1, styles:[
			{name: "border", value: "1px solid grey"}
		]},
		{ view: -2, styles:[
		]}
	]},
	{className: "section-text", levels :[
		{ view: 0, styles:[
			{name: "flex", value: "3 60%"},
			{name: "max-height", value: "scrollHeight"}
		]},
		{ view: -1, styles:[
			{name: "max-height", min: 150, max: 200, unit: "px"}
		]},
		{ view: -2, styles: [
			{name: "max-height", min: 100, max: 150, unit: "px"},
		]},
		{ view: -3, styles: [
			{name: "max-height", value: "100px"}
		]}
	]},
	{className: "subsection-container", levels :[
		{ view: 0, styles:[
			{name: "flex", value:"1 0 100%"},
			{name: "padding", value:"0px"}
		]},
		{ view: -1, styles:[
		]},
		{ view: -2, styles: [
		]},
		{ view: -3, styles: [
			{name: "display", value: "none"}
		]}
	]}
];

export class Subsection extends React.Component{
	constructor(props){
		super(props);
		this.state = {};
	}

	render(){
    console.log("start render subsections")
		console.log(this.props.content);
		const content = this.props.content;
		const depth = this.props.depth
		const zoom = this.props.zoom;		
		const title = content.title;
		console.log("Creating Subsection: " + title);
		const outlineNumber = content.outline_number;
		const thisLevelHTML = content.content_HTML;
    console.log("outline", content.outline_number);

		const sectionContent = thisLevelHTML.map(function(element){
			return createZoomedElement(element, views, depth, zoom);
		});
		const subsections = content.subsections.map(function(subsection, i){
			return <Subsection content={subsection} depth={depth+1} zoom={zoom} key={"section_" + subsection.outline_number}/>;
		});

		var vdz = [views, depth, zoom];
		
		return (
			<div className="section-container" 
				style={zoomStyle("section-container", views, depth, zoom)}
			>
				<h2 className="section-title" 
					style={zoomStyle("section-title", views, depth, zoom)}
				>{title}</h2>
				<div className="section-content"  
					style={zoomStyle("section-content", views, depth, zoom)}
				>
					<div className="section-text" 
						ref={(div) => {this.sectionText = div;}}
						style={zoomStyle("section-text", views, depth, zoom, this.sectionText)}
					>	
						{sectionContent}
					</div>
         { subsections && subsections.length > 0 ?
					 <div className="subsection-container" style={zoomStyle("subsection-container", views, depth, zoom)}>
						{subsections}
					 </div> :
           <div></div>
         }
				</div>
			</div>
		);
	}
}