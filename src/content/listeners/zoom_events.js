import Hammer from 'hammerjs';

const WHEEL_SENSITIVITY = -375; //higher is less sensitive
const PINCH_SENSITIVITY = 1;
const PAN_SENSITIVITY = .25;

/**
 * Adds listeners for zooming to a zoomable element using hammer
 * @param {element} element - the element to add listners to
 */
export function addZoomEventListeners( component, element=null ){
	
	//Creates a hammer instance bound to the element that detects a 'zoom' event
	if( !element ) element = component.ref.current;
	var hammer = new Hammer.Manager( element, {
		recognizers : [
			[ Hammer.Pinch, {
				enable : true,
				event: 'zoom',
			}],
			[ Hammer.Pan, {
				enable : true,
				event: 'pan'
			}]
		]
	});
	hammer.on('zoom', (e) => handleZoomEvent(e, component) );
	element.addEventListener( 'wheel', (e) => { handleZoomEvent(e, component) } );

	component.hammer = hammer;

	return hammer;
}

export function handleZoomEvent( event, component ){
	event.preventDefault();
	//console.log("Event.scale: ", event.scale, ", Event.deltaY: ", event.deltaY);

	var oldZoom = component.state.zoom;
	var deltaZoom = event.scale ? event.scale * PINCH_SENSITIVITY : event.deltaY / WHEEL_SENSITIVITY;
	var newZoom = oldZoom + deltaZoom;

	//console.log("ZOOMING: old zoom: ", oldZoom, ", deltaZoom: ", deltaZoom, ", new zoom: ", newZoom);	

	component.setZoom( newZoom );
}

export function addPanEventListenerToContainer( component ){
	var element = component.ref.current;

	if ( !component.hammer ){
		var hammer = new Hammer.Manager( element, {} );
		component.hammer = hammer;
	}
	component.hammer.add( new Hammer.Pan({ direction : Hammer.DIRECTION_VERTICAL, event : 'pan' }));
	component.hammer.on( 'panmove panstart', ( event ) => {
		event.preventDefault();
		console.log( "PANNING:", event.deltaY );
		if ( event.type === 'panstart'){
			component.prevPanY = 0;
		}

		var panDistance = (event.deltaY - component.prevPanY) * PAN_SENSITIVITY * -1;

		element.scrollBy( 0, panDistance );
	});
}