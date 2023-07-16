var urlObject = new URL(window.location.href);
var gameOptions = {
	level: JSON.parse( $('.game').attr( 'data-level' ) ),
	nextLevel: $('.game').attr( 'data-next-level' ),
	mode: urlObject.searchParams.get( 'mode' ) ? urlObject.searchParams.get( 'mode' ) : 'story',
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
}

function onButtonStartClick() {
	$( '.instructions' ).hide();
	startGame();
}

function gameCompleted( won ) {
	if ( null !== won ) {
		initializeResults( won );
	} else {
		initializeChat();
	}
}

function goToNextLevel() {
	var url = new URL(window.location.href);
	if ( gameOptions.mode === 'story' ) {
		url.searchParams.set('level', gameOptions.nextLevel);
		url.searchParams.set('mode', gameOptions.mode);
	} else {
		url.searchParams.set('level', 'start');
		url.searchParams.set('mode', gameOptions.mode);
	}
	window.location.href = url.toString();
}

// =====================
// Results
// =====================

function initializeResults( won ) {
	addResultsEventListeners();

	$( '.results' ).css( 'display', 'flex' );
	if ( won ) {
		$( '.results-option-lost' ).hide();
	} else {
		$( '.results-option-won' ).hide();
	}
}

function addResultsEventListeners() {
	$( '.button-results-won' ).on( 'click', onResultsWonButtonClick );
	$( '.button-results-lost' ).on( 'click', onResultsLostButtonClick );
}

function onResultsWonButtonClick() {
	$( '.results' ).hide();
	initializeChat();
}

function onResultsLostButtonClick() {
	window.location.reload();
}

// =====================
// Chat logic
// =====================

var currentChatMessageIndex = 0;
var messageGeneratorTimeouts = [];

function initializeChat() {
	$( '.level' ).hide();
	if ( gameOptions.mode !== 'story' ) {
		goToNextLevel();
		return;
	}

	addChatEventListeners();
	$( '.audio-music-chat' )[0].play();
	$( '.chat' ).show();
	showChatMessage();
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
		$( '.audio-effect-rubberduck2' )[0].pause();
		$( '.audio-effect-rubberduck2' )[0].currentTime = 0;
		$( '.audio-effect-rubberduck2' )[0].play();
	} else {
		$( '.audio-effect-rubberduck' )[0].pause();
		$( '.audio-effect-rubberduck' )[0].currentTime = 0;
		$( '.audio-effect-rubberduck' )[0].play();
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
