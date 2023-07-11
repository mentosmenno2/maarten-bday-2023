var gameState = {
	width: $( '.level' ).width(),
	height: $( '.level' ).height(),
	resizeTimeout: null,
	lastRenderTime: null,
	player: {
		mouseX: 0,
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		invulnerable: 0,
		health: 100
	},
	enemy: {
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		invulnerable: 0,
		health: 100
	},
}

function initializeGame() {
	$( window ).on( 'resize', onResize );

	setGameObjectsSizesAndYPosition();
	gameState.player.x = ( $( '.level' ).width() / 2 ) - ( gameState.player.width / 2 );
	gameState.enemy.x = ( $( '.level' ).width() / 2 ) - ( gameState.enemy.width / 2 );

	draw();
}

function addGameEventListeners() {
	$( '.level' ).on( 'mousemove', onMouseMove );
	$( '.level' ).on( 'touchmove', onTouchMove );
}

function startGame() {
	addGameEventListeners();
	$( '.audio-music-ingame' )[0].play();
	window.requestAnimationFrame(loop);
}

function onMouseMove( event ) {
	var bounds = $( '.level' )[0].getBoundingClientRect();
	gameState.player.mouseX = event.clientX - bounds.left;
}

function onTouchMove( event ) {
	event.preventDefault();
	var bounds = $( '.level' )[0].getBoundingClientRect();
	gameState.player.mouseX = event.touches[0].clientX - bounds.left;
}

function onResize() {
	if ( gameState.resizeTimeout ) {
		clearTimeout( gameState.resizeTimeout );
		gameState.resizeTimeout = null;
	}

	// Get old sizes before elements are resized
	var oldWidth = gameState.width;
	var oldHeight = gameState.height;

	// In a timeout, as browser first fires the resize event before redrawing elements.
	gameState.resizeTimeout = setTimeout(() => {
		gameState.width = $( '.level-whack-a-duck' ).width();
		gameState.height = $( '.level-whack-a-duck' ).height();

		setGameObjectsSizes();

		gameState.enemy.x *= gameState.width / oldWidth;
		gameState.enemy.y *= gameState.height / oldHeight;

		draw();
	}, 1);
}

function setGameObjectsSizesAndYPosition() {
	gameState.player.width = $( '.level' ).width() * 0.05;
	gameState.player.height = $( '.level' ).height() * 0.05;
	gameState.player.y = 10;

	gameState.enemy.width = $( '.level' ).width() * 0.05;
	gameState.enemy.height = $( '.level' ).height() * 0.05;
	gameState.enemy.y = $( '.level' ).height() - gameState.player.height - 10;
}

function update(deltaTime) {
	setGameObjectsSizesAndXPosition();

	// Move player

	// Move enemy

	// Maybe create bullet

	// Check bullet hit player

	// Check bullet hit enemy
}

function draw() {
	$( '.character-player' ).width( gameState.player.width );
	$( '.character-player' ).height( gameState.player.height );
	$( '.character-player' ).css( 'left', gameState.player.x + 'px' );
	$( '.character-player' ).css( 'bottom', gameState.player.y + 'px' );

	$( '.character-enemy' ).width( gameState.enemy.width );
	$( '.character-enemy' ).height( gameState.enemy.height );
	$( '.character-enemy' ).css( 'left', gameState.enemy.x + 'px' );
	$( '.character-enemy' ).css( 'bottom', gameState.enemy.y + 'px' );

	$( '.healthbar-progress' ).css( 'width', gameState.enemy.health + '%' );
}

function loop(timestamp) {
	if (gameState.lastRenderTime === null) {
		gameState.lastRenderTime = timestamp;
	}

	var deltaTime = timestamp - gameState.lastRenderTime;

	update(deltaTime);
	draw();

	// Win / lose detection, return

	gameState.lastRenderTime = timestamp;
	window.requestAnimationFrame(loop);
}
