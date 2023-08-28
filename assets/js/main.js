var urlObject = new URL(window.location.href);
var gameOptions = {
	level: JSON.parse( $('.game').attr( 'data-level' ) ),
	nextLevel: $('.game').attr( 'data-next-level' ),
	availableCharacters: JSON.parse( $('.game').attr( 'data-characters' ) ),
	mode: urlObject.searchParams.get( 'mode' ) ? urlObject.searchParams.get( 'mode' ) : 'story',
	players: urlObject.searchParams.getAll( 'players[]' ).length ? urlObject.searchParams.getAll( 'players[]' ).length : 1,
	characters: urlObject.searchParams.getAll( 'players[]' ).length > 0 ? urlObject.searchParams.getAll( 'players[]' ) : [ 'maarten' ],
	loading: {
		fakeInterval: null,
		current: 0,
		fakeCurrent: 0,
		total: 0,
	}
};

function initialize() {
	setAudioVolumes();

	addLoadingEventListeners();
	addVolumeSlidersEventListeners();

	// Prepare loading both real and fake
	gameOptions.loading.total += $( 'audio' ).length;
	gameOptions.loading.fakeInterval = setInterval(onLoadingInterval, 8 / gameOptions.loading.total * 1000);
}

function addVolumeSlidersEventListeners() {
	$( '#volume-audio-effect' ).on( 'change input', onChangeVolume );
	$( '#volume-audio-voice' ).on( 'change input', onChangeVolume );
	$( '#volume-audio-music' ).on( 'change input', onChangeVolume );
}

function onChangeVolume() {
	// Store volumes
	localStorage.setItem( 'volume-audio-music', parseInt( $( '#volume-audio-music' ).val() ) );
	localStorage.setItem( 'volume-audio-effect', parseInt( $( '#volume-audio-effect' ).val() ) );

	// Set audio volumes from stored data
	setAudioVolumes();
}

function setAudioVolumes() {
	var musicVolume = localStorage.getItem( 'volume-audio-music' );
	musicVolume = musicVolume !== null ? parseInt( musicVolume ) : 20;
	var effectVolume = localStorage.getItem( 'volume-audio-effect' );
	effectVolume = effectVolume !== null ? parseInt( effectVolume ) : 100;
	var voiceVolume = effectVolume / 2;

	$( '#volume-audio-music' ).val( musicVolume );
	$( '#volume-audio-effect' ).val( effectVolume );
	$( '.volume-audio-music-value' ).text(musicVolume);
	$( '.volume-audio-effect-value' ).text(effectVolume);

	$( '.audio-music' ).each( function( index ) {
		$( this )[0].volume = parseFloat(musicVolume / 100);
	} );

	$( '.audio-effect' ).each( function( index ) {
		$( this )[0].volume = parseFloat(effectVolume / 100);
	} );

	$( '.audio-voice' ).each( function( index ) {
		$( this )[0].volume = parseFloat(voiceVolume / 100);
	} );
}

function addLoadingEventListeners() {
	$( 'audio' ).on( 'canplaythrough', onLoadingItemLoaded );
}

/**
 * Actual asset is loaded
 */
function onLoadingItemLoaded() {
	gameOptions.loading.current++;
	updateLoadingProgress();
}

/**
 * Fake asset is loaded
 */
function onLoadingInterval() {
	gameOptions.loading.fakeCurrent++;
	updateLoadingProgress();
}

/**
 * Update the progress bar using the furthest of the real or fake loading
 */
function updateLoadingProgress() {
	var currentToUse = Math.max( gameOptions.loading.current, gameOptions.loading.fakeCurrent );
	var percent = currentToUse / gameOptions.loading.total * 100;
	$( '.loadingbar-progress' ).css( 'width', percent + '%' );
	$( '.loadingbar-text' ).text( Math.round( percent ) + '%' );

	if ( currentToUse === gameOptions.loading.total ) {
		allAssetsLoaded();
	}
}

/**
 * Everything is loaded. Clear fake timeout and go to next screen after a small delay.
 */
function allAssetsLoaded() {
	clearInterval( gameOptions.loading.fakeInterval );
	gameOptions.loading.fakeInterval = null;

	setTimeout(() => {
		addEventListeners();
		$( '.loading' ).hide();
		$( '.instructions' ).css( 'display', 'flex' );
		initializeGame();
	}, 200);
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
	url.searchParams.delete('players[]');
	gameOptions.characters.forEach(character => {
		url.searchParams.append('players[]', character);
	});
	window.location.href = url.toString();
}

// =====================
// Results
// =====================

/**
 * Init results based on player number that has won
 * - 0: enemy
 * - 1: player 1
 * - 2: player 2
 * - -1: draw
 * @param {number} won
 */
function initializeResults( playerNumberWon ) {
	addResultsEventListeners();

	$( '.results-option' ).hide();
	if ( playerNumberWon > 0 ) {
		if ( gameOptions.players == 1 ) {
			$( '.results-option-won' ).show();
		} else {
			$( '.results-minigame-player-number' ).text( playerNumberWon );
			$( '.results-option-won-minigame' ).show();
		}
	} else if ( playerNumberWon === 0 ) {
		if ( gameOptions.mode === 'story' ) {
			$( '.results-option-lost' ).show();
		} else {
			$( '.results-option-lost-minigame' ).show();
		}
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
	if ( gameOptions.mode !== 'story' ) {
		goToNextLevel( gameOptions.level.id === 'start' ? null : 'start' );
		return;
	}
}

function onResultsDrawButtonClick() {
	if ( gameOptions.mode === 'story' ) {
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
		// Replace images, on start level no url param is present
		var currentImgId = $( '.talker-player img' ).attr( 'src').split( '/' );
		currentImgId = currentImgId[currentImgId.length - 1].split( '.' )[0].split('-')[0];
		$( '.talker-player img' ).attr( 'src', $( '.talker-player img' ).attr( 'src').replace( currentImgId, gameOptions.characters[0] ?? 'maarten' ) );

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

	var messageToShow = chatMessage.message;
	if ( chatMessage.talker == 'player' ) {
		// Replace name, on start level no url param is present
		var oldCharacterNameParts = chatMessage.message.split(':');
		var oldCharacterName = oldCharacterNameParts[0];

		messageToShow = chatMessage.message.replace( oldCharacterName, gameOptions.availableCharacters[gameOptions.characters[0] ?? 'maarten'].name );
		messageToShow = messageToShow.charAt(0).toUpperCase() + messageToShow.slice(1);
	}

	for (var i = 0; i < messageToShow.length; i++) {
		messageGeneratorTimeouts.push( setTimeout(function () {
			var currentText = $chatMessageElement.text();
			var charToAdd = messageToShow.charAt(currentText.length);
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
			if ( newText.length === messageToShow.length ) {
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

/* consoleimg v1.0 - chris johnson / @defaced */
var consoleimg = (function () {
	return {
	  load: function (i, { size: s = 320, color: c = 'transparent' } = {}) {
		var r = new FileReader()
		r.addEventListener('load', function () {
		  /* Format the CSS string for console.log */
		  var o = 'background: url(\'' + r.result + '\') left top no-repeat; font-size: ' + s + 'px; background-size: contain; background-color:' + c
		  /* Output to the console. */
		  console.log('%c     ', o)
		}, false)
		fetch(i)
		/* Return the data as a blob. */
		  .then(r => r.blob())
		  .then(b => {
			/* Only proceed if the blob is an image. */
			if (b.type.indexOf('image') === 0) {
			  /* Warn if larger than the 8KB that Firefox allows. */
			  if (b.size > 8192 && navigator.userAgent.indexOf('Firefox') > 0) {
				throw new Error('Image size too big to be displayed in Firefox.')
			  }
			  return b
			} else {
			  /* Warn if the blob is not an image. */
			  throw new Error('Valid image not found.')
			}
		  })
		  /* Read the blob as base64. */
		  .then(i => r.readAsDataURL(i))
		  .catch(e => console.warn(e.message))
	  }
	}
})()
consoleimg.load('assets/images/giant-duck-wat.jpg', {size: 320});
console.log("%c🦆 QUACK! A cheater? No no no, we don't allow those here! Feel free to look into the code after playing by asking for access to the GitHub repository.", "background: #0f0f23; color: #00cc00; font-size: 14px; font-weight: normal; border-radius: 10px; padding: 10px")
