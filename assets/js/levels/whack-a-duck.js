var gameState = {
	lastRenderTime: null,
	player: {
		mouseX: 0,
		mouseY: 0,
		clicked: false,
	},
	enemy: {
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		underground: ( Math.random() * 2000 ) + 1000,
		up: 0,
		health: 100,
	},
}

function initializeGame() {
	setGameObjectsSizes();
	randomizeEnemyPosition();
	draw();
}

function addGameEventListeners() {
	$( '.level-whack-a-duck' ).on( 'click', onClick );
}

function startGame() {
	addGameEventListeners();
	$( '.audio-music-ingame' )[0].play();
	window.requestAnimationFrame(loop);
}

function onClick( event ) {
	var mousePosition = getPositionFromMouseEvent( event, $( '.level-whack-a-duck' ) );
	gameState.player.mouseX = mousePosition.x;
	gameState.player.mouseY = mousePosition.y;
	gameState.player.clicked = true;
}

function randomizeEnemyPosition() {
	gameState.enemy = randomizeGameObjectPosition( gameState.enemy, $( '.level-whack-a-duck' ) );

	while ( mouseHitsEnemy() ) {
		gameState.enemy = randomizeGameObjectPosition( gameState.enemy, $( '.level-whack-a-duck' ) );
	}
}

function setGameObjectsSizes() {
	gameState.enemy.width = $( '.level-whack-a-duck' ).width() * 0.05;
	gameState.enemy.height = $( '.level-whack-a-duck' ).height() * 0.05;
}

function update(deltaTime) {
	setGameObjectsSizes();

	// Go underground if not up anymore
	gameState.enemy.up = Math.max( 0, gameState.enemy.up - deltaTime );
	if ( gameState.enemy.up <= 0 && gameState.enemy.underground <= 0 ) {
		gameState.enemy.underground = ( Math.random() * 3000 ) + 1000;
		randomizeEnemyPosition();
	}

	// Go up if not undergroun anymore
	gameState.enemy.underground = Math.max( 0, gameState.enemy.underground - deltaTime );
	if ( gameState.enemy.underground <= 0 && gameState.enemy.up <= 0 ) {
		gameState.enemy.up = ( Math.random() * 1000 ) + 1000;
	}

	// Check if clicked
	if ( gameState.player.clicked ) {
		gameState.player.clicked = false;

		if ( mouseHitsEnemy() && gameState.enemy.underground <= 0 ) {
			gameState.enemy.underground = ( Math.random() * 3000 ) + 1000;
			randomizeEnemyPosition();
			gameState.enemy.health -= 10;
			$( '.audio-effect-rubberduck' )[0].pause();
			$( '.audio-effect-rubberduck' )[0].currentTime = 0;
			$( '.audio-effect-rubberduck' )[0].play();
		} else {
			$( '.audio-effect-fail' )[0].pause();
			$( '.audio-effect-fail' )[0].currentTime = 0;
			$( '.audio-effect-fail' )[0].play();
		}
	}
}

function mouseHitsEnemy() {
	return getGameObjectTouchesPosition( gameState.enemy, gameState.player.mouseX, gameState.player.mouseY );
}

function draw() {
	$( '.character-enemy' ).width( gameState.enemy.width );
	$( '.character-enemy' ).height( gameState.enemy.height );
	$( '.character-enemy' ).css( 'left', gameState.enemy.x + 'px' );
	$( '.character-enemy' ).css( 'bottom', gameState.enemy.y + 'px' );
	if ( gameState.enemy.underground > 0 || gameState.enemy.up <= 0 ) {
		$( '.character-enemy' ).hide();
	} else {
		$( '.character-enemy' ).show();
	}

	$( '.healthbar-progress' ).css( 'width', gameState.enemy.health + '%' );
}

function loop(timestamp) {
	if (gameState.lastRenderTime === null) {
		gameState.lastRenderTime = timestamp;
	}

	var deltaTime = timestamp - gameState.lastRenderTime;

	update(deltaTime);
	draw();

	if ( gameState.enemy.health <= 0 ) {
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
