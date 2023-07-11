var gameState = {
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
	setGameObjectsSizesAndYPosition();
	gameState.player.x = ( $( '.level-quack-vs-quack' ).width() / 2 ) - ( gameState.player.width / 2 );
	gameState.enemy.x = ( $( '.level-quack-vs-quack' ).width() / 2 ) - ( gameState.enemy.width / 2 );

	draw();
}

function addGameEventListeners() {
	$( '.level-quack-vs-quack' ).on( 'mousemove', onMouseMove );
	$( '.level-quack-vs-quack' ).on( 'touchmove', onTouchMove );
}

function startGame() {
	addGameEventListeners();
	$( '.audio-music-ingame' )[0].play();
	window.requestAnimationFrame(loop);
}

function onMouseMove( event ) {
	var bounds = $( '.level-quack-vs-quack' )[0].getBoundingClientRect();
	gameState.player.mouseX = event.clientX - bounds.left;
}

function onTouchMove( event ) {
	event.preventDefault();
	var bounds = $( '.level-quack-vs-quack' )[0].getBoundingClientRect();
	gameState.player.mouseX = event.touches[0].clientX - bounds.left;
}

function setGameObjectsSizesAndYPosition() {
	gameState.player.width = $( '.level-quack-vs-quack' ).width() * 0.05;
	gameState.player.height = $( '.level-quack-vs-quack' ).height() * 0.05;
	gameState.player.y = 10;

	gameState.enemy.width = $( '.level-quack-vs-quack' ).width() * 0.05;
	gameState.enemy.height = $( '.level-quack-vs-quack' ).height() * 0.05;
	gameState.enemy.y = $( '.level-quack-vs-quack' ).height() - gameState.player.height - 10;
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
