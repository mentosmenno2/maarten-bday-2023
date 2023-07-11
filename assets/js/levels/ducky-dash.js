var gameState = {
	width: $( '.level' ).width(),
	height: $( '.level' ).height(),
	resizeTimeout: null,
	lastRenderTime: null,
	won: false,
	lost: false,
	player: {
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		mouseX: 0,
		invulnerable: 0,
		speed: 0.2
	},
	enemy: {
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		invulnerable: 0,
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
			active: false
		});
	}

	setGameObjectsSizes();

	// Set default game object positions
	gameState.enemy.x = ( gameState.width / 2 ) - ( gameState.enemy.width / 2 );

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
}

function startGame() {
	addGameEventListeners();
	$( '.audio-music-ingame' )[0].play();
	window.requestAnimationFrame(loop);
}

function onMouseMove( event ) {
	gameState.player.mouseX = getPositionXFromMouseEvent( event, $( '.level' ) );
}

function onTouchMove( event ) {
	event.preventDefault();
	gameState.player.mouseX = getPositionXFromTouchEvent( event, $( '.level' ) );
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
		gameState.width = $( '.level' ).width();
		gameState.height = $( '.level' ).height();

		setGameObjectsSizes();

		gameState.player.x *= gameState.width / oldWidth;
		gameState.player.y *= gameState.height / oldHeight;
		gameState.enemy.x *= gameState.width / oldWidth;
		gameState.enemy.y *= gameState.height / oldHeight;

		for (var index = 0; index < gameState.obstacles.length; index++) {
			gameState.obstacles[index].x *= gameState.width / oldWidth;
			gameState.obstacles[index].y *= gameState.height / oldHeight;
		}

		draw();
	}, 1);
}

function setGameObjectsSizes() {
	gameState.player.width = gameState.width * 0.05;
	gameState.player.height = gameState.height * 0.05;
	gameState.enemy.width = gameState.width * 0.05;
	gameState.enemy.height = gameState.height * 0.05;

	for (var index = 0; index < gameState.obstacles.length; index++) {
		gameState.obstacles[index].width = gameState.width * 0.1;
		gameState.obstacles[index].height = gameState.height * 0.1;
	}
}

function update(deltaTime) {
	setGameObjectsSizes();

	// Move player
	gameState.player.x = calculateNewGameObjectPositionX( gameState.player, deltaTime, gameState.player.mouseX );

	if ( gameState.player.invulnerable > 0 ) {
		gameState.player.invulnerable -= deltaTime;
	} else {
		gameState.player.y += deltaTime * ( gameState.height / 50000 );
	}
	gameState.player.x = Math.max( 0, gameState.player.x );
	gameState.player.x = Math.min( gameState.width - gameState.player.width, gameState.player.x );
	gameState.player.y = Math.max( 0, gameState.player.y );
	gameState.player.y = Math.min( gameState.height - gameState.player.height, gameState.player.y );

	// Move enemy
	gameState.enemy.x += deltaTime * ( Math.random() * ( ( Math.round( Date.now() / 1000 ) % 2 == 0 ) ? 1 : -1 ) ) / ( Math.random() * 20 );
	if ( gameState.enemy.invulnerable > 0 ) {
		gameState.enemy.invulnerable -= deltaTime;
	} else {
		gameState.enemy.y += deltaTime * ( gameState.height / 50000 );
	}
	gameState.enemy.x = Math.max( 0, gameState.enemy.x );
	gameState.enemy.x = Math.min( gameState.width - gameState.enemy.width, gameState.enemy.x );
	gameState.enemy.y = Math.max( 0, gameState.enemy.y );
	gameState.enemy.y = Math.min( gameState.height - gameState.enemy.height, gameState.enemy.y );

	// Move obstacles
	gameState.obstacles.forEach(( obstacle, index ) => {
		obstacle.y -= deltaTime * ( gameState.height / 5000 );

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
		gameState.won = true;
	} else if ( boundingBoxesHit( $( '.character-enemy' )[0].getBoundingClientRect(), $( '.finish' )[0].getBoundingClientRect() ) ) {
		gameState.lost = true;
	}
}

function resetObstacle(index) {
	gameState.obstacles[index].x = Math.random() * ( gameState.width - gameState.obstacles[index].width );
	gameState.obstacles[index].y = gameState.height,
	gameState.obstacles[index].active = true;
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

	if ( gameState.won ) {
		$( '.audio-effect-rubberduck2' )[0].pause();
		$( '.audio-effect-rubberduck2' )[0].currentTime = 0;
		$( '.audio-effect-rubberduck2' )[0].play();
		setTimeout(() => {
			$( '.audio-music-ingame' )[0].pause();
			gameCompleted();
		}, 1000);
		return;
	} else if ( gameState.lost ) {
		$( '.audio-effect-rubberduck1' )[0].pause();
		$( '.audio-effect-rubberduck1' )[0].currentTime = 0;
		$( '.audio-effect-rubberduck1' )[0].play();

		setTimeout(() => {
			$( '.audio-music-ingame' )[0].pause();
			window.location.reload();
		}, 1000);
		return;
	}

	gameState.lastRenderTime = timestamp;
	window.requestAnimationFrame(loop);
}
