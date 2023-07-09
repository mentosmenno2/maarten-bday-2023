var gameState = {
	lastRenderTime: null,
	won: false,
	lost: false,
	player: {
		x: 0,
		y: 0,
		mouseX: 0,
		invulnerable: 0,
	},
	enemy: {
		x: ( $( '.level-ducky-dash' ).width() / 2 ) - ( $( '.character-enemy' ).width() / 2 ),
		y: 0,
		invulnerable: 0,
	},
	obstacles: [

	]
}

function initializeGame() {
	for (var index = 0; index < 10; index++) {
		gameState.obstacles.push ({
			x: 0,
			y: 0,
			active: false
		});
		resetObstacle(index);
		gameState.obstacles[index].y = index * $( '.obstacle' ).eq(index).width();
		gameState.obstacles[index].active = false;
	}

	addGameEventListeners();

	draw();
}

function addGameEventListeners() {
	$( '.level-ducky-dash' ).on( 'mousemove', onMouseMove );
	$( '.level-ducky-dash' ).on( 'touchmove', onTouchMove );
}

function startGame() {
	$( '.audio-music-ingame' )[0].play();
	window.requestAnimationFrame(loop);
}

function onMouseMove( event ) {
	var bounds = $( '.level-ducky-dash' )[0].getBoundingClientRect();
	gameState.player.mouseX = event.clientX - bounds.left;
}

function onTouchMove( event ) {
	event.preventDefault();
	var bounds = $( '.level-ducky-dash' )[0].getBoundingClientRect();
	gameState.player.mouseX = event.touches[0].clientX - bounds.left;
}

function update(progress) {
	// Move player
	gameState.player.x = gameState.player.mouseX - ( $( '.character-player' ).width() / 2 );
	if ( gameState.player.invulnerable > 0 ) {
		gameState.player.invulnerable -= progress;
	} else {
		gameState.player.y += progress * ( $( '.level-ducky-dash' ).height() / 50000 );
	}
	gameState.player.x = Math.max( 0, gameState.player.x );
	gameState.player.x = Math.min( $( '.level-ducky-dash' ).width() - $( '.character-player' ).width(), gameState.player.x );
	gameState.player.x = Math.round( gameState.player.x );
	gameState.player.y = Math.max( 0, gameState.player.y );
	gameState.player.y = Math.min( $( '.level-ducky-dash' ).height() - $( '.character-player' ).height(), gameState.player.y );
	gameState.player.y = Math.round( gameState.player.y );

	// Move enemy
	gameState.enemy.x += progress * ( Math.random() * ( ( Math.round( Date.now() / 1000 ) % 2 == 0 ) ? 1 : -1 ) ) / ( Math.random() * 20 );
	if ( gameState.enemy.invulnerable > 0 ) {
		gameState.enemy.invulnerable -= progress;
	} else {
		gameState.enemy.y += progress * ( $( '.level-ducky-dash' ).height() / 50000 );
	}
	gameState.enemy.x = Math.max( 0, gameState.enemy.x );
	gameState.enemy.x = Math.min( $( '.level-ducky-dash' ).width() - $( '.character-enemy' ).width(), gameState.enemy.x );
	gameState.enemy.x = Math.round( gameState.enemy.x );
	gameState.enemy.y = Math.max( 0, gameState.enemy.y );
	gameState.enemy.y = Math.min( $( '.level-ducky-dash' ).height() - $( '.character-enemy' ).height(), gameState.enemy.y );
	gameState.enemy.y = Math.round( gameState.enemy.y );

	// Move obstacles
	gameState.obstacles.forEach(( obstacle, index ) => {
		obstacle.y -= progress * ( $( '.level-ducky-dash' ).height() / 5000 );
		obstacle.y = Math.round( obstacle.y );

		if ( obstacle.y + $( '.obstacle' ).eq(index).height() < 0 ) {
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
			$( '.audio-effect-fail' )[0].play();
		}

		if ( obstacle.active && gameState.enemy.invulnerable <= 0 && boundingBoxesHit(
			$( '.character-enemy' )[0].getBoundingClientRect(),
			$( '.obstacle' ).eq(index)[0].getBoundingClientRect()
		) ) {
			gameState.enemy.invulnerable = 2000;
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
	gameState.obstacles[index] = {
		x: Math.random() * ( $( '.level-ducky-dash' ).width() - $( '.obstacle' ).eq(index).width() ),
		y: $( '.level-ducky-dash' ).height(),
		active: true,
	}
}

function boundingBoxesHit(rect1, rect2) {
	return !(rect1.right < rect2.left ||
		rect1.left > rect2.right ||
		rect1.bottom < rect2.top ||
		rect1.top > rect2.bottom)
}

function draw() {
	// Player
	var oldPlayerX = parseInt( $( '.character-player' ).css( 'left' ).replace( 'px', '' ) );
	$( '.character-player' ).css( 'left', Math.round( gameState.player.x ) + 'px' );
	if ( oldPlayerX < gameState.player.x ) {
		$( '.character-player img' ).addClass( 'flipped-horizontal' );
	} else if ( oldPlayerX > gameState.player.x ) {
		$( '.character-player img' ).removeClass( 'flipped-horizontal' );
	}

	$( '.character-player' ).css( 'bottom', Math.round( gameState.player.y ) + 'px' );
	if ( gameState.player.invulnerable > 0 ) {
		$( '.character-player' ).addClass( 'invulnerable' );
	} else {
		$( '.character-player' ).removeClass( 'invulnerable' );
	}

	// Characters
	var oldEnemyX = parseInt( $( '.character-enemy' ).css( 'left' ).replace( 'px', '' ) );
	$( '.character-enemy' ).css( 'left', Math.round( gameState.enemy.x ) + 'px' );
	if ( oldEnemyX < gameState.enemy.x ) {
		$( '.character-enemy img' ).addClass( 'flipped-horizontal' );
	} else if ( oldEnemyX > gameState.enemy.x ) {
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

	var progress = timestamp - gameState.lastRenderTime;

	update(progress);
	draw();

	if ( gameState.won ) {
		$( '.audio-effect-rubberduck2' )[0].play();
		setTimeout(() => {
			$( '.audio-music-ingame' )[0].pause();
			gameCompleted();
		}, 1000);
		return;
	} else if ( gameState.lost ) {
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
