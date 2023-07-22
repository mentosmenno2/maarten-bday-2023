var gameState = {
	level: {
		width: $( '.level' ).width(),
		height: $( '.level' ).height(),
	},
	lastRenderTime: null,
	player: {
		targetX: 0,
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		speed: 0,
		points: 0,
	},
	enemy: {
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		speed: 0,
		points: 0,
		targetX: 0,
		switchTargetPositionTimer: 0
	},
}

function initializeGame() {
	$( window ).on( 'resize', onResize );

	setGameObjectsSizes();
	setGameObjectsSpeeds();

	// Set defaut game object positions
	gameState.player.x = ( gameState.level.width / 2 ) - ( gameState.player.width / 2 );
	gameState.player.y = 10;
	gameState.enemy.x = ( gameState.level.width / 2 ) - ( gameState.enemy.width / 2 );
	gameState.enemy.y = gameState.level.height - gameState.enemy.height - 10;

	// Set default mouse positions
	gameState.player.targetX = gameState.player.x + ( gameState.player.width / 2 );
	gameState.enemy.targetX = gameState.enemy.x + ( gameState.enemy.width / 2 );

	draw();
}

function addGameEventListeners() {
	$( '.level' ).on( 'mousemove', onMouseMove );
	$( '.level' ).on( 'touchmove', onTouchMove );

	if ( gameOptions.players > 1 ) {
		$( document ).on( 'keydown', onKeyDown );
		$( document ).on( 'keyup', onKeyUp );
	}
}

function startGame() {
	addGameEventListeners();
	$( '.audio-music-ingame' )[0].play();
	window.requestAnimationFrame(loop);
}

function onMouseMove( event ) {
	gameState.player.targetX = getPositionXFromMouseEvent( event, $( '.level' ) );
}

function onTouchMove( event ) {
	event.preventDefault();
	gameState.player.targetX = getPositionXFromTouchEvent( event, $( '.level' ) );
}

function onKeyDown( event ) {
	registerHoldingButton( event.keyCode );
	gameState.enemy.targetX = getTargetXFromKeys( gameState.enemy, gameState.level );
}

function onKeyUp( event ) {
	unRegisterHoldingButton( event.keyCode );
	gameState.enemy.targetX = getTargetXFromKeys( gameState.enemy, gameState.level );
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
	gameState.player.x = calculateNewGameObjectPositionX( gameState.player, deltaTime, gameState.player.targetX );

	if ( gameState.player.invulnerable > 0 ) {
		gameState.player.invulnerable -= deltaTime;
	}
	gameState.player.x = Math.max( 0, gameState.player.x );
	gameState.player.x = Math.min( gameState.level.width - gameState.player.width, gameState.player.x );

	// Move enemy
	gameState.enemy.x = calculateNewGameObjectPositionX( gameState.enemy, deltaTime, gameOptions.players > 1 ? gameState.enemy.targetX : determineEnemyTargetX( deltaTime ) );
	if ( gameState.enemy.invulnerable > 0 ) {
		gameState.enemy.invulnerable -= deltaTime;
	}
	gameState.enemy.x = Math.max( 0, gameState.enemy.x );
	gameState.enemy.x = Math.min( gameState.level.width - gameState.enemy.width, gameState.enemy.x );

	// Check ball out of bounds

}

function determineEnemyTargetX( deltaTime ) {
	gameState.enemy.switchTargetPositionTimer = Math.max( 0, gameState.enemy.switchTargetPositionTimer - deltaTime );

	if ( gameState.enemy.switchTargetPositionTimer <= 0 ) {
		gameState.enemy.switchTargetPositionTimer = gameState.enemy.switchTargetPositionTimer = Math.random() * 1000;
		gameState.enemy.targetX = Math.random() * gameState.level.width;
		return gameState.enemy.targetX;
	}

	return gameState.enemy.targetX;
}

function draw() {
	// Player
	$( '.character-player' ).width( gameState.player.width );
	$( '.character-player' ).height( gameState.player.height );

	var oldPlayerX = parseInt( $( '.character-player' ).css( 'left' ).replace( 'px', '' ) );
	$( '.character-player' ).css( 'left', Math.round( gameState.player.x ) + 'px' );
	if ( oldPlayerX < Math.round( gameState.player.x ) ) {
		$( '.character-player img' ).addClass( 'flipped-horizontal' );
	} else if ( oldPlayerX > Math.round( gameState.player.x ) ) {
		$( '.character-player img' ).removeClass( 'flipped-horizontal' );
	}

	$( '.character-player' ).css( 'bottom', Math.round( gameState.player.y ) + 'px' );

	// Enemy
	$( '.character-enemy' ).width( gameState.enemy.width );
	$( '.character-enemy' ).height( gameState.enemy.height );

	var oldEnemyX = parseInt( $( '.character-enemy' ).css( 'left' ).replace( 'px', '' ) );
	$( '.character-enemy' ).css( 'left', Math.round( gameState.enemy.x ) + 'px' );
	if ( oldEnemyX < Math.round( gameState.enemy.x ) ) {
		$( '.character-enemy img' ).addClass( 'flipped-horizontal' );
	} else if ( oldEnemyX > Math.round( gameState.enemy.x ) ) {
		$( '.character-enemy img' ).removeClass( 'flipped-horizontal' );
	}

	// Points
	$( '.score-progress-player' ).text( gameState.player.points );
	$( '.score-progress-enemy' ).text( gameState.enemy.points );
}

function loop(timestamp) {
	if (gameState.lastRenderTime === null) {
		gameState.lastRenderTime = timestamp;
	}

	var deltaTime = timestamp - gameState.lastRenderTime;

	update(deltaTime);
	draw();

	if ( gameState.player.score >= 5 && gameState.enemy.score >= 5 ) {
		$( '.audio-music-ingame' )[0].pause();
		gameCompleted( -1 );
		return;
	} else if ( gameState.enemy.score >= 5 ) {
		$( '.audio-music-ingame' )[0].pause();

		$( '.audio-effect-rubberduck-1' )[0].pause();
		$( '.audio-effect-rubberduck-1' )[0].currentTime = 0;
		$( '.audio-effect-rubberduck-1' )[0].play();

		gameCompleted( 1 );
		return;
	} else if ( gameState.player.score >= 5 ) {
		$( '.audio-music-ingame' )[0].pause();

		$( '.audio-effect-rubberduck-2' )[0].pause();
		$( '.audio-effect-rubberduck-2' )[0].currentTime = 0;
		$( '.audio-effect-rubberduck-2' )[0].play();

		if ( gameOptions.players > 1 ) {
			gameCompleted( 2 );
		} else {
			gameCompleted( 0 );
		}
		return;
	}

	gameState.lastRenderTime = timestamp;
	window.requestAnimationFrame(loop);
}
