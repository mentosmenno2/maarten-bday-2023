var gameState = {
	level: {
		width: $( '.level' ).width(),
		height: $( '.level' ).height(),
	},
	lastRenderTime: null,
	bulletTimer: 0,
	player: {
		targetX: 0,
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		speed: 0,
		invulnerable: 0,
		health: 100,
		bullets: [],
	},
	enemy: {
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		speed: 0,
		invulnerable: 0,
		health: 100,
		bullets: [],
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
	$( document ).on( 'showChatMessage', onShowChatMessage );

	$( '.level' ).on( 'mousemove', onMouseMove );
	$( '.level' ).on( 'touchmove', onTouchMove );

	if ( gameOptions.players.length > 1 ) {
		$( document ).on( 'keydown', onKeyDown );
		$( document ).on( 'keyup', onKeyUp );
	}
}

function onShowChatMessage( event, index ) {
	if ( index === 0 ) {
		$presentElement = $( '<img class="present pixelated" als="" src="assets/images/present.png" />' );
		$presentElement.css( 'bottom', 0 );
		$presentElement.css( 'right', '30%' );
		$('.talker__container').append($presentElement);
	}

	if ( index === 3 ) {
		$('.present').css( 'right', 'calc(70% - ' + $('.present').width() + 'px)' );
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

		for (var index = 0; index < gameState.player.bullets.length; index++) {
			gameState.player.bullets[index].x *= gameState.level.width / oldWidth;
			gameState.player.bullets[index].y *= gameState.level.height / oldHeight;
		}

		for (var index = 0; index < gameState.enemy.bullets.length; index++) {
			gameState.enemy.bullets[index].x *= gameState.level.width / oldWidth;
			gameState.enemy.bullets[index].y *= gameState.level.height / oldHeight;
		}

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

	for (var index = 0; index < gameState.player.bullets.length; index++) {
		gameState.player.bullets[index].width = gameState.level.width * 0.05;
		gameState.player.bullets[index].height = gameState.level.height * 0.05;
	}

	for (var index = 0; index < gameState.enemy.bullets.length; index++) {
		gameState.enemy.bullets[index].width = gameState.level.width * 0.05;
		gameState.enemy.bullets[index].height = gameState.level.height * 0.05;
	}
}

function setGameObjectsSpeeds() {
	gameState.player.speed = 0.2 * ( gameState.level.height / 1000 );
	gameState.enemy.speed = 0.2 * ( gameState.level.height / 1000 );

	for (var index = 0; index < gameState.player.bullets.length; index++) {
		gameState.player.bullets[index].speed = 0.2 * ( gameState.level.height / 1000 );
	}

	for (var index = 0; index < gameState.enemy.bullets.length; index++) {
		gameState.enemy.bullets[index].speed = 0.2 * ( gameState.level.height / 1000 );
	}
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
	gameState.enemy.x = calculateNewGameObjectPositionX( gameState.enemy, deltaTime, gameOptions.players.length > 1 ? gameState.enemy.targetX : determineEnemyTargetX( deltaTime ) );
	if ( gameState.enemy.invulnerable > 0 ) {
		gameState.enemy.invulnerable -= deltaTime;
	}
	gameState.enemy.x = Math.max( 0, gameState.enemy.x );
	gameState.enemy.x = Math.min( gameState.level.width - gameState.enemy.width, gameState.enemy.x );

	// Move bullets
	gameState.player.bullets.forEach(( bullet, index ) => {
		bullet.y += deltaTime * bullet.speed;

		if ( bullet.y > gameState.level.height ) {
			bullet.$element.remove();
			gameState.player.bullets.splice(index, 1);
		}
	});
	gameState.enemy.bullets.forEach(( bullet, index ) => {
		bullet.y -= deltaTime * bullet.speed;

		if ( bullet.y < 0 - bullet.height ) {
			bullet.$element.remove();
			gameState.enemy.bullets.splice(index, 1);
		}
	});

	// Maybe create bullet
	gameState.bulletTimer = Math.max( 0, gameState.bulletTimer - deltaTime );
	if ( gameState.bulletTimer <= 0 ) {
		gameState.bulletTimer = 1000;

		var $bulletPlayerElement = $( '<div class="bullet bullet-player bullet-player-' + Date.now() + '"></div>' );
		gameState.player.bullets.push( {
			x: gameState.player.x,
			y: gameState.player.y + gameState.player.height,
			width: 0,
			height: 0,
			speed: 0,
			$element: $bulletPlayerElement
		} );
		$( '.level' ).append($bulletPlayerElement);

		var $bulletEnemyElement = $( '<div class="bullet bullet-enemy bullet-enemy-' + Date.now() + '"></div>' );
		gameState.enemy.bullets.push( {
			x: gameState.enemy.x,
			y: gameState.enemy.y - gameState.enemy.height,
			width: 0,
			height: 0,
			speed: 0,
			$element: $bulletEnemyElement,
		} );
		$( '.level' ).append($bulletEnemyElement);

		setGameObjectsSizes();
		setGameObjectsSpeeds();
	}

	// Check bullet hit player
	gameState.enemy.bullets.forEach(bullet => {
		if ( gameState.player.invulnerable <= 0 && gameObjectsHit( bullet, gameState.player ) ) {
			gameState.player.health -= 10;
			gameState.player.invulnerable = 1500;
			$( '.audio-effect-fail' )[0].pause();
			$( '.audio-effect-fail' )[0].currentTime = 0;
			$( '.audio-effect-fail' )[0].play();
		}
	});

	// Check bullet hit enemy
	gameState.player.bullets.forEach(bullet => {
		if ( gameState.enemy.invulnerable <= 0 && gameObjectsHit( bullet, gameState.enemy ) ) {
			gameState.enemy.health -= 10;
			gameState.enemy.invulnerable = 1500;
			$( '.audio-effect-fail' )[0].pause();
			$( '.audio-effect-fail' )[0].currentTime = 0;
			$( '.audio-effect-fail' )[0].play();
		}
	});
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

	// Healthbars
	$( '.healthbar-progress-player' ).css( 'width', gameState.player.health + '%' );
	$( '.healthbar-progress-enemy' ).css( 'width', gameState.enemy.health + '%' );

	// Bullets
	gameState.player.bullets.forEach(bullet => {
		bullet.$element.width( bullet.width );
		bullet.$element.height( bullet.height );
		bullet.$element.css( 'left', bullet.x + 'px' );
		bullet.$element.css( 'bottom', bullet.y + 'px' );
	});

	gameState.enemy.bullets.forEach(bullet => {
		bullet.$element.width( bullet.width );
		bullet.$element.height( bullet.height );
		bullet.$element.css( 'left', bullet.x + 'px' );
		bullet.$element.css( 'bottom', bullet.y + 'px' );
	});
}

function loop(timestamp) {
	if (gameState.lastRenderTime === null) {
		gameState.lastRenderTime = timestamp;
	}

	var deltaTime = timestamp - gameState.lastRenderTime;

	update(deltaTime);
	draw();

	if ( gameState.player.health <= 0 && gameState.enemy.health <= 0 ) {
		$( '.audio-music-ingame' )[0].pause();
		gameCompleted( -1 );
		return;
	} else if ( gameState.enemy.health <= 0 ) {
		$( '.audio-music-ingame' )[0].pause();

		$( '.audio-effect-rubberduck-1' )[0].pause();
		$( '.audio-effect-rubberduck-1' )[0].currentTime = 0;
		$( '.audio-effect-rubberduck-1' )[0].play();

		gameCompleted( 1 );
		return;
	} else if ( gameState.player.health <= 0 ) {
		$( '.audio-music-ingame' )[0].pause();

		$( '.audio-effect-rubberduck-2' )[0].pause();
		$( '.audio-effect-rubberduck-2' )[0].currentTime = 0;
		$( '.audio-effect-rubberduck-2' )[0].play();

		if ( gameOptions.players.length > 1 ) {
			gameCompleted( 2 );
		} else {
			gameCompleted( 0 );
		}
		return;
	}

	gameState.lastRenderTime = timestamp;
	window.requestAnimationFrame(loop);
}
