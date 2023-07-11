var gameState = {
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
	gameState.enemy.x = ( $( '.level-ducky-dash' ).width() / 2 ) - ( gameState.enemy.width / 2 );

	for (var index = 0; index < gameState.obstacles.length; index++) {
		resetObstacle(index);

		// Force position the fist time and force inactive
		gameState.obstacles[index].y = index * gameState.obstacles[index].width;
		gameState.obstacles[index].active = false;
	}

	draw();
}

function addGameEventListeners() {
	$( '.level-ducky-dash' ).on( 'mousemove', onMouseMove );
	$( '.level-ducky-dash' ).on( 'touchmove', onTouchMove );
}

function startGame() {
	addGameEventListeners();
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

function setGameObjectsSizes() {
	gameState.player.width = $( '.level-ducky-dash' ).width() * 0.05;
	gameState.player.height = $( '.level-ducky-dash' ).height() * 0.05;
	gameState.enemy.width = $( '.level-ducky-dash' ).width() * 0.05;
	gameState.enemy.height = $( '.level-ducky-dash' ).height() * 0.05;

	for (var index = 0; index < gameState.obstacles.length; index++) {
		gameState.obstacles[index].width = $( '.level-ducky-dash' ).width() * 0.1;
		gameState.obstacles[index].height = $( '.level-ducky-dash' ).height() * 0.1;
	}
}

function update(progress) {
	setGameObjectsSizes();

	// Move player
	gameState.player.x = gameState.player.mouseX - ( gameState.player.width / 2 );
	if ( gameState.player.invulnerable > 0 ) {
		gameState.player.invulnerable -= progress;
	} else {
		gameState.player.y += progress * ( $( '.level-ducky-dash' ).height() / 50000 );
	}
	gameState.player.x = Math.max( 0, gameState.player.x );
	gameState.player.x = Math.min( $( '.level-ducky-dash' ).width() - gameState.player.width, gameState.player.x );
	gameState.player.y = Math.max( 0, gameState.player.y );
	gameState.player.y = Math.min( $( '.level-ducky-dash' ).height() - gameState.player.height, gameState.player.y );

	// Move enemy
	gameState.enemy.x += progress * ( Math.random() * ( ( Math.round( Date.now() / 1000 ) % 2 == 0 ) ? 1 : -1 ) ) / ( Math.random() * 20 );
	if ( gameState.enemy.invulnerable > 0 ) {
		gameState.enemy.invulnerable -= progress;
	} else {
		gameState.enemy.y += progress * ( $( '.level-ducky-dash' ).height() / 50000 );
	}
	gameState.enemy.x = Math.max( 0, gameState.enemy.x );
	gameState.enemy.x = Math.min( $( '.level-ducky-dash' ).width() - gameState.enemy.width, gameState.enemy.x );
	gameState.enemy.y = Math.max( 0, gameState.enemy.y );
	gameState.enemy.y = Math.min( $( '.level-ducky-dash' ).height() - gameState.enemy.height, gameState.enemy.y );

	// Move obstacles
	gameState.obstacles.forEach(( obstacle, index ) => {
		obstacle.y -= progress * ( $( '.level-ducky-dash' ).height() / 5000 );

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
	gameState.obstacles[index].x = Math.random() * ( $( '.level-ducky-dash' ).width() - gameState.obstacles[index].width );
	gameState.obstacles[index].y = $( '.level-ducky-dash' ).height(),
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

	var progress = timestamp - gameState.lastRenderTime;

	update(progress);
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
