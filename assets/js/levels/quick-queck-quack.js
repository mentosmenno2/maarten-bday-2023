var gameState = {
	level: {
		width: $( '.level' ).width(),
		height: $( '.level' ).height(),
	},
	player: {
		isTurn: false,
		buttons: [],
	},
	enemy: {
		isTurn: false,
		buttons: [],
	}
}

function initializeGame() {
	$( window ).on( 'resize', onResize );

	disableButtons();

	if ( Math.round( Math.random() ) ) {
		gameState.player.isTurn = true;
		gameState.enemy.isTurn = false;
	} else {
		gameState.player.isTurn = false;
		gameState.enemy.isTurn = true;
	}
	switchTurns();
}

function addGameEventListeners() {
	$( '.button-spot' ).on( 'click', onButtonClick );
}

function startGame() {
	addGameEventListeners();
	$( '.audio-music-ingame' )[0].play();
	enableAvailableButtons();
}

function onButtonClick( event ) {
	disableButtons();

	$element = $( this );
	var buttonId = parseInt( $element.attr( 'data-spot' ) );
	if ( gameState.player.isTurn ) {
		gameState.player.buttons.push( buttonId );
		$( '.character-player.clonable' ).clone().removeClass( 'clonable' ).appendTo( $element ).show();
	} else if ( gameState.enemy.isTurn ) {
		gameState.enemy.buttons.push( buttonId );
		$( '.character-enemy.clonable' ).clone().removeClass( 'clonable' ).appendTo( $element ).show();
	}

	checkGameFinished();
	switchTurns();
	enableAvailableButtons();
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
}

function disableButtons() {
	$( '.button-spot' ).attr( 'disabled', true );
}

function enableAvailableButtons() {
	$( '.button-spot' ).each(function (index) {
		var $element = $( this );
		var buttonId = parseInt( $element.attr( 'data-spot' ) );

		if ( ! gameState.player.buttons.includes( buttonId ) && ! gameState.enemy.buttons.includes( buttonId ) ) {
			$element.attr( 'disabled', false );
		}
	});
}

function checkGameFinished() {
	// Player won
	var playerWinCon = getPlayerWinningCondition( gameState.player.buttons );
	if ( playerWinCon ) {
		$( '.audio-music-ingame' )[0].pause();

		$( '.audio-effect-rubberduck-1' )[0].pause();
		$( '.audio-effect-rubberduck-1' )[0].currentTime = 0;
		$( '.audio-effect-rubberduck-1' )[0].play();

		gameCompleted( 1 );

		playerWinCon.forEach(( winningButton, index ) => {
			$( '.button-spot[data-spot=\'' + winningButton + '\']' ).addClass( 'winning' );
		});
	}

	// Enemy won
	var enemyWinCon = getPlayerWinningCondition( gameState.enemy.buttons );
	if ( enemyWinCon ) {
		enemyWinCon.forEach(( winningButton, index ) => {
			$( '.button-spot[data-spot=\'' + winningButton + '\']' ).addClass( 'winning' );
		});

		$( '.audio-music-ingame' )[0].pause();

		$( '.audio-effect-rubberduck-2' )[0].pause();
		$( '.audio-effect-rubberduck-2' )[0].currentTime = 0;
		$( '.audio-effect-rubberduck-2' )[0].play();

		if ( gameOptions.players > 1 ) {
			gameCompleted( 2 );
		} else {
			gameCompleted( 0 );
		}
	}

	// Draw
	if ( gameState.player.buttons.length + gameState.enemy.buttons.length >= 9 ) {
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
