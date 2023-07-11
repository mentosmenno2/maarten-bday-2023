// Mouse position functions

function getMousePositionXFromClickEvent( event, $levelElement ) {
	var bounds = $levelElement[0].getBoundingClientRect();
	return event.clientX - bounds.left;
}

function getMousePositionYFromClickEvent( event, $levelElement ) {
	var bounds = $levelElement[0].getBoundingClientRect();
	return $levelElement.height() - ( event.clientY - bounds.top );
}

function getMousePositionFromClickEvent( event, $levelElement ) {
	return {
		x: getMousePositionXFromClickEvent( event, $levelElement ),
		y: getMousePositionYFromClickEvent( event, $levelElement )
	}
}

// Game object functions
function randomizeGameObjectPosition( gameObject, $levelElement ) {
	gameObject = randomizeGameObjectPositionX( gameObject, $levelElement );
	gameObject = randomizeGameObjectPositionY( gameObject, $levelElement );
	return gameObject;
}

function randomizeGameObjectPositionX( gameObject, $levelElement ) {
	gameObject.x = Math.random() * ( $levelElement.width() - gameObject.width );
	return gameObject;
}

function randomizeGameObjectPositionY( gameObject, $levelElement ) {
	gameObject.y = Math.random() * ( $levelElement.height() - gameObject.height );
	return gameObject;
}

function getGameObjectTouchesPosition( gameObject, x, y ) {
	return ( x >= gameObject.x && x <= gameObject.x + gameObject.width )
	&& ( y >= gameObject.y && y <= gameObject.y + gameObject.height );
}

function gameObjectsHit( gameObject1, gameObject2 ) {
	return boundingBoxesHit( gameObjectToBoundingBox( gameObject1 ), gameObjectToBoundingBox( gameObject2 ) );
}

function gameObjectToBoundingBox( gameObject ) {
	return {
		top: gameObject.y + gameObject.height,
		right: gameObject1.x + gameObject.width,
		bottom: gameObject.y,
		left: gameObject1.x,
	}
}

function boundingBoxesHit(rect1, rect2) {
	return !(rect1.right < rect2.left ||
		rect1.left > rect2.right ||
		rect1.bottom < rect2.top ||
		rect1.top > rect2.bottom)
}

function getBoundingBoxFromBoundingClientRect( boundingClientRect, $levelElement ) {
	var bounds = $levelElement[0].getBoundingClientRect();
	return {
		top: boundingClientRect.top - bounds.top,
		right: boundingClientRect.right - bounds.right,
		bottom: boundingClientRect.bottom - bounds.bottom,
		left: boundingClientRect.left - bounds.left,
	}
}
