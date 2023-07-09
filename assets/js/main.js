var levelObject = JSON.parse( $('.game').attr( 'data-level' ) );

function initialize() {
	$( '.audio-music' ).each( function( index ) {
		$( this )[0].volume = 0.01;
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

function gameCompleted() {
	$( '.level' ).hide();

	initializeChat();
}

function goToNextLevel() {
	var url = new URL(window.location.href);
	url.searchParams.set('level', $('.game').attr( 'data-next-level' ));
	window.location.href = url.toString();
}

// =====================
// Chat logic
// =====================

var currentChatMessageIndex = 0;
var messageGeneratorTimeouts = [];

function initializeChat() {
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
	if ( ! levelObject.chat ) {
		$( '.audio-music-chat' )[0].pause();
		goToNextLevel();
	}

	var chatMessage = levelObject.chat.messages[currentChatMessageIndex] ?? null;
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
		$( '.audio-effect-rubberduck2' )[0].play();
	} else {
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
				$chatTalkerElement.css("transform", 'translateY(' + pixels + 'px)');
			}
			if ( newText.length === chatMessage.message.length ) {
				$chatTalkerElement.css("transform", 'translateY(0px)');
			}
		}, i * 20 ) );
	}

	currentChatMessageIndex++;
}

$( document ).ready( initialize() );
