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
		targetX: 0,
		invulnerable: 0,
		speed: 0,
		won: false
	},
	enemy: {
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		invulnerable: 0,
		speed: 0,
		won: false,
		targetX: 0,
		switchTargetPositionTimer: 0
	},
	obstacles: [

	]
}

function initializeGame() {
	$( window ).on( 'resize', onResize );

	// Create obstacle game objects
	for (var index = 0; index < 10; index++) {
		gameState.obstacles.push ({
			x: 0,
			y: 0,
			width: 0,
			height: 0,
			active: false,
			speed: 0
		});
	}

	setGameObjectsSizes();
	setGameObjectsSpeeds();

	// Set default game object positions
	gameState.player.x = ( gameState.level.width / 2 ) - gameState.enemy.width;
	gameState.enemy.x = ( gameState.level.width / 2 );

	// Set default mouse positions
	gameState.player.targetX = gameState.player.x + ( gameState.player.width / 2 );
	gameState.enemy.targetX = gameState.enemy.x + ( gameState.enemy.width / 2 );

	for (var index = 0; index < gameState.obstacles.length; index++) {
		resetObstacle(index);

		// Force position the fist time and force inactive
		gameState.obstacles[index].y = index * gameState.obstacles[index].width;
		gameState.obstacles[index].active = false;
	}

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

		for (var index = 0; index < gameState.obstacles.length; index++) {
			gameState.obstacles[index].x *= gameState.level.width / oldWidth;
			gameState.obstacles[index].y *= gameState.level.height / oldHeight;
		}

		draw();
	}, 1);
}

function setGameObjectsSizes() {
	gameState.player.width = gameState.level.width * 0.05;
	gameState.player.height = gameState.level.height * 0.05;
	gameState.enemy.width = gameState.level.width * 0.05;
	gameState.enemy.height = gameState.level.height * 0.05;

	for (var index = 0; index < gameState.obstacles.length; index++) {
		gameState.obstacles[index].width = gameState.level.width * 0.1;
		gameState.obstacles[index].height = gameState.level.height * 0.1;
	}
}

function setGameObjectsSpeeds() {
	gameState.player.speed = 0.2 * ( gameState.level.height / 1000 );
	gameState.enemy.speed = 0.2 * ( gameState.level.height / 1000 );

	for (var index = 0; index < gameState.obstacles.length; index++) {
		gameState.obstacles[index].speed = 0.2 * ( gameState.level.height / 1000 );
	}
}

function update(deltaTime) {
	// Move player
	gameState.player.x = calculateNewGameObjectPositionX( gameState.player, deltaTime, gameState.player.targetX );

	if ( gameState.player.invulnerable > 0 ) {
		gameState.player.invulnerable -= deltaTime;
	} else {
		gameState.player.y += deltaTime * ( gameState.level.height / 50000 );
	}
	gameState.player.x = Math.max( 0, gameState.player.x );
	gameState.player.x = Math.min( gameState.level.width - gameState.player.width, gameState.player.x );
	gameState.player.y = Math.max( 0, gameState.player.y );
	gameState.player.y = Math.min( gameState.level.height - gameState.player.height, gameState.player.y );

	// Move enemy
	gameState.enemy.x = calculateNewGameObjectPositionX( gameState.enemy, deltaTime, gameOptions.players > 1 ? gameState.enemy.targetX : determineEnemyTargetX( deltaTime ) );
	if ( gameState.enemy.invulnerable > 0 ) {
		gameState.enemy.invulnerable -= deltaTime;
	} else {
		gameState.enemy.y += deltaTime * ( gameState.level.height / 50000 );
	}
	gameState.enemy.x = Math.max( 0, gameState.enemy.x );
	gameState.enemy.x = Math.min( gameState.level.width - gameState.enemy.width, gameState.enemy.x );
	gameState.enemy.y = Math.max( 0, gameState.enemy.y );
	gameState.enemy.y = Math.min( gameState.level.height - gameState.enemy.height, gameState.enemy.y );

	// Move obstacles
	gameState.obstacles.forEach(( obstacle, index ) => {
		obstacle.y -= deltaTime * obstacle.speed;

		if ( obstacle.y + obstacle.height < 0 ) {
			resetObstacle(index);
		}
	});

	// Detect hits
	gameState.obstacles.forEach(( obstacle, index ) => {
		if ( obstacle.active && gameState.player.invulnerable <= 0 && boundingBoxesHit(
			$( '.character-player' )[0].getBoundingClientRect(),
			$( '.obstacle' ).eq(index)[0].getBoundingClientRect()
		) ) {
			gameState.player.invulnerable = 2000;
			$( '.audio-effect-fail' )[0].pause();
			$( '.audio-effect-fail' )[0].currentTime = 0;
			$( '.audio-effect-fail' )[0].play();
		}

		if ( obstacle.active && gameState.enemy.invulnerable <= 0 && boundingBoxesHit(
			$( '.character-enemy' )[0].getBoundingClientRect(),
			$( '.obstacle' ).eq(index)[0].getBoundingClientRect()
		) ) {
			gameState.enemy.invulnerable = 2000;
			$( '.audio-effect-fail' )[0].pause();
			$( '.audio-effect-fail' )[0].currentTime = 0;
			$( '.audio-effect-fail' )[0].play();
		}
	});

	// Detect finish
	if ( boundingBoxesHit( $( '.character-player' )[0].getBoundingClientRect(), $( '.finish' )[0].getBoundingClientRect() ) ) {
		gameState.player.won = true;
	}
	if ( boundingBoxesHit( $( '.character-enemy' )[0].getBoundingClientRect(), $( '.finish' )[0].getBoundingClientRect() ) ) {
		gameState.enemy.won = true;
	}
}

function resetObstacle(index) {
	gameState.obstacles[index].x = Math.random() * ( gameState.level.width - gameState.obstacles[index].width );
	gameState.obstacles[index].y = gameState.level.height,
	gameState.obstacles[index].active = true;
}

function determineEnemyTargetX( deltaTime ) {
	gameState.enemy.switchTargetPositionTimer = Math.max( 0, gameState.enemy.switchTargetPositionTimer - deltaTime );

	if ( gameState.enemy.switchTargetPositionTimer <= 0 ) {
		gameState.enemy.switchTargetPositionTimer = Math.random() * 1000;
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
	if ( gameState.player.invulnerable > 0 ) {
		$( '.character-player' ).addClass( 'invulnerable' );
	} else {
		$( '.character-player' ).removeClass( 'invulnerable' );
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
	if ( gameState.enemy.invulnerable > 0 ) {
		$( '.character-enemy' ).addClass( 'invulnerable' );
	} else {
		$( '.character-enemy' ).removeClass( 'invulnerable' );
	}

	// Obstacles
	gameState.obstacles.forEach((obstacle, index) => {
		$( '.obstacle' ).eq(index).width( obstacle.width );
		$( '.obstacle' ).eq(index).height( obstacle.height );
		$( '.obstacle' ).eq(index).css( 'left', Math.round( obstacle.x ) + 'px' );
		$( '.obstacle' ).eq(index).css( 'bottom', Math.round( obstacle.y ) + 'px' );
		if ( obstacle.active ) {
			$( '.obstacle' ).eq(index).show();
		} else {
			$( '.obstacle' ).eq(index).hide();
		}
	});
}

function loop(timestamp) {
	if (gameState.lastRenderTime === null) {
		gameState.lastRenderTime = timestamp;
	}

	var deltaTime = timestamp - gameState.lastRenderTime;

	update(deltaTime);
	draw();

	if ( gameState.player.won && gameState.enemy.won ) {
		$( '.audio-music-ingame' )[0].pause();
		gameCompleted( -1 );
		return;
	} else if ( gameState.player.won ) {
		$( '.audio-music-ingame' )[0].pause();

		$( '.audio-effect-rubberduck2' )[0].pause();
		$( '.audio-effect-rubberduck2' )[0].currentTime = 0;
		$( '.audio-effect-rubberduck2' )[0].play();

		gameCompleted( 1 );
		return;
	} else if ( gameState.enemy.won ) {
		$( '.audio-music-ingame' )[0].pause();

		$( '.audio-effect-rubberduck' )[0].pause();
		$( '.audio-effect-rubberduck' )[0].currentTime = 0;
		$( '.audio-effect-rubberduck' )[0].play();

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
