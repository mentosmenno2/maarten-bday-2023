var gameState = {
	width: $( '.level' ).width(),
	height: $( '.level' ).height(),
	lastRenderTime: null,
	player: {
		mouseX: 0,
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		speed: 0,
		invulnerable: 0,
		health: 100
	},
	enemy: {
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		speed: 0,
		invulnerable: 0,
		health: 100
	},
}

function initializeGame() {
	$( window ).on( 'resize', onResize );

	setGameObjectsSizes();
	setGameObjectsSpeeds();

	gameState.player.y = 10;
	gameState.enemy.y = gameState.level.height - gameState.player.height - 10;

	gameState.player.x = ( gameState.level.width / 2 ) - ( gameState.player.width / 2 );
	gameState.enemy.x = ( gameState.level.width / 2 ) - ( gameState.enemy.width / 2 );

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
	// Get old sizes before elements are resized
	var oldWidth = gameState.level.width;
	var oldHeight = gameState.level.height;

	// In a timeout, as browser first fires the resize event before redrawing elements.
	setTimeout(() => {
		gameState.level.width = $( '.level' ).width();
		gameState.level.height = $( '.level' ).height();

		setGameObjectsSizes();
		setGameObjectsSpeeds();

		gameState.player.x *= gameState.level.width / oldWidth;
		gameState.player.y *= gameState.level.height / oldHeight;
		gameState.enemy.x *= gameState.level.width / oldWidth;
		gameState.enemy.y *= gameState.level.height / oldHeight;

		draw();
	}, 1);
}

function setGameObjectsSizes() {
	gameState.player.width = gameState.level.width * 0.05;
	gameState.player.height = gameState.level.height * 0.05;
	gameState.player.y = 10;

	gameState.enemy.width = gameState.level.width * 0.05;
	gameState.enemy.height = gameState.level.height * 0.05;
	gameState.enemy.y = gameState.level.height - gameState.player.height - 10;
}

function setGameObjectsSpeeds() {
	gameState.player.speed = 0.2 * ( gameState.level.height / 1000 );
	gameState.enemy.speed = 0.2 * ( gameState.level.height / 1000 );
}

function update(deltaTime) {
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
