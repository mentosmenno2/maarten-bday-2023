var urlObject = new URL(window.location.href);
var gameOptions = {
	level: JSON.parse( $('.game').attr( 'data-level' ) ),
	nextLevel: $('.game').attr( 'data-next-level' ),
	mode: urlObject.searchParams.get( 'mode' ) ? urlObject.searchParams.get( 'mode' ) : 'story',
	players: parseInt( urlObject.searchParams.get( 'players' ) ? urlObject.searchParams.get( 'players' ) : '1' ),
};

function initialize() {
	$( '.audio-music' ).each( function( index ) {
		$( this )[0].volume = 0.02;
	} );
	addEventListeners();
	initializeGame();
}

function addEventListeners() {
	$( '.button-start' ).on( 'click', onButtonStartClick );
	$( '.button-sfx' ).on( 'click', onButtonSoundEffect );
}

function onButtonStartClick() {
	$( '.instructions' ).hide();
	startGame();
}

function onButtonSoundEffect() {
	$( '.audio-effect-button' )[0].pause();
	$( '.audio-effect-button' )[0].currentTime = 0;
	$( '.audio-effect-button' )[0].play();
}

/**
 * Checks if game is won.
 * - 0: enemy
 * - 1: player 1
 * - 2: player 2
 * - -1: draw
 * @param {number} won
 */
function gameCompleted( won ) {
	if ( null !== won ) {
		initializeResults( won );
	} else {
		initializeChat();
	}
}

function goToNextLevel( level = null ) {
	var url = new URL(window.location.href);
	url.searchParams.set('level', level ? level : gameOptions.nextLevel);
	url.searchParams.set('mode', gameOptions.mode);
	url.searchParams.set('players', gameOptions.players);
	window.location.href = url.toString();
}

// =====================
// Results
// =====================

function initializeResults( playerNumberWon ) {
	addResultsEventListeners();

	$( '.results-option' ).hide();
	if ( playerNumberWon > 0 ) {
		if ( gameOptions.players == 1 ) {
			$( '.results-option-won' ).show();
		} else {
			$( '.results-mp-player-number' ).text( playerNumberWon );
			$( '.results-option-won-mp' ).show();
		}
	} else if ( playerNumberWon === 0 ) {
		$( '.results-option-lost' ).show();
	} else {
		$( '.results-option-draw' ).show();
	}

	$( '.results' ).css( 'display', 'flex' );
}

function addResultsEventListeners() {
	$( '.button-results-won' ).on( 'click', onResultsWonButtonClick );
	$( '.button-results-lost' ).on( 'click', onResultsLostButtonClick );
	$( '.button-results-draw' ).on( 'click', onResultsDrawButtonClick );
}

function onResultsWonButtonClick() {
	$( '.results' ).hide();
	initializeChat();
}

function onResultsLostButtonClick() {
	window.location.reload();
}

function onResultsDrawButtonClick() {
	if ( gameOptions.players == 1 && gameOptions.mode === 'story' ) {
		window.location.reload();
	} else {
		$( '.results' ).hide();
		initializeChat();
	}
}

// =====================
// Chat logic
// =====================

var currentChatMessageIndex = 0;
var messageGeneratorTimeouts = [];

function initializeChat() {
	$( '.level' ).hide();
	if ( gameOptions.mode !== 'story' ) {
		goToNextLevel( gameOptions.level.id === 'start' ? null : 'start' );
		return;
	}

	if ( gameOptions.level.chat ) {
		$( '.audio-music-chat' )[0].play();
		$( '.chat' ).show();

		setTimeout(() => {
			$( '.talker__container' ).addClass('initialized');
		}, 500);
		setTimeout(() => {
			addChatEventListeners();
			showChatMessage();
		}, 3000);
	} else {
		goToNextLevel();
	}
}

function addChatEventListeners() {
	$( '.chat' ).on( 'click', onChatClick )
}

function onChatClick() {
	showChatMessage();
}

function showChatMessage() {
	if ( ! gameOptions.level.chat ) {
		$( '.audio-music-chat' )[0].pause();
		goToNextLevel();
	}

	var chatMessage = gameOptions.level.chat.messages[currentChatMessageIndex] ?? null;
	if ( ! chatMessage ) {
		$( '.audio-music-chat' )[0].pause();
		goToNextLevel();
	}

	$(document).trigger('showChatMessage', [currentChatMessageIndex] );
	messageGeneratorTimeouts.forEach(timeout => {
		clearTimeout( timeout );
	});

	$( '.textballoon' ).hide();
	$( '.textballoon' ).text('');
	$chatMessageElement = $( '.textballoon-' + chatMessage.talker );
	$chatMessageElement.show();

	$chatTalkerElement = $( '.talker-' + chatMessage.talker );

	if ( chatMessage.talker == 'player' ) {
		$( '.audio-effect-rubberduck-1' )[0].pause();
		$( '.audio-effect-rubberduck-1' )[0].currentTime = 0;
		$( '.audio-effect-rubberduck-1' )[0].play();
	} else {
		$( '.audio-effect-rubberduck-2' )[0].pause();
		$( '.audio-effect-rubberduck-2' )[0].currentTime = 0;
		$( '.audio-effect-rubberduck-2' )[0].play();
	}

	for (var i = 0; i < chatMessage.message.length; i++) {
		messageGeneratorTimeouts.push( setTimeout(function () {
			var currentText = $chatMessageElement.text();
			var charToAdd = chatMessage.message.charAt(currentText.length);
			var newText = currentText + charToAdd;
			$chatMessageElement.text( newText );

			var shouldMoveTalker = currentText.length % 5 === 0;
			if ( shouldMoveTalker ) {
				var pixels = ( currentText.length % 2  == 0 ) ? 10 : 0;
				$chatTalkerElement.css("-webkit-transform", 'translateY(' + pixels + 'px)');
				$chatTalkerElement.css("-moz-transform", 'translateY(' + pixels + 'px)');
				$chatTalkerElement.css("-ms-transform", 'translateY(' + pixels + 'px)');
				$chatTalkerElement.css("-o-transform", 'translateY(' + pixels + 'px)');
				$chatTalkerElement.css("transform", 'translateY(' + pixels + 'px)');
			}
			if ( newText.length === chatMessage.message.length ) {
				$chatTalkerElement.css("-webkit-transform", 'translateY(0px)');
				$chatTalkerElement.css("-moz-transform", 'translateY(0px)');
				$chatTalkerElement.css("-ms-transform", 'translateY(0px)');
				$chatTalkerElement.css("-o-transform", 'translateY(0px)');
				$chatTalkerElement.css("transform", 'translateY(0px)');
			}
		}, i * 20 ) );
	}

	currentChatMessageIndex++;
}

$( document ).ready( initialize() );
