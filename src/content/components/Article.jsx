import React from 'react';
import {zoomStyle, createZoomedElement} from './Zoomable.js';
import {addPanEventListenerToArticle} from '../listeners/zoom_events.js'
import {Subsection} from './Subsection.jsx';
import {addZoomEventListeners, handleZoomEvent} from '../listeners/zoom_events.js'

var views = [
	{className: "section-content", levels :[
		{ view: 0, styles:[
			{name: "maxHeight", value: "scrollHeight"},
			{name: "maxWidth", value: "100%"},
			{name: "border", value:"1px solid black"}
		]},
		{ view: -1, styles:[
			{name: "maxHeight", min:100, max:500, unit:"px"},
			{name: "maxWidth", value: "100%"}
		]}
	]}
];

export class Article extends React.Component{
	constructor(props){
		super(props);
		this.state = { 'zoom' : this.props.zoom };
		this.ref = React.createRef();
	}

	componentDidMount() {
		this.hammer = addZoomEventListeners( this, this.sectionContent );
	}

	setZoom( zoom ){
		this.setState( ( prevState, props) =>{
			return({ 'zoom' : zoom })
		} );
	}

	render(){
		const content = this.props.content;
		const depth = 0;
		const zoom = this.state.zoom;		
		const title = content.title;
		const thisLevelHTML = content.content_HTML;
		const sectionContent = thisLevelHTML.map(function(element){
			return createZoomedElement(element, views, depth, zoom);
		});
		const subsections = content.subsections.map(function(subsection, i){
			return <Subsection content={subsection} depth={depth+1} zoom={zoom} key={"section_" + subsection.outline_number}/>;
		});

    console.log("subsections", subsections);
		
		return (
			<div className="article-container" style={zoomStyle("article-container", views, depth, zoom)} ref={this.ref}>
				<h1>{title}</h1>
				<div className="section-content" ref={(div) => {this.sectionContent = div; }} style={zoomStyle("section-content", views, 1, zoom, this.sectionContent)}>
				{console.log(sectionContent)}
					{sectionContent}
				</div>
        { 
          subsections && subsections.length > 0 ?
				  <div className="subsection-container" style={zoomStyle("subsection-container", views, depth, zoom)}>
					 {subsections}
				  </div> 
          : <div></div> 
        }
			</div>
		);
	}
}