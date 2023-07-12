var gameState = {
	level: {
		width: $( '.level' ).width(),
		height: $( '.level' ).height(),
	},
	lastRenderTime: null,
	player: {
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		speed: 0,
		mouseX: 0,
		mouseY: 0,
		tags: 0,
	},
	enemy: {
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		underground: ( Math.random() * 2000 ) + 1000,
		up: 0,
	},
}

function initializeGame() {
	$( window ).on( 'resize', onResize );

	setGameObjectsSizes();
	setGameObjectsSpeeds();

	// Set default game object positions
	gameState.player.x = ( gameState.level.width / 2 ) - ( gameState.player.width / 2 );
	gameState.player.y = ( gameState.level.height / 2 ) - ( gameState.player.height / 2 );
	randomizeEnemyPosition();
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
	gameState.player.mouseX = getPositionXFromMouseEvent( event, $( '.level' ) );
	gameState.player.mouseY = getPositionYFromMouseEvent( event, $( '.level' ) );
}

function onTouchMove( event ) {
	event.preventDefault();
	gameState.player.mouseX = getPositionXFromTouchEvent( event, $( '.level' ) );
	gameState.player.mouseY = getPositionYFromTouchEvent( event, $( '.level' ) );
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

function randomizeEnemyPosition() {
	gameState.enemy = randomizeGameObjectPosition( gameState.enemy, gameState.level );
	while ( gameObjectsHit( gameState.player, gameState.enemy ) ) {
		gameState.enemy = randomizeGameObjectPosition( gameState.enemy, gameState.level );
	}
}

function setGameObjectsSizes() {
	gameState.player.width = gameState.level.width * 0.05;
	gameState.player.height = gameState.level.height * 0.05;
	gameState.enemy.width = gameState.level.width * 0.05;
	gameState.enemy.height = gameState.level.height * 0.05;
}

function setGameObjectsSpeeds() {
	gameState.player.speed = 0.5 * ( gameState.level.height / 1000 );
	gameState.enemy.speed = 0.5 * ( gameState.level.height / 1000 );
}

function update(deltaTime) {
	// Go underground if not up anymore
	gameState.enemy.up = Math.max( 0, gameState.enemy.up - deltaTime );
	if ( gameState.enemy.up <= 0 && gameState.enemy.underground <= 0 ) {
		gameState.enemy.underground = ( Math.random() * 3000 ) + 1000;
		randomizeEnemyPosition();
	}

	// Go up if not undergroun anymore
	gameState.enemy.underground = Math.max( 0, gameState.enemy.underground - deltaTime );
	if ( gameState.enemy.underground <= 0 && gameState.enemy.up <= 0 ) {
		gameState.enemy.up = ( Math.random() * 1000 ) + 2000;
	}

	// Move player
	var newPlayerPosition = calculateNewGameObjectPosition( gameState.player, deltaTime, {
		x: gameState.player.mouseX,
		y: gameState.player.mouseY
	} );
	gameState.player.x = newPlayerPosition.x;
	gameState.player.y = newPlayerPosition.y;
	gameState.player.x = Math.max( 0, gameState.player.x );
	gameState.player.x = Math.min( gameState.level.width - gameState.player.width, gameState.player.x );
	gameState.player.y = Math.max( 0, gameState.player.y );
	gameState.player.y = Math.min( gameState.level.height - gameState.player.height, gameState.player.y );

	// Check if hitting
	if ( gameObjectsHit( gameState.player, gameState.enemy ) && gameState.enemy.underground <= 0 ) {
		gameState.enemy.underground = ( Math.random() * 3000 ) + 1000;
		randomizeEnemyPosition();
		gameState.player.tags++;
		$( '.audio-effect-rubberduck' )[0].pause();
		$( '.audio-effect-rubberduck' )[0].currentTime = 0;
		$( '.audio-effect-rubberduck' )[0].play();
	}
}

function draw() {
	// Player
	$( '.character-player' ).width( gameState.player.width );
	$( '.character-player' ).height( gameState.player.height );
	$( '.character-player' ).css( 'left', gameState.player.x + 'px' );
	$( '.character-player' ).css( 'bottom', gameState.player.y + 'px' );

	// Enemy
	$( '.character-enemy' ).width( gameState.enemy.width );
	$( '.character-enemy' ).height( gameState.enemy.height );
	$( '.character-enemy' ).css( 'left', gameState.enemy.x + 'px' );
	$( '.character-enemy' ).css( 'bottom', gameState.enemy.y + 'px' );
	if ( gameState.enemy.underground > 0 || gameState.enemy.up <= 0 ) {
		$( '.character-enemy' ).hide();
	} else {
		$( '.character-enemy' ).show();
	}

	// Progress bar
	$( '.progressbar-progress' ).css( 'width', ( gameState.player.tags ) * 10 + '%' );
}

function loop(timestamp) {
	if (gameState.lastRenderTime === null) {
		gameState.lastRenderTime = timestamp;
	}

	var deltaTime = timestamp - gameState.lastRenderTime;

	update(deltaTime);
	draw();

	if ( gameState.enemy.tags >= 10 ) {
		$( '.audio-effect-rubberduck2' )[0].pause();
		$( '.audio-effect-rubberduck2' )[0].currentTime = 0;
		$( '.audio-effect-rubberduck2' )[0].play();
		setTimeout(() => {
			$( '.audio-music-ingame' )[0].pause();
			gameCompleted();
		}, 1000);
		return;
	}

	gameState.lastRenderTime = timestamp;
	window.requestAnimationFrame(loop);
}
