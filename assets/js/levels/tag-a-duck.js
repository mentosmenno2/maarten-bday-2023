var gameState = {
	level: {
		width: $( '.level' ).width(),
		height: $( '.level' ).height(),
	},
	lastRenderTime: null,
	player1: {
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		speed: 0,
		targetX: 0,
		targetY: 0,
		tags: 0,
		didTagTimer: 0
	},
	player2: {
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		speed: 0,
		targetX: 0,
		targetY: 0,
		tags: 0,
		didTagTimer: 0
	},
	enemy: {
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		underground: ( Math.random() * 2000 ) + 1000,
		up: 0
	},
}

function initializeGame() {
	$( window ).on( 'resize', onResize );

	setGameObjectsSizes();
	setGameObjectsSpeeds();

	// Set default game object positions
	gameState.player1.x = ( gameState.level.width / 2 ) - ( gameState.player1.width / 2 );
	gameState.player1.y = ( gameState.level.height / 2 ) - ( gameState.player1.height / 2 ) - gameState.player1.height;
	gameState.player2.x = ( gameState.level.width / 2 ) - ( gameState.player2.width / 2 );
	gameState.player2.y = ( gameState.level.height / 2 ) - ( gameState.player2.height / 2 ) + gameState.player2.height;

	// Set default mouse positions
	gameState.player1.targetX = gameState.player1.x + ( gameState.player1.width / 2 );
	gameState.player1.targetY = gameState.player1.y + ( gameState.player1.height / 2 );
	gameState.player2.targetX = gameState.player2.x + ( gameState.player2.width / 2 );
	gameState.player2.targetY = gameState.player2.y + ( gameState.player2.height / 2 );

	randomizeEnemyPosition();
	draw();
}

function addGameEventListeners() {
	$( '.level' ).on( 'mousemove', onMouseMove );
	$( '.level' ).on( 'touchmove', onTouchMove );

	if ( gameOptions.players.length > 1 ) {
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
	gameState.player1.targetX = getPositionXFromMouseEvent( event, $( '.level' ) );
	gameState.player1.targetY = getPositionYFromMouseEvent( event, $( '.level' ) );
}

function onTouchMove( event ) {
	event.preventDefault();
	gameState.player1.targetX = getPositionXFromTouchEvent( event, $( '.level' ) );
	gameState.player1.targetY = getPositionYFromTouchEvent( event, $( '.level' ) );
}

function onKeyDown( event ) {
	registerHoldingButton( event.keyCode );
	var newPlayer2Target = getTargetFromKeys( gameState.player2, gameState.level );
	gameState.player2.targetX = newPlayer2Target.x;
	gameState.player2.targetY = newPlayer2Target.y;
}

function onKeyUp( event ) {
	unRegisterHoldingButton( event.keyCode );
	var newPlayer2Target = getTargetFromKeys( gameState.player2, gameState.level );
	gameState.player2.targetX = newPlayer2Target.x;
	gameState.player2.targetY = newPlayer2Target.y;
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

		gameState.player1.x *= gameState.level.width / oldWidth;
		gameState.player1.y *= gameState.level.height / oldHeight;
		gameState.player2.x *= gameState.level.width / oldWidth;
		gameState.player2.y *= gameState.level.height / oldHeight;
		gameState.enemy.x *= gameState.level.width / oldWidth;
		gameState.enemy.y *= gameState.level.height / oldHeight;

		draw();
	}, 1);
}

function randomizeEnemyPosition() {
	gameState.enemy = randomizeGameObjectPosition( gameState.enemy, gameState.level );
	while ( gameObjectsHit( gameState.player1, gameState.enemy ) ) {
		gameState.enemy = randomizeGameObjectPosition( gameState.enemy, gameState.level );
	}
}

function setGameObjectsSizes() {
	gameState.player1.width = gameState.level.width * 0.05;
	gameState.player1.height = gameState.level.height * 0.05;
	gameState.player2.width = gameState.level.width * 0.05;
	gameState.player2.height = gameState.level.height * 0.05;
	gameState.enemy.width = gameState.level.width * 0.05;
	gameState.enemy.height = gameState.level.height * 0.05;
}

function setGameObjectsSpeeds() {
	gameState.player1.speed = 0.5 * ( gameState.level.height / 1000 );
	gameState.player2.speed = 0.5 * ( gameState.level.height / 1000 );
	gameState.enemy.speed = 0.5 * ( gameState.level.height / 1000 );
}

function update(deltaTime) {
	if ( isHoldingButton() ) {
		var newPlayer2Target = getTargetFromKeys( gameState.player2, gameState.level );
		gameState.player2.targetX = newPlayer2Target.x;
		gameState.player2.targetY = newPlayer2Target.y;
	}

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

	// Update did tag timers
	gameState.player1.didTagTimer = Math.max( 0, gameState.player1.didTagTimer - deltaTime );
	gameState.player2.didTagTimer = Math.max( 0, gameState.player2.didTagTimer - deltaTime );

	// Move player 1
	var newPlayer1Position = calculateNewGameObjectPosition( gameState.player1, deltaTime, {
		x: gameState.player1.targetX,
		y: gameState.player1.targetY
	} );
	gameState.player1.x = newPlayer1Position.x;
	gameState.player1.y = newPlayer1Position.y;
	gameState.player1.x = Math.max( 0, gameState.player1.x );
	gameState.player1.x = Math.min( gameState.level.width - gameState.player1.width, gameState.player1.x );
	gameState.player1.y = Math.max( 0, gameState.player1.y );
	gameState.player1.y = Math.min( gameState.level.height - gameState.player1.height, gameState.player1.y );

	// Move player 2
	if ( gameOptions.players.length > 1 ) {
		var newPlayer2Position = calculateNewGameObjectPosition( gameState.player2, deltaTime, {
			x: gameState.player2.targetX,
			y: gameState.player2.targetY
		} );
		gameState.player2.x = newPlayer2Position.x;
		gameState.player2.y = newPlayer2Position.y;
		gameState.player2.x = Math.max( 0, gameState.player2.x );
		gameState.player2.x = Math.min( gameState.level.width - gameState.player2.width, gameState.player2.x );
		gameState.player2.y = Math.max( 0, gameState.player2.y );
		gameState.player2.y = Math.min( gameState.level.height - gameState.player2.height, gameState.player2.y );
	}

	// Check if hitting
	if ( gameState.enemy.underground <= 0 ) {
		var player1Hit = gameObjectsHit( gameState.player1, gameState.enemy );
		var player2Hit = gameObjectsHit( gameState.player2, gameState.enemy );
		if ( player1Hit || player2Hit ) {
			gameState.enemy.underground = ( Math.random() * 3000 ) + 1000;
			randomizeEnemyPosition();
			if ( player1Hit ) {
				gameState.player1.tags++;
				gameState.player1.didTagTimer = 500;
				$( '.audio-effect-rubberduck-1' )[0].pause();
				$( '.audio-effect-rubberduck-1' )[0].currentTime = 0;
				$( '.audio-effect-rubberduck-1' )[0].play();
			}
			if ( player2Hit ) {
				gameState.player2.tags++;
				gameState.player2.didTagTimer = 500;
				$( '.audio-effect-rubberduck-2' )[0].pause();
				$( '.audio-effect-rubberduck-2' )[0].currentTime = 0;
				$( '.audio-effect-rubberduck-2' )[0].play();
			}
		}
	}
}

function draw() {
	// Player 1
	$( '.character-player-1' ).width( gameState.player1.width );
	$( '.character-player-1' ).height( gameState.player1.height );

	var oldPlayerX = parseInt( $( '.character-player-1' ).css( 'left' ).replace( 'px', '' ) );
	$( '.character-player-1' ).css( 'left', Math.round( gameState.player1.x ) + 'px' );
	if ( oldPlayerX < Math.round( gameState.player1.x ) ) {
		$( '.character-player-1 img' ).addClass( 'flipped-horizontal' );
	} else if ( oldPlayerX > Math.round( gameState.player1.x ) ) {
		$( '.character-player-1 img' ).removeClass( 'flipped-horizontal' );
	}

	$( '.character-player-1' ).css( 'bottom', Math.round( gameState.player1.y ) + 'px' );
	if ( gameState.player1.didTagTimer > 0 ) {
		$( '.character-player-1' ).addClass( 'did-tag' );
	} else {
		$( '.character-player-1' ).removeClass( 'did-tag' );
	}
	$( '.progressbar-progress-1' ).css( 'width', ( gameState.player1.tags ) * 10 + '%' );

	// Player 2
	if ( gameOptions.players.length > 1 ) {
		$( '.character-player-2' ).width( gameState.player2.width );
		$( '.character-player-2' ).height( gameState.player2.height );

		var oldPlayerX = parseInt( $( '.character-player-2' ).css( 'left' ).replace( 'px', '' ) );
		$( '.character-player-2' ).css( 'left', Math.round( gameState.player2.x ) + 'px' );
		if ( oldPlayerX < Math.round( gameState.player2.x ) ) {
			$( '.character-player-2 img' ).addClass( 'flipped-horizontal' );
		} else if ( oldPlayerX > Math.round( gameState.player2.x ) ) {
			$( '.character-player-2 img' ).removeClass( 'flipped-horizontal' );
		}

		$( '.character-player-2' ).css( 'bottom', Math.round( gameState.player2.y ) + 'px' );
		if ( gameState.player2.didTagTimer > 0 ) {
			$( '.character-player-2' ).addClass( 'did-tag' );
		} else {
			$( '.character-player-2' ).removeClass( 'did-tag' );
		}
		$( '.progressbar-progress-2' ).css( 'width', ( gameState.player2.tags ) * 10 + '%' );
	} else {
		$( '.character-player-2' ).hide();
		$( '.progressbar-wrapper-2' ).hide();
	}

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
	if ( gameState.enemy.underground > 0 || gameState.enemy.up <= 0 ) {
		$( '.character-enemy' ).hide();
	} else {
		$( '.character-enemy' ).show();
	}

}

function loop(timestamp) {
	if (gameState.lastRenderTime === null) {
		gameState.lastRenderTime = timestamp;
	}

	var deltaTime = timestamp - gameState.lastRenderTime;

	update(deltaTime);
	draw();

	var winningTags = 10;
	if ( gameState.player1.tags >= winningTags || gameState.player2.tags >= winningTags ) {
		$( '.audio-music-ingame' )[0].pause();

		if ( gameState.player1.tags >= winningTags ) {
			$( '.audio-effect-rubberduck-1' )[0].pause();
			$( '.audio-effect-rubberduck-1' )[0].currentTime = 0;
			$( '.audio-effect-rubberduck-1' )[0].play();
		}

		if ( gameState.player2.tags >= winningTags ) {
			$( '.audio-effect-rubberduck-2' )[0].pause();
			$( '.audio-effect-rubberduck-2' )[0].currentTime = 0;
			$( '.audio-effect-rubberduck-2' )[0].play();
		}

		if ( gameState.player1.tags === gameState.player2.tags ) {
			gameCompleted( -1 );
		} else if ( gameState.player1.tags >= gameState.player2.tags ) {
			gameCompleted( 1 );
		} else {
			gameCompleted( 2 );
		}

		return;
	}

	gameState.lastRenderTime = timestamp;
	window.requestAnimationFrame(loop);
}
