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
function randomizeGameObjectPosition( gameObject, level ) {
	gameObject = randomizeGameObjectPositionX( gameObject, level );
	gameObject = randomizeGameObjectPositionY( gameObject, level );
	return gameObject;
}

function randomizeGameObjectPositionX( gameObject, level ) {
	gameObject.x = Math.random() * ( level.width - gameObject.width );
	return gameObject;
}

function randomizeGameObjectPositionY( gameObject, level ) {
	gameObject.y = Math.random() * ( level.height - gameObject.height );
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

// Game object movement funcitons

function calculateGameObjectXDistance( gameObject, targetX ) {
	var centeredPlayerPosition = gameObject.x + ( gameObject.width / 2 );
	var mouseIsRightOfCenteredPlayerPosition = ( centeredPlayerPosition < targetX );
	return mouseIsRightOfCenteredPlayerPosition ? targetX - centeredPlayerPosition : centeredPlayerPosition - targetX;
}

function calculateGameObjectYDistance( gameObject, targetY ) {
	var centeredPlayerPosition = gameObject.y + ( gameObject.height / 2 );
	var mouseIsAboveCenteredPlayerPosition = ( centeredPlayerPosition < targetY );
	return mouseIsAboveCenteredPlayerPosition ? targetY - centeredPlayerPosition : centeredPlayerPosition - targetY;
}

function calculateNewGameObjectPositionX( gameObject, deltaTime, targetX ) {
	var centeredPlayerPosition = ( gameObject.x + gameObject.width / 2 );
	var mouseIsRightOfCenteredPlayerPosition = ( centeredPlayerPosition < targetX );
	var mouseDistance = calculateGameObjectXDistance( gameObject, targetX );
	var actualMoveDistance = Math.min( deltaTime * gameObject.speed, mouseDistance );
	return gameObject.x + ( mouseIsRightOfCenteredPlayerPosition ? actualMoveDistance : -actualMoveDistance )
}

function calculateNewGameObjectPositionY( gameObject, deltaTime, targetY ) {
	var centeredPlayerPosition = ( gameObject.y + gameObject.height / 2 );
	var mouseIsAboveCenteredPlayerPosition = ( centeredPlayerPosition < targetY );
	var mouseDistance = calculateGameObjectYDistance( gameObject, targetY );
	var actualMoveDistance = Math.min( deltaTime * gameObject.speed, mouseDistance );
	return gameObject.y + ( mouseIsAboveCenteredPlayerPosition ? actualMoveDistance : -actualMoveDistance )
}

function calculateNewGameObjectPosition( gameObject, deltaTime, targetPosition ) {
	var newX = targetPosition.x - ( gameObject.x + ( gameObject.width / 2 ) );
	var newY = targetPosition.y - ( gameObject.y + ( gameObject.height / 2 ) );
	var distance = Math.sqrt( newX * newX + newY * newY );
	if ( distance > 0 ) {
		newX /= distance;
		newY /= distance;
	} else {
		newX = 0;
		newY = 0;
	}

	newX *= Math.min( deltaTime * gameObject.speed, calculateGameObjectXDistance( gameObject, targetPosition.x ) );
	newY *= Math.min( deltaTime * gameObject.speed, calculateGameObjectYDistance( gameObject, targetPosition.y ) );

	return {
		x: gameObject.x + newX,
		y: gameObject.y + newY,
	}
}

// Bounding boxes

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
