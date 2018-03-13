import React from 'react';

/*
 * Takes a JSX element and compiles a style for it based on the rules in the views of the component 
 *	and the current zoom level
 *
 * @param {String} className - the className of the element to be styled
 * @param {String} tagName - the tagName of the element to be styled
 * @param {[Object]} views - the JSON views defined as such: 
 *		[zoom:int, elements:[selector:string, styles:[name:string, min:float, max:float]]]
 * @param {float} zoom - the current zoom level on a scale from -2 to 2
 *
 * @returns {style} - an object containing style names and values that can be passed to a JSX element
 */
export function zoomStyle(className, views, depth, zoom, ref=null){
	var zoomLayer = Math.floor(zoom);
	var zoomLayerPosition = zoom - zoomLayer;
	var viewLevel = zoomLayer - depth;
	var zoomDirection = Math.sign(viewLevel) || 1;

	var classNames = className.split(" ").filter((x) => x);
	var style = {};

	//Find the set of rules for styling this element by className
	var elementStyle = views.find((s) => classNames.find((name) => s.className === name ) );

	if(elementStyle){
		//Loop through every level of depth down to the current view level, starting from 0
		console.log("Style found for class: " + elementStyle.className + ", viewLevel: " + viewLevel + ", zoomLayer: " + zoomLayer + ", depth: " + depth + ", zoomDirection: " + zoomDirection);
		for(var i = 0; i != viewLevel + zoomDirection; i += zoomDirection ) {
			var elementZoomStyle = elementStyle.levels.find((v) => v.view == i)
			if(elementZoomStyle){
				elementZoomStyle = elementZoomStyle.styles;
			} else{
				continue;
			}
			//Loop through every style, from 0 to view level, applying and overwriting styles
			for(var j = 0; j < elementZoomStyle.length; j++){
				let attr = elementZoomStyle[j];
				let name = attr.name;
				let value;
				if(attr.value){ //If there is a specified value, use that
					if(attr.value === "scrollHeight" && ref){
						console.log("setting value to scrollHeight");
						value = ref.scrollHeight;
					} else{
						value = attr.value;
					}
				} else{ //If this is not the current view level, use the max value, otherwise modulate by zoomPosition
					if( i != viewLevel ){
						value = parseFloat(attr.max) + attr.unit;
					}else{
						value = (parseFloat(attr.min) + (parseFloat(attr.max) - parseFloat(attr.min)) * parseFloat(zoomLayerPosition)) + attr.unit;
					}
				}
				style[name] = value;
			}
		}
		console.log(style);
		return style;
	} else{
		return null;
	}
}

/*
 * Generates nest JSX elements from JSONified html elements
 *
 * @param {Object} elements - JSON containing information of nested HTML elements in the format:
 *	{"tagName":String, "attributes": [{name:"String", value:value}], "children":[{repeat}]}
 * @param {Object} views - JSON containing the styles at different levels of zoom for the current 
 *	component
 * @param {float} zoom - the current zoom level
 *
 * @returns {JSX} - a JSX element representing the input html styled according to the component's
 *	views and the current zoom level.
*/
var eleKeyIndex = 0;

export function createZoomedElement(element, views, depth, zoom){
	var TagName = element.tagName;
	var className = element.className;
	var attributes = element.attributes;
	var children = element.children;
	var style = zoomStyle(className, views, zoom);
	//console.log(style);
	var key = eleKeyIndex++;

	return (
		<TagName className={className} style={style} {...attributes} key={key}>
			{children && children.map((e) => typeof e === "string" ? e : createZoomedElement(e, views, depth, zoom))}
		</TagName>
	);
}