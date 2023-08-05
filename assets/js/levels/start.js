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
	$( '.setting-container' ).hide();
	$( '.setting-container-mode' ).show();

	$( '.audio-music-menu' )[0].play();
}

function onShowChatMessage( event, index ) {
	if ( index === 0 ) {
		$presentElement = $( '<img class="present pixelated" als="" src="assets/images/present.png" />' );
		$presentElement.css( 'bottom', 0 );
		$presentElement.css( 'left', '30%' );
		$('.talker__container').append($presentElement);
	}

	if ( index === 10 ) {
		var width = $('.present').width();
		$('.present').css( 'left', 'calc(70% - ' + width + 'px)' );
	}
}

function onModeButtonClick() {
	gameOptions.mode = $( this ).attr( 'data-mode' );
	if ( gameOptions.mode == 'story' ) {
		stopMenu();
	} else {
		$( '.setting-container' ).hide();
		$( '.setting-container-minigame' ).show();
	}
}

function onMinigameButtonClick() {
	gameOptions.nextLevel = $( this ).attr( 'data-level' );
	$( '.setting-container' ).hide();
	$( '.setting-container-players' ).show();
}

function onPlayersButtonClick() {
	gameOptions.players = parseInt( $( this ).attr( 'data-players' ) );
	stopMenu();
}

function stopMenu() {
	$( '.audio-music-menu' )[0].pause();
	gameCompleted( null );
}
