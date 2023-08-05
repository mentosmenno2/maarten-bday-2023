function initializeGame() {
	addGameEventListeners();
}

function addGameEventListeners() {
	$( document ).on( 'showChatMessage', onShowChatMessage );
	$( '.button-setting-mode' ).on( 'click', onModeButtonClick );
	$( '.button-setting-minigame' ).on( 'click', onMinigameButtonClick );
	$( '.button-setting-players' ).on( 'click', onPlayersButtonClick );
}

function startGame() {
	$( '.audio-music-menu' )[0].play();

	$( '.setting-container' ).hide();
	$( '.setting-container-mode' ).show();

	$( '.audio-voice-gamemode' )[0].pause();
	$( '.audio-voice-gamemode' )[0].currentTime = 0;
	$( '.audio-voice-gamemode' )[0].play();
}

function onShowChatMessage( event, index ) {
	if ( index === 0 ) {
		$presentElement = $( '<img class="present pixelated" als="" src="assets/images/present.png" />' );
		$presentElement.css( 'bottom', 0 );
		$presentElement.css( 'left', '30%' );
		$('.talker__container').append($presentElement);
	}

	if ( index === 3 ) {
		$('.present').css( 'left', 'calc(70% - ' + $('.present').width() + 'px)' );
	}
}

function onModeButtonClick() {
	gameOptions.mode = $( this ).attr( 'data-mode' );
	if ( gameOptions.mode == 'story' ) {
		stopMenu();
	} else {
		$( '.setting-container' ).hide();
		$( '.setting-container-players' ).show();

		$( '.audio-voice-players' )[0].pause();
		$( '.audio-voice-players' )[0].currentTime = 0;
		$( '.audio-voice-players' )[0].play();
	}
}

function onMinigameButtonClick() {
	gameOptions.nextLevel = $( this ).attr( 'data-level' );
	stopMenu();
}

function onPlayersButtonClick() {
	gameOptions.players = parseInt( $( this ).attr( 'data-players' ) );

	$( '.setting-container' ).hide();
	$( '.setting-container-minigame' ).show();

	$( '.audio-voice-minigame' )[0].pause();
	$( '.audio-voice-minigame' )[0].currentTime = 0;
	$( '.audio-voice-minigame' )[0].play();
}

function stopMenu() {
	$( '.audio-music-menu' )[0].pause();
	gameCompleted( null );
}
