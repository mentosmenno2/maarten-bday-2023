// Mouse position functions

function getPositionXFromMouseEvent( event, $levelElement ) {
	var bounds = $levelElement[0].getBoundingClientRect();
	return event.clientX - bounds.left;
}

function getPositionYFromMouseEvent( event, $levelElement ) {
	var bounds = $levelElement[0].getBoundingClientRect();
	return $levelElement.height() - ( event.clientY - bounds.top );
}

function getPositionFromMouseEvent( event, $levelElement ) {
	return {
		x: getPositionXFromMouseEvent( event, $levelElement ),
		y: getPositionYFromMouseEvent( event, $levelElement )
	}
}

// Touch position functions

function getPositionXFromTouchEvent( event, $levelElement ) {
	var bounds = $levelElement[0].getBoundingClientRect();
	return event.touches[0].clientX - bounds.left;
}

function getPositionYFromTouchEvent( event, $levelElement ) {
	var bounds = $levelElement[0].getBoundingClientRect();
	return $levelElement.height() - ( event.touches[0].clientY - bounds.top );
}

function getPositionFromTouchEvent( event, $levelElement ) {
	return {
		x: getPositionXFromTouchEvent( event, $levelElement ),
		y: getPositionYFromTouchEvent( event, $levelElement )
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
