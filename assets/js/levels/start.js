var gameState = {
	level: {
		width: $( '.level' ).width(),
		height: $( '.level' ).height(),
	},
	player2CharacterIndex: 0,
}

function initializeGame() {
	addGameEventListeners();
}

function addGameEventListeners() {
	$( document ).on( 'showChatMessage', onShowChatMessage );

	$( '.button-setting-back' ).on( 'click', onBackButtonClick );
	$( '.button-setting-mode' ).on( 'click', onModeButtonClick );
	$( '.button-setting-minigame' ).on( 'click', onMinigameButtonClick );
	$( '.button-setting-players' ).on( 'click', onPlayersButtonClick );
	$( '.button-setting-characters' ).on( 'click', onCharacterButtonClick );
}

function startGame() {
	$( '.audio-music-menu' )[0].play();
	showSettingMode();
}

function onShowChatMessage( event, index ) {
	if ( index === 0 ) {
		$presentElement = $( '<img class="present pixelated" als="" src="assets/images/present.png" />' );
		$presentElement.css( 'bottom', '20px' );
		$presentElement.css( 'left', '30%' );
		$('.talker__container').append($presentElement);
	}

	if ( index === 3 ) {
		$('.present').css( 'left', 'calc(70% - ' + $('.present').width() + 'px)' );
	}
}

function onBackButtonClick() {
	$( this ).blur();
	if ( $( '.setting-container-minigame' ).is( ':visible' ) ) {
		showSettingCharacters();
	} else if ( $( '.setting-container-players' ).is( ':visible' ) ) {
		$( '.button-setting-back' ).hide();
		showSettingMode();
	} else if ( $( '.setting-container-characters' ).is( ':visible' ) ) {
		if ( gameOptions.mode == 'story' ) {
			$( '.button-setting-back' ).hide();
			showSettingMode();
		} else {
			showSettingPlayers();
		}
	}
}

function onModeButtonClick() {
	$( '.button-setting-back' ).show();

	gameOptions.mode = $( this ).attr( 'data-mode' );
	if ( gameOptions.mode == 'story' ) {
		gameOptions.players = 1;
		showSettingCharacters();
	} else {
		showSettingPlayers();
	}
}

function onPlayersButtonClick() {
	gameOptions.players = parseInt( $( this ).attr( 'data-players' ) );
	showSettingCharacters();
}

function onCharacterButtonClick() {
	chooseCharacter( $( this ) );
}

function onCharacterSelectKeyUp( event ) {
	if ( [37, 65].includes( event.keyCode ) ) { // Left
		console.log('left');
		console.log(gameState.player2CharacterIndex % 2);
		if ( gameState.player2CharacterIndex % 2 != 0 ) {
			gameState.player2CharacterIndex = gameState.player2CharacterIndex - 1;
		}
	}

	if ( [39, 68].includes( event.keyCode ) ) { // Right
		console.log('right');
		console.log(gameState.player2CharacterIndex % 2);
		if ( gameState.player2CharacterIndex % 2 != 1 ) {
			gameState.player2CharacterIndex = gameState.player2CharacterIndex + 1;
		}
	}

	if ( [38, 87].includes( event.keyCode ) ) { // Up
		if ( gameState.player2CharacterIndex > 1 ) {
			gameState.player2CharacterIndex = gameState.player2CharacterIndex - 2;
		}
	}

	if ( [40, 83].includes( event.keyCode ) ) { // Down
		if ( gameState.player2CharacterIndex < $( '.button-setting-characters' ).length - 1 ) {
			gameState.player2CharacterIndex = gameState.player2CharacterIndex + 2;
		}
	}

	var $button = $( '.button-setting-characters' ).eq( gameState.player2CharacterIndex );
	$button.focus();

	if ( [32, 13].includes( event.keyCode ) ) { // Interact
		chooseCharacter( $button );
	}
}

function chooseCharacter( $button ) {
	$button.blur();
	if ( gameOptions.characters.includes( $button.attr( 'data-character' ) ) ) {
		$( '.audio-effect-fail' )[0].pause();
		$( '.audio-effect-fail' )[0].currentTime = 0;
		$( '.audio-effect-fail' )[0].play();
		return; // Already chosen character
	}

	gameOptions.characters.push( $button.attr( 'data-character' ) );
	$button.addClass( 'chosen' );

	if ( gameOptions.players > 1 ) {
		$( '.setting-characters-title-player' ).text( 'Player ' + ( gameOptions.characters.length + 1 ) + ': ' );
	}

	if ( gameOptions.players !== gameOptions.characters.length ) { // More players need to select
		$( document ).on( 'keyup', onCharacterSelectKeyUp );
		var $button = $( '.button-setting-characters' ).eq( gameState.player2CharacterIndex );
		$button.focus();
		return;
	}

	$( document ).off( 'keyup', onCharacterSelectKeyUp );
	if ( gameOptions.mode == 'story' ) {
		stopMenu();
	} else {
		showSettingMinigame();
	}
}

function onMinigameButtonClick() {
	gameOptions.nextLevel = $( this ).attr( 'data-level' );
	stopMenu();
}

function showSettingMode() {
	$( '.setting-container' ).hide();
	$( '.setting-container-mode' ).show();

	$( '.audio-voice-gamemode' )[0].pause();
	$( '.audio-voice-gamemode' )[0].currentTime = 0;
	$( '.audio-voice-gamemode' )[0].play();
}

function showSettingMinigame() {
	$( '.setting-container' ).hide();
	$( '.setting-container-minigame' ).show();

	$( '.audio-voice-minigame' )[0].pause();
	$( '.audio-voice-minigame' )[0].currentTime = 0;
	$( '.audio-voice-minigame' )[0].play();
}

function showSettingPlayers() {
	$( '.setting-container' ).hide();
	$( '.setting-container-players' ).show();

	$( '.audio-voice-players' )[0].pause();
	$( '.audio-voice-players' )[0].currentTime = 0;
	$( '.audio-voice-players' )[0].play();
}

function showSettingCharacters() {
	$( '.setting-container' ).hide();
	$( '.button-setting-characters' ).removeClass( 'chosen' );
	gameState.player2CharacterIndex = 0;
	$( '.button-setting-characters' ).eq( gameState.player2CharacterIndex ).focus();
	if ( gameOptions.players > 1 ) {
		$( '.setting-characters-title-player' ).text( 'Player 1: ' );
	}

	$( '.setting-container-characters' ).show();

	$( '.audio-voice-characters' )[0].pause();
	$( '.audio-voice-characters' )[0].currentTime = 0;
	$( '.audio-voice-characters' )[0].play();

	gameOptions.characters = [];
}

function stopMenu() {
	$( '.audio-music-menu' )[0].pause();
	gameCompleted( null );
}
