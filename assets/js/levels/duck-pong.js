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
		score: 0,
		hittingBall: false,
	},
	enemy: {
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		speed: 0,
		score: 0,
		targetX: 0,
		hittingBall: false,
		switchTargetPositionTimer: 0
	},
	ball: {
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		speedX: 0,
		speedY: 0,
		moveTimer: 0,
	}
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

	resetBall();

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

		gameState.ball.x *= gameState.level.width / oldWidth;
		gameState.ball.y *= gameState.level.height / oldHeight;
		gameState.ball.speedX *= gameState.level.width / oldWidth;
		gameState.ball.speedY *= gameState.level.width / oldWidth;

		draw();
	}, 1);
}

function setGameObjectsSizes() {
	gameState.player.width = gameState.level.height * 0.05 * 3;
	gameState.player.height = gameState.level.height * 0.05 * ( 28 / 24 );
	gameState.player.y = 10;

	gameState.enemy.width = gameState.level.height * 0.05 * 3;
	gameState.enemy.height = gameState.level.height * 0.05 * ( 28 / 24 );
	gameState.enemy.y = gameState.level.height - gameState.player.height - 10;

	gameState.ball.width = gameState.level.height * 0.02;
	gameState.ball.height = gameState.level.height * 0.02;
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

	// Move ball
	gameState.ball.moveTimer = Math.max( 0, gameState.ball.moveTimer - deltaTime );
	if ( gameState.ball.moveTimer <= 0 ) {
		gameState.ball.x += gameState.ball.speedX * deltaTime;
		gameState.ball.y += gameState.ball.speedY * deltaTime;
	}

	if ( gameState.ball.x > gameState.level.width - gameState.ball.width ) {
		gameState.ball.speedX *= -1;
	}
	if ( gameState.ball.x < 0 ) {
		gameState.ball.speedX *= -1;
	}

	// Ball hitting character
	if ( gameObjectsHit( gameState.ball, gameState.player ) ) {
		if ( ! gameState.player.hittingBall ) {
			gameState.ball.speedX = determineBallSpeedX( gameState.player );
			gameState.ball.speedY *= -1;
			gameState.ball.speedY *= 1 + (0.05 * ( gameState.level.height / 1000 ));
		}
		gameState.player.hittingBall = true;
	} else {
		gameState.player.hittingBall = false;
	}

	if ( gameObjectsHit( gameState.ball, gameState.enemy ) ) {
		if ( ! gameState.enemy.hittingBall ) {
			gameState.ball.speedX = determineBallSpeedX( gameState.enemy );
			gameState.ball.speedY *= -1;
			gameState.ball.speedY *= 1 + (0.05 * ( gameState.level.height / 1000 ));
		}
		gameState.enemy.hittingBall = true;
	} else {
		gameState.enemy.hittingBall = false;
	}

	// Check ball out of bounds
	if ( gameState.ball.y > gameState.level.height ) {
		gameState.player.score++;
		$( '.audio-effect-fail' )[0].pause();
		$( '.audio-effect-fail' )[0].currentTime = 0;
		$( '.audio-effect-fail' )[0].play();
		resetBall();
	}
	if ( gameState.ball.y + gameState.ball.height < 0 ) {
		gameState.enemy.score++;
		$( '.audio-effect-fail' )[0].pause();
		$( '.audio-effect-fail' )[0].currentTime = 0;
		$( '.audio-effect-fail' )[0].play();
		resetBall();
	}
}

function determineEnemyTargetX( deltaTime ) {
	var centerBallX = gameState.ball.x + ( gameState.ball.width / 2 );

	// If ball going to player, move to center
	if ( gameState.ball.speedY < 0 ) {
		return gameState.level.width / 2;
	}

	// If ball going to enemy, move 25% ahead of current ball X
	if ( gameState.ball.speedX < 0 ) {
		return centerBallX - ( gameState.enemy.width / 2 );
	} else if ( gameState.ball.speedX > 0 ) {
		return centerBallX + ( gameState.enemy.width / 2 );
	}
	return centerBallX;
}

function determineBallSpeedX( playableGameObject ) {
	var centerBallX = gameState.ball.x + ( gameState.ball.width / 2 );
	var percentage = ( centerBallX - playableGameObject.x - ( playableGameObject.width / 2 ) ) / ( playableGameObject.width - ( playableGameObject.width / 2 ) );
	return percentage * 0.4 * ( gameState.level.height / 1000 );
}

function resetBall() {
	gameState.ball.x = ( gameState.level.width / 2 ) - ( gameState.ball.width / 2 );
	gameState.ball.y = ( gameState.level.height / 2 ) - ( gameState.ball.height / 2 );
	gameState.ball.moveTimer = 3000;
	gameState.ball.speedX = Math.random() * 0.4 * ( gameState.level.height / 1000 );
	gameState.ball.speedX *= Math.round( Math.random() ) ? 1 : -1;
	gameState.ball.speedY = 0.2 * ( gameState.level.height / 1000 );
	gameState.ball.speedY *= Math.round( Math.random() ) ? 1 : -1;
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

	$( '.character-enemy' ).css( 'bottom', Math.round( gameState.enemy.y ) + 'px' );

	// Ball
	$( '.ball' ).width( gameState.ball.width );
	$( '.ball' ).height( gameState.ball.height );
	$( '.ball' ).css( 'left', Math.round( gameState.ball.x ) + 'px' );
	$( '.ball' ).css( 'bottom', Math.round( gameState.ball.y ) + 'px' );

	// Score
	$( '.score-progress-player' ).text( gameState.player.score );
	$( '.score-progress-enemy' ).text( gameState.enemy.score );

	// Countdown
	$( '.countdown' ).text( gameState.ball.moveTimer <= 0 ? '' : Math.ceil( gameState.ball.moveTimer / 1000 ) );
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
	} else if ( gameState.player.score >= 5 ) {
		$( '.audio-music-ingame' )[0].pause();

		$( '.audio-effect-rubberduck-1' )[0].pause();
		$( '.audio-effect-rubberduck-1' )[0].currentTime = 0;
		$( '.audio-effect-rubberduck-1' )[0].play();

		gameCompleted( 1 );
		return;
	} else if ( gameState.enemy.score >= 5 ) {
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
