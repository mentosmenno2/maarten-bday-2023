var gameState = {
	level: {
		width: $( '.level' ).width(),
		height: $( '.level' ).height(),
	},
	finished: false,
	player: {
		isTurn: false,
		buttons: [],
	},
	enemy: {
		isTurn: false,
		buttons: [],
		selectedButton: 1,
	}
}

function initializeGame() {
	$( window ).on( 'resize', onResize );

	if ( Math.round( Math.random() ) ) {
		gameState.player.isTurn = true;
		gameState.enemy.isTurn = false;
	} else {
		gameState.player.isTurn = false;
		gameState.enemy.isTurn = true;
	}

	$( '.turn-text-none' ).show();
}

function addGameEventListeners() {
	$( '.button-spot' ).on( 'click', onButtonClick );

	if ( gameOptions.players.length > 1 ) {
		$( document ).on( 'keyup', onKeyUp );
	}
}

function startGame() {
	addGameEventListeners();
	$( '.audio-music-ingame' )[0].play();

	switchTurns();
}

function onButtonClick( event ) {
	if ( ! gameState.player.isTurn ) {
		$( this ).blur();
		return;
	}

	onButtonChosen( $( this ) );
}

function onKeyUp( event ) {
	if ( ! gameState.enemy.isTurn || gameOptions.players.length == 1 ) {
		return;
	}

	if ( [37, 65].includes( event.keyCode ) ) { // Left
		if ( gameState.enemy.selectedButton % 3 !== 1 ) {
			gameState.enemy.selectedButton = gameState.enemy.selectedButton - 1;
		}
	}

	if ( [39, 68].includes( event.keyCode ) ) { // Right
		if ( gameState.enemy.selectedButton % 3 !== 0 ) {
			gameState.enemy.selectedButton = gameState.enemy.selectedButton + 1;
		}
	}

	if ( [38, 87].includes( event.keyCode ) ) { // Up
		if ( gameState.enemy.selectedButton > 3 ) {
			gameState.enemy.selectedButton = gameState.enemy.selectedButton - 3;
		}
	}

	if ( [40, 83].includes( event.keyCode ) ) { // Down
		if ( gameState.enemy.selectedButton < 7 ) {
			gameState.enemy.selectedButton = gameState.enemy.selectedButton + 3;
		}
	}

	var $button = $( '.button-spot[data-spot=\'' + gameState.enemy.selectedButton + '\']' );
	$button.focus();

	if ( [32, 13].includes( event.keyCode ) ) { // Interact
		onButtonChosen( $button );
	}
}

function onButtonChosen( $button ) {

	var buttonId = parseInt( $button.attr( 'data-spot' ) );
	if ( gameState.player.buttons.includes( buttonId ) || gameState.enemy.buttons.includes( buttonId ) ) {
		$( '.audio-effect-fail' )[0].pause();
		$( '.audio-effect-fail' )[0].currentTime = 0;
		$( '.audio-effect-fail' )[0].play();
		return; // Invalid move
	}

	if ( gameState.player.isTurn ) {
		gameState.player.buttons.push( buttonId );
		$( '.character-player.clonable' ).clone().removeClass( 'clonable' ).appendTo( $button ).show();
	} else if ( gameState.enemy.isTurn ) {
		gameState.enemy.buttons.push( buttonId );
		$( '.character-enemy.clonable' ).clone().removeClass( 'clonable' ).appendTo( $button ).show();
	}

	$button.blur();
	checkGameFinished();
	if ( ! gameState.finished ) {
		switchTurns();
	}
}

function switchTurns() {
	gameState.player.isTurn = ! gameState.player.isTurn;
	gameState.enemy.isTurn = ! gameState.enemy.isTurn;
	$( '.turn-text' ).hide();
	if ( gameState.player.isTurn ) {
		$( '.turn-text-player' ).show();
	} else if ( gameState.enemy.isTurn ) {
		$( '.turn-text-enemy' ).show();
	}

	if ( gameOptions.players.length == 1 ) {
		setTimeout(moveCPUEnemy, 1000 + ( Math.random() * 2000 ));
	}
}

function moveCPUEnemy() {
	if ( ! gameState.enemy.isTurn ) {
		return;
	}

	var buttonId = getRandomInteger( 1, 9 );
	if ( gameState.player.buttons.includes( buttonId ) || gameState.enemy.buttons.includes( buttonId ) ) {
		moveCPUEnemy();
		return;
	}

	var $button = $( '.button-spot[data-spot=\'' + buttonId + '\']' );
	onButtonChosen( $button );
}

function checkGameFinished() {
	var playerWinCon = getPlayerWinningCondition( gameState.player.buttons );
	var enemyWinCon = getPlayerWinningCondition( gameState.enemy.buttons );

	if ( playerWinCon ) {
		gameState.finished = true;
		$( '.audio-music-ingame' )[0].pause();

		$( '.audio-effect-rubberduck-1' )[0].pause();
		$( '.audio-effect-rubberduck-1' )[0].currentTime = 0;
		$( '.audio-effect-rubberduck-1' )[0].play();

		gameCompleted( 1 );

		playerWinCon.forEach(( winningButton, index ) => {
			$( '.button-spot[data-spot=\'' + winningButton + '\']' ).addClass( 'winning' );
		});
	} else if ( enemyWinCon ) {
		gameState.finished = true;
		enemyWinCon.forEach(( winningButton, index ) => {
			$( '.button-spot[data-spot=\'' + winningButton + '\']' ).addClass( 'winning' );
		});

		$( '.audio-music-ingame' )[0].pause();

		$( '.audio-effect-rubberduck-2' )[0].pause();
		$( '.audio-effect-rubberduck-2' )[0].currentTime = 0;
		$( '.audio-effect-rubberduck-2' )[0].play();

		if ( gameOptions.players.length > 1 ) {
			gameCompleted( 2 );
		} else {
			gameCompleted( 0 );
		}
	} else if ( gameState.player.buttons.length + gameState.enemy.buttons.length >= 9 ) {
		gameState.finished = true;
		$( '.audio-music-ingame' )[0].pause();
		gameCompleted( -1 );
	}
}

function getPlayerWinningCondition(playerButtons) {
	var winningCombinations = [
		[1, 2, 3], // Top row
		[4, 5, 6], // Middle row
		[7, 8, 9], // Bottom row
		[1, 4, 7], // Left column
		[2, 5, 8], // Middle column
		[3, 6, 9], // Right column
		[1, 5, 9], // Diagonal from top-left to bottom-right
		[3, 5, 7], // Diagonal from top-right to bottom-left
	];

	for (var combination of winningCombinations) {
		var isWinningCombination = combination.every((button) => playerButtons.includes(button));
		if (isWinningCombination) {
		  	return combination; // Player has won
		}
	}

	return null; // Player has not won
}

function onResize() {
	// In a timeout, as browser first fires the resize event before redrawing elements.
	setTimeout(() => {
		gameState.level.width = $( '.level' ).width();
		gameState.level.height = $( '.level' ).height();
	}, 1);
}
